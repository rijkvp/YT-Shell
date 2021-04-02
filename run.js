// No distracting title
document.title = "YouTube"

// Detect dark mode
var darkMode = false;
var darkAttribute = document.documentElement.getAttribute("dark")
if (darkAttribute != null && darkAttribute != "") {
    if (darkAttribute == "true") {
        darkMode = true;
    }
}

// Removes the element and replaces it with some text
function disableElement(element, text, fontSize) {
    var textElement = document.createElement("div");
    textElement.innerHTML = '<h1>' + text + '</h1>';
    textElement.setAttribute('style', ' font-size: ' + fontSize + 'rem; margin: 40px; font-weight: bold; font-family: "Lucida Console", Monaco, monospace;');

    textElement.style.padding = "12px";
    var creditsText = document.createElement("p");
    creditsText.innerHTML = "YT-Shell"
    creditsText.setAttribute("style", "margin: 4px, 0px; fontSize: " + 0.6 * fontSize + ";")
    textElement.appendChild(creditsText)
    if (!darkMode) {
        textElement.style.color = "black";
        textElement.style.background = "rgba(255, 255, 255, 0.5)";
    } else {
        textElement.style.color = "white";
        textElement.style.background = "rgba(0, 0, 0, 0.5)";
    }
    element.innerHTML = "";
    element.appendChild(textElement);
}

// Removes the element from the page
function removeElement(element) {
    if (element != null) {
        element.remove();
    }
}

// Block recommendations
function blockRecommendations() {
    var spans = document.querySelectorAll('[page-subtype]');
    for (i = 0; i < spans.length; i++) {
        var pageSubtype = spans[i].getAttribute('page-subtype');
        switch (pageSubtype) {
            case "home":
                disableElement(spans[i], "RECOMMENDATIONS BLOCKED", 1.7);
                break;
            case "trending":
                disableElement(spans[i], "TRENDING BLOCKED", 2.0);
                break;
            case "subscriptions":
                disableElement(spans[i], "SUBCRIPTIONS BLOCKED", 2.0);
                break;
        }
    }

    switch (window.location.pathname) {
        case "/watch":
            // Block 'related' videos recommendations
            var related = document.getElementById("related");
            if (related != null) {
                disableElement(related, "RECOMMENDATIONS BLOCKED", 1.6);
            }

            // Remove recommendations at the endscreen
            var endScreens = document.getElementsByClassName("html5-endscreen");
            for (i = 0; i < endScreens.length; i++) {
                disableElement(endScreens[i], "Great! At least you wachted untill the end!<br>No end screen with recommendations here :(<br>Are you sure you want to continue wachting instead of doing somthing productive?", 1.5);
            }
            break;
    }
}

// Blocks upcummies: likes, views, subs
function blockUpcummies() {
    switch (window.location.pathname) {
        case "/watch":
            // Hide Like/Dislike count
            var infoContents = document.getElementById("info-contents");
            if (infoContents != null) {
                var videoButtonsContainer = infoContents.getElementsByTagName("ytd-menu-renderer")[0];
                if (videoButtonsContainer != null) {
                    var textElements = videoButtonsContainer.getElementsByTagName("yt-formatted-string");
                    textElements[0].innerHTML = "LIKE";
                    textElements[0].setAttribute("aria-label", "")
                    textElements[1].innerHTML = "DISLIKE";
                    textElements[1].setAttribute("aria-label", "")
                }
            }
            // Remove sentiment bar (below like/dislike)
            var sentimentBars = document.getElementsByTagName("ytd-sentiment-bar-renderer");
            for (i = 0; i < sentimentBars.length; i++) {
                removeElement(sentimentBars[i]);
            }

            var subCountElement = document.getElementById("owner-sub-count");
            removeElement(subCountElement);

            var views = document.getElementById("count");
            removeElement(views);


        case "/results":
            // TODO: Only works with the top results because there are more results loaded later on.. 
            // Block video stats 
            var videoResults = document.getElementsByTagName("ytd-video-renderer");
            for (var i = 0; i < videoResults.length; i++) {
                var metaElements = videoResults[i].getElementsByTagName("ytd-video-meta-block");
                for (var j = 0; j < metaElements.length; j++) {
                    var divs = metaElements[j].getElementsByTagName("div");
                    for (var k = 0; k < divs.length; k++)
                    {
                        if (divs[k].getAttribute("id") == "metadata-line") {
                            removeElement(divs[k].childNodes[0]);
                        }
                    }
                }
            }
            // Block channel stats
            var channelResults = document.getElementsByTagName("ytd-channel-renderer");
            for (var i = 0; i < channelResults.length; i++) {
                var spans = channelResults[i].getElementsByTagName("span");
                for (var j = 0; j < spans.length; j++) {
                    if (spans[j].getAttribute("id") == "subscribers")
                    {
                        removeElement(spans[j]);
                    }
                    if (spans[j].getAttribute("id") == "dot")
                    {
                        removeElement(spans[j]);
                    }
                }
            }
            break;
        case "/channel":
            // Block video and channel stats on channel page
            // TODO: Block sub count and video stats on channel page
            break;
    }
}

// Blocks notifications: the notification panel and the bell next to the sub button
function blockNotifications() {
    // Blocks the notification panel button on every page
    var notificationElements = document.getElementsByTagName("ytd-notification-topbar-button-renderer");
    for (i = 0; i < notificationElements.length; i++) {
        removeElement(notificationElements[i]);
    }
    // Block notification bell
    var iconButtons = document.getElementsByTagName("yt-icon-button");
    for (i = 0; i < iconButtons.length; i++) {
        if (iconButtons[i].classList.contains("ytd-subscription-notification-toggle-button-renderer"))
        {
            removeElement(iconButtons[i]);
        }
    }    
}

function showPage() {
    if (document.body != null) {
        document.body.setAttribute("style", "display: block !important;");
    }
}

function run() {
    blockRecommendations();
    blockUpcummies();
    blockNotifications();

    showPage();
}

if (window.location.hostname == "www.youtube.com") {
    switch (window.location.pathname) {
        case "/feed/explore":
        case "/feed/trending":
        case "/gaming":
            window.location.assign("https://www.youtube.com");
            break;
        default:
            run();
            break;
    }
}
