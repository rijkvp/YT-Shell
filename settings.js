const ui = {
    blockHomepage: {
        title: "Block Homepage",
        description: "Recommendations on the homepage feed."
    },
    blockExplore: {
        title: "Block Explore",
        description: "Recommendations on the explore feeds."
    },
    blockSubscriptions: {
        title: "Block Subscriptions",
        description: "Videos from your subscriptions."
    },
    blockRelated: {
        title: "Block Related",
        description: "Recommendations next to videos."
    },
    blockEndscreen: {
        title: "Block Endscreen",
        description: "Recommendations on endscreens."
    },
    blockNotifications: {
        title: "Block Notifications",
        description: "The notification panel."
    },
    blockNotificationBell: {
        title: "Block Notification Bell",
        description: "The bell next to the subscribe button."
    },
}

function createHtml(defaultSettings) {
    // Create HTML
    var settingsParent = document.getElementById("settingsPanel");
    Object.keys(defaultSettings).forEach((key) => {
        var settingHtml = `
        <div class="row my-2">
            <div class="col col-10">
                <p class="fw-bold my-0">${ui[key].title}</p>
                <p><small class="text-muted">${ui[key].description}</small></p>
            </div>
            <div class="col col-1"><input id="${key}" type="checkbox" class="form-check-input"></div>
        </div>`;
        settingsParent.innerHTML += settingHtml;
    });
}

function displaySettings(settings) {
    var toggleElements = {};
    Object.keys(settings).forEach((key) => {
        toggleElements[key] = document.getElementById(key);
        if (toggleElements[key]) {
            toggleElements[key].checked = settings[key];

            toggleElements[key].addEventListener("change", function () {
                settings[key] = toggleElements[key].checked;

                chrome.storage.local.set(settings); // Save
            });
        }
    });
};

chrome.runtime.getBackgroundPage(function (bgWindow) {
    createHtml(bgWindow.getDefaultSettings());
    displaySettings(bgWindow.getCurrentSettings());
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    chrome.tabs.query({ url: "*://www.youtube.com/*", currentWindow: true }, function (tab) {
        var reloadDiv = document.getElementById("reload-div");
        reloadDiv.classList.remove('invisible');
        var reloadButton = document.getElementById("reload-button");
        reloadButton.addEventListener("click", function () {
            chrome.tabs.reload(tab.id);
        });
    });
});