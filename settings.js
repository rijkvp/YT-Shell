const ui = {
    blockHomepage: {
        title: "Block Homepage",
        description: "..."
    },
    blockExplore: {
        title: "Block Explore",
        description: "..."
    },
    blockSubscriptions: {
        title: "Block Subscriptions",
        description: "..."
    },
    blockRelated: {
        title: "Block Related",
        description: "..."
    },
    blockEndscreen: {
        title: "Block Endscreen",
        description: "..."
    },
    blockNotifications: {
        title: "Block Notifications",
        description: "..."
    },
    blockNotificationBell: {
        title: "Block Notification Bell",
        description: "..."
    },
}

function createHtml(defaultSettings) {
    // Create HTML
    var settingsParent = document.getElementById("settingsPanel");
    Object.keys(defaultSettings).forEach((key) => {
        var settingHtml = `
        <div class="row my-2">
            <div class="col col-8">
                <p class="fw-bold my-0">${ui[key].title}</p>
                <small class="text-muted">${ui[key].description}</small>
            </div>
            <div class="col col-4"><input id="${key}" type="checkbox" class="form-check-input"></div>
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

                chrome.storage.sync.set(settings); // Save
            });
        }
    });
};

chrome.runtime.getBackgroundPage(function (bgWindow) {
    createHtml(bgWindow.getDefaultSettings());
    displaySettings(bgWindow.getCurrentSettings());
});