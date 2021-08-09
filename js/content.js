// Detect dark mode
var darkMode = false;
var darkAttribute = document.documentElement.getAttribute("dark")
if (darkAttribute != null && darkAttribute != "") {
    if (darkAttribute == "true") {
        darkMode = true;
    }
}

// Removes the element and replaces it with some text
function disableElement(element, text) {
    var blockMessage = document.createElement("div");
    blockMessage.classList.add("block-message");
    blockMessage.innerHTML = '<h1>' + text + '</h1>';

    blockMessage.style.padding = "12px";
    var creditsText = document.createElement("p");
    creditsText.innerHTML = "YT-Shell"
    blockMessage.appendChild(creditsText)
    if (!darkMode) {
        blockMessage.style.color = "black";
        blockMessage.style.background = "rgba(0, 0, 0, 0.15)";
    } else {
        blockMessage.style.color = "white";
        blockMessage.style.background = "rgba(0, 0, 0, 0.4)";
    }
    element.innerHTML = "";
    element.appendChild(blockMessage);
}

// Removes the element from the page
function removeElement(element) {
    if (element != null) {
        element.remove();
    }
}

function removeElements(elements) {
    elements.forEach(element => {
        removeElement(element);
    });
}

// Determine the page type based on the URL path
function getPageType() {
    const path = window.location.pathname;
    switch (window.location.pathname) {
        case "/":
            return "home";
        case "/feed/subscriptions":
            return "subscriptions";
        case "/watch":
            return "video";
        case "/results":
            return "search";
        case "/feed/explore":
        case "/feed/trending":
        case "/gaming":
            return "explore";
        default:
            if (path.startsWith("/user") || path.startsWith("/channel")) {
                return "channel";
            } else {
                return null;
            }
    }
}

function getSubTypeElements(subType) {
    var results = [];
    var pageElements = document.querySelectorAll('[page-subtype]');
    pageElements.forEach(element => {
        if (element.getAttribute("page-subtype") == subType) {
            results.push(element);
        }
    });
    return results;
}

function showPage() {
    window.onload = async function () {
        if (document.body != null) {
            // Wait 200 millis to make sure the page is loaded..
            await new Promise(r => setTimeout(r, 200));
            // Show the page
            document.body.setAttribute("style", "opacity: 1 !important;");
        }
    };
}

showPage();