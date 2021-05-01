// Detect dark mode
var darkMode = false;
var darkAttribute = document.documentElement.getAttribute("dark")
if (darkAttribute != null && darkAttribute != "") {
    if (darkAttribute == "true") {
        darkMode = true;
    }
}

// Removes the element and replaces it with some text
function disableElement(element, text, showMessage) {
    if (!showMessage) {
        removeElement(element);
        return;
    }
    var textElement = document.createElement("div");
    textElement.classList.add("block-message");
    textElement.innerHTML = '<h1>' + text + '</h1>';

    textElement.style.padding = "12px";
    var creditsText = document.createElement("p");
    creditsText.innerHTML = "YT-Shell"
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

// Block recommendations
function blockRecommendations(settings) {
    const pageType = getPageType();
    switch (pageType) {
        case "home":
            if (settings.blockHomepage) {
                getSubTypeElements("home").forEach((element) => {
                    disableElement(element, "HOMEPAGE BLOCKED", settings.showMessage);
                });
            }
            break;
        case "subscriptions":
            if (settings.blockSubscriptions) {
                getSubTypeElements("subscriptions").forEach((element) => {
                    disableElement(element, "SUBSCRIPTIONS BLOCKED", settings.showMessage);
                });
            }
            break;
        case "explore":
            if (settings.blockExplore) {
                getSubTypeElements("trending").forEach((element) => {
                    disableElement(element, "EXPLORE FEED BLOCKED", settings.showMessage);
                });
            }
            break;
        case "video":
            // Block 'related' videos recommendations
            if (settings.blockRelated) {
                var related = document.getElementById("related");
                if (related != null) {
                    disableElement(related, "RECOMMENDATIONS BLOCKED", settings.showMessage);
                }
            }

            // Block recommendations at the endscreen
            if (settings.blockEndscreen) {
                var endScreens = document.getElementsByClassName("html5-endscreen");
                for (i = 0; i < endScreens.length; i++) {
                    removeElement(endScreens[i]);
                }
            }
            break;
    }
}

function replaceSubCount(subCountElement) {
    if (subCountElement != null) {
        var subCountStr = subCountElement.innerHTML.split(" ")[0];
        var subCount;
        if (subCountStr.endsWith("M")) {
            subCount = parseFloat(subCountStr.substring(0, subCountStr.length - 1)) * 1000000;
        } else if (subCountStr.endsWith("K")) {
            subCount = parseFloat(subCountStr.substring(0, subCountStr.length - 1)) * 1000;
        } else {
            subCount = parseFloat(subCountStr);
        }
        var audienceSize;
        if (subCount < 10000) {
            audienceSize = "S";
        } else if (subCount < 100000) {
            audienceSize = "M";
        } else if (subCount < 1000000) {
            audienceSize = "L";
        } else if (subCount < 10000000) {
            audienceSize = "XL";
        } else {
            audienceSize = "XXL";
        }

        console.log("AS: " + audienceSize);
        subCountElement.innerHTML = "Audience size: <b>" + audienceSize + "</b>";
        subCountElement.id = "yt-shell-audience-size";
        subCountElement.removeAttribute("aria-label");
    }
}

// Blocks upcummies: likes, views, subs
function blockUpcummies(settings) {
    // Done by CSS now... 

    // const pageType = getPageType();
    // switch (pageType) {
    //     case "video":
    //         // Hide Like/Dislike count
    //         var infoContents = document.getElementById("info-contents");
    //         if (infoContents != null) {
    //             var videoButtonsContainer = infoContents.getElementsByTagName("ytd-menu-renderer")[0];
    //             if (videoButtonsContainer != null) {
    //                 var textElements = videoButtonsContainer.getElementsByTagName("yt-formatted-string");
    //                 removeElement(textElements[0]);
    //                 removeElement(textElements[1]);
    //             }
    //         }
    //         // Remove sentiment bar (below like/dislike)
    //         var sentimentBars = document.getElementsByTagName("ytd-sentiment-bar-renderer");
    //         for (i = 0; i < sentimentBars.length; i++) {
    //             removeElement(sentimentBars[i]);
    //         }

    //         var subCountElement = document.getElementById("owner-sub-count");
    //         replaceSubCount(subCountElement);

    //         var views = document.getElementById("count");
    //         removeElement(views);

    //         var dot = document.getElementById("dot");
    //         removeElement(dot);

    //         break;
    //     case "search":
    //         // TODO: Only works with the top results because there are more results loaded later on.. 
    //         // Block video stats 
    //         var videoResults = document.getElementsByTagName("ytd-video-renderer");
    //         for (var i = 0; i < videoResults.length; i++) {
    //             var metaElements = videoResults[i].getElementsByTagName("ytd-video-meta-block");
    //             for (var j = 0; j < metaElements.length; j++) {
    //                 var divs = metaElements[j].getElementsByTagName("div");
    //                 for (var k = 0; k < divs.length; k++) {
    //                     if (divs[k].getAttribute("id") == "metadata-line") {
    //                         removeElement(divs[k].childNodes[0]);
    //                     }
    //                 }
    //             }
    //         }
    //         // Block channel stats
    //         var channelResults = document.getElementsByTagName("ytd-channel-renderer");
    //         for (var i = 0; i < channelResults.length; i++) {
    //             var spans = channelResults[i].getElementsByTagName("span");
    //             for (var j = 0; j < spans.length; j++) {
    //                 if (spans[j].getAttribute("id") == "subscribers") {
    //                     removeElement(spans[j]);
    //                 }
    //                 if (spans[j].getAttribute("id") == "dot") {
    //                     removeElement(spans[j]);
    //                 }
    //             }
    //         }
    //         break;
    //     case "channel":
    //         var subCountElement = document.getElementById("subscriber-count");
    //         replaceSubCount(subCountElement);
    //         break;
    // }
}

// Blocks notifications: the notification panel and the bell next to the sub button
function blockNotifications(settings) {
    // Blocks the notification panel button on every page
    if (settings.blockNotifications) {
        var notificationElements = document.getElementsByTagName("ytd-notification-topbar-button-renderer");
        for (i = 0; i < notificationElements.length; i++) {
            removeElement(notificationElements[i]);
        }
    }
    // Block notification bell
    if (settings.blockNotificationBell) {
        var iconButtons = document.getElementsByTagName("yt-icon-button");
        for (i = 0; i < iconButtons.length; i++) {
            if (iconButtons[i].classList.contains("ytd-subscription-notification-toggle-button-renderer")) {
                removeElement(iconButtons[i]);
            }
        }
    }
}

function showPage() {
    if (document.body != null) {
        document.body.setAttribute("style", "display: block !important;");
    }
}

function run(settings) {
    // No distracting title
    document.title = "YouTube"

    if (window.location.hostname == "www.youtube.com") {
        switch (window.location.pathname) {
            case "/feed/explore":
            case "/feed/trending":
            case "/gaming":
                if (settings.blockExplore) { // Redirect from explore feeds
                    window.location.assign("https://www.youtube.com");
                }
                break;
            default:
                blockRecommendations(settings);
                blockUpcummies(settings);
                blockNotifications(settings);

                showPage();
                break;
        }
    }
}

function defaultSettingsRun() {
    console.log("YT-Shell - TEMPFIX: Running with default settings!");
    run({
        blockHomepage: true,
        blockExplore: true,
        blockSubscriptions: true,
        blockRelated: true,
        blockEndscreen: true,
        blockNotifications: true,
        blockNotificationBell: true,

        showMessage: true,
    });
}

defaultSettingsRun();


function onRequestsObserved(batch) {
    var newContentLoaded = false;
    batch.getEntries().forEach(obj => {
        // Fetch requests are used to load new content while xmlhttprequests are used for tracking
        if (obj.initiatorType == "fetch") {
            newContentLoaded = true;
        }
    });
    if (newContentLoaded) {
        defaultSettingsRun();
    }
}

var requestObserver = new PerformanceObserver(onRequestsObserved);
requestObserver.observe({ type: 'resource' });