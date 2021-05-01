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
    chrome.storage.local.get(null, function (data) {
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