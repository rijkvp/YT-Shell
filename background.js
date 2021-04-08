// Settings
const defaultSettings = {
    // Recommendations
    blockHomepage: true,
    blockExplore: true,
    blockSubscriptions: false,
    blockRelated: true,
    blockEndscreen: true,
    // TODO: Upcummies settings
    
    // Notifications
    blockNotifications: true,
    blockNotificationBell: true,
}

var currentSettings = {};
var settingsLoaded = false;

function loadSettings() {
    chrome.storage.sync.get(null, function (data) {
        if (data) {
            currentSettings = data;
        } else {
            currentSettings = defaultSettings;
        }
        settingsLoaded = true;
    });
}

loadSettings();

function getDefaultSettings() {
    return defaultSettings;
}

function getCurrentSettings() {
    if (settingsLoaded) {
        return currentSettings;
    } else {
        console.error("Trying to access settings before loading!!");
    }
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.includes("www.youtube.com")) {
        chrome.tabs.executeScript(tabId, { file: "run.js", runAt: "document_start" }, function () {
            chrome.tabs.sendMessage(tabId, {settings: currentSettings});
        });
    }
});