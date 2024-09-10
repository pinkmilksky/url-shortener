const BASE_URL = 'localhost/'

// Function to validate the URL input and handle errors if URL is invalid
function handleUrlCreation() {
    let urlInput = document.getElementById("input-url").value;
    let errorMessage = document.getElementById("error-message");

    // Clear any previous error messages
    errorMessage.textContent = "";

    // If the URL is not valid, display an error message and stop further execution
    if (!isValidUrl(urlInput)) {
        errorMessage.textContent = "Please enter a valid url";
        return;
    }

    // If the URL is valid, generate a shortened URL ID
    generateShortenedUrlId(urlInput);
}

// Function to delete elements based on the URL input
function handleUrlDeletion() {
    let urlList = document.getElementById("list-url");

    // Convert the list of child elements (URLs) into an array
    let listItems = Array.from(urlList.children);

    // Loop through each list item to check if it should be deleted
    for (let listItem of listItems) {
        if (shouldDeleteListItem(listItem)) {
            // Remove the item if it matches the criteria for deletion
            urlList.removeChild(listItem);
        }
    }
}

// Function to determine if a URL list item should be deleted
function shouldDeleteListItem(listItem) {
    // Helper function to remove trailing slashes from a URL string
    const removeTrailingSlash = (url) => {
        return url.endsWith('/') ? url.slice(0, -1) : url;
    };

    let shortUrl = removeTrailingSlash(listItem.firstChild.href);
    let displayedUrl = listItem.firstChild.text;
    let urlInput = document.getElementById("input-url").value;

    // Delete the list item if input URL is empty, null, or matches the short or long URL
    return urlInput === null || urlInput === "" ||
        shortUrl === urlInput || displayedUrl === urlInput;
}

// Function to generate a random ID and create a shortened URL
function generateShortenedUrlId(fullUrl) {
    // Generate a random string to be used as a URL identifier
    let shortUrlId = generateRandomString(5);

    // Call function to create and display the short URL with the generated ID
    createShortUrlElement(shortUrlId, fullUrl);
}

// Function to create the shortened URL and append it to the list
function createShortUrlElement(shortUrlId, fullUrl) {
    const shortUrl = BASE_URL + shortUrlId;
    let urlList = document.getElementById("list-url");

    // Create list item (<li>) and anchor (<a>) elements
    let listItem = document.createElement("li");
    listItem.className = "list-item"; // Assign a class name

    let urlLink = document.createElement("a");
    urlLink.href = fullUrl;
    urlLink.target = "_blank"; // Open link in a new tab
    urlLink.textContent = shortUrl; // Set the text of the link to the short URL

    // Append the anchor element to the list item
    listItem.appendChild(urlLink);

    // Append the full original URL as text in the list item
    listItem.appendChild(document.createTextNode(" - " + fullUrl));

    // Create and append a span to hold the number of clicks
    let clickCounter = document.createElement("span");
    listItem.appendChild(clickCounter);

    let clickCount = 0;

    // Add an event listener to increment the click count when the link is clicked
    urlLink.addEventListener("click", function () {
        clickCount++;
        clickCounter.textContent = ` Clicks: ${clickCount}`;
    });


    // Create the "Edit" button
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () {
        toggleEditMode(listItem, urlLink, editButton);
    }
    listItem.appendChild(editButton);


    // Append the completed list item to the URL list
    urlList.appendChild(listItem);
}


// Function to toggle between "Edit" and "Save" mode for editing the URL
function toggleEditMode(listItem, urlLink, editButton) {
    let isEditing = editButton.textContent === "Save";

    if (isEditing) {
        // If in "Save" mode, save the edited URL and update the display
        editButton.textContent = "Edit";
        let input = listItem.firstChild;
        urlLink.textContent = BASE_URL + input.value;
        listItem.removeChild(input);
        listItem.prepend(urlLink);
    } else {
        // If in "Edit" mode, replace the link text with an input field for editing

        editButton.textContent = "Save";

        let oldShortUrlId = urlLink.textContent.slice(urlLink.textContent.indexOf("/") + 1, urlLink.textContent.length)
        listItem.removeChild(urlLink);
        let shortUrlIdInput = document.createElement("input");
        shortUrlIdInput.type = "text";
        shortUrlIdInput.value = oldShortUrlId;

        listItem.prepend(shortUrlIdInput)
    }
}


// Helper function to generate a random alphanumeric string of a given length
function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}

// Function to check if the provided URL matches a valid format
function isValidUrl(url) {
    const regex = /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}([\/\w\-.~:@?#=&%+]*)?$/;
    return regex.test(url);
}
