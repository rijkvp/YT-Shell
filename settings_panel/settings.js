const defaultSettings = {
    block_recommendations: true,
    block_explore_feeds: true,
    hide_upcummies: true,
    hide_notifications: true,
    hide_thumbnails: true,
    hide_avatars: true,
}

const reloadRequiredSettings = [
    "block_recommendations", "block_explore_feeds"
]

function playStatusAnimation(text) {
    var status = document.getElementById('status');
    status.innerText = text;
    status.classList.remove("fadeOut");
    void status.offsetWidth; // Trick to restart animation
    status.classList.add("fadeOut");
    didShow = true;
}

function onSettingsChanged(reload) {
    // Send message to update the injected scripts/styles
    chrome.runtime.sendMessage({type: "update", reloadTab: reload});
    
    // Show animation on settings panel
    let didShow = false;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        currentTab = tab[0];
        if (currentTab != null && currentTab.url.includes("www.youtube.com")) {
            if (reload) {
                playStatusAnimation("Reloading..");
            } else {
                playStatusAnimation("Updating..");
            }
        }
    });
    if (!didShow) {
        playStatusAnimation("Saved settings..");
    }
}

function getChangedKeys(before, after) {
    let changed = [];
    Object.keys(before).forEach((key) => {
        if (before[key] != after[key]) {
            changed.push(key);
        }
    });
    return changed;
}

function saveSettings() {
    chrome.storage.sync.get(null, function (settingsData) {
        let previousSettings;
        if (Object.entries(settingsData).length == 0) {
            previousSettings = defaultSettings;
        } else {
            previousSettings = settingsData;
        }

        let settings = {};
        Object.keys(defaultSettings).forEach((key) => {
            var checkbox = document.getElementById(key);
            if (checkbox) {
                settings[key] = checkbox.checked;
            }
        });

        let changedKeys = getChangedKeys(previousSettings, settings);
        let reloadRequired = false;
        changedKeys.forEach((key) => {
            if (reloadRequiredSettings.includes(key)) {
                reloadRequired = true;
            }
        });

        chrome.storage.sync.set(settings, onSettingsChanged(reloadRequired));
    });
}


function restoreSettings() {
    chrome.storage.sync.get(null, function (settingsData) {
        let settings;
        if (Object.entries(settingsData).length == 0) {
            settings = defaultSettings;
        } else {
            settings = settingsData;
        }

        Object.keys(settings).forEach((key) => {
            var checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = settings[key];

                checkbox.addEventListener("change", function () {
                    saveSettings();
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', restoreSettings);