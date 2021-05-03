const defaultSettings = {
    block_recommendations: true,
    block_explore_feeds: true,
    hide_upcummies: true,
    hide_notifications: true,
    hide_thumbnails: true,
    hide_avatars: true,
}

function playStatusAnimation(text) {
    var status = document.getElementById('status');
    status.innerText = text;
    status.classList.remove("fadeOut");
    void status.offsetWidth; // Trick to restart animation
    status.classList.add("fadeOut");
    didShow = true;
}

function showUpdateStatus() {
    let didShow = false;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        currentTab = tab[0];
        if (currentTab != null && currentTab.url.includes("www.youtube.com")) {
            playStatusAnimation("Reloading..");
        }
    });
    if (!didShow) {
        playStatusAnimation("Saved settings..");
    }
}

function saveSettings() {
    let settings = {};
    Object.keys(defaultSettings).forEach((key) => {
        var checkbox = document.getElementById(key);
        if (checkbox) {
            settings[key] = checkbox.checked;
        }
    });
    chrome.storage.sync.set(settings, showUpdateStatus);
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