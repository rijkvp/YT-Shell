const defaultSettings = {
    block_recommendations: true,
    block_explore_feeds: true,
    hide_upcummies: true,
    hide_notifications: true,
    hide_thumbnails: true,
    hide_avatars: true,
}

function insertJS(fileName, tabId) {
    // Version 3
    // chrome.scripting.executeScript({
    //     target: { tabId: tabId },
    //     files: ["js/" + fileName]
    // });
    // Version 2
    chrome.tabs.executeScript(tabId, {
        file: "js/" + fileName,
        runAt: "document_start"
    });
}

function insertCSS(fileName, tabId) {
    // Version 3
    // chrome.scripting.insertCSS({
    //     target: { tabId: tabId },
    //     files: ["css/" + fileName]
    // });
    // Version 2
    chrome.tabs.insertCSS(tabId, {
        file: "css/" + fileName,
        runAt: "document_start"
    });
}

function removeCSS(fileName, tabId) {
    // Version 2
    chrome.tabs.removeCSS(tabId, {
        file: "css/" + fileName
    });
}

function injectScripts(tabId, isReloading) {
    if (!isReloading) {
        // Quick fix: manually remove all CSS if not realoading
        removeCSS("hide_explore_buttons.css");
        removeCSS("hide_upcummies.css");
        removeCSS("hide_notifications.css");
        removeCSS("hide_thumbnails.css");
        removeCSS("hide_avatars.css");
    }
    if (isReloading) {
        insertCSS("loading.css", tabId);
    }
    insertCSS("injected_styles.css", tabId);

    chrome.storage.sync.get(null, function (settingsData) {
        var settings;
        if (Object.entries(settingsData).length == 0) {
            settings = defaultSettings;
        } else {
            settings = settingsData;
        }

        insertJS("content.js", tabId);
        if (settings.block_recommendations) {
            insertJS("block_recommendations.js", tabId);
        }
        if (settings.block_explore_feeds) {
            insertJS("redirect_feeds.js", tabId);
            insertCSS("hide_explore_buttons.css", tabId);
        }
        if (settings.hide_upcummies) {
            insertCSS("hide_upcummies.css", tabId);
        }
        if (settings.hide_notifications) {
            insertCSS("hide_notifications.css", tabId);
        }
        if (settings.hide_thumbnails) {
            insertCSS("hide_thumbnails.css", tabId);
        }
        if (settings.hide_avatars) {
            insertCSS("hide_avatars.css", tabId);
        }
    });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.includes("www.youtube.com")) {
        injectScripts(tabId, true);
    }
});

function update(reloadTab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        currentTab = tab[0];
        if (currentTab != null && currentTab.url.includes("www.youtube.com")) {
            if (reloadTab) {
                chrome.tabs.reload(tab.id, function () {
                    injectScripts(currentTab.id, true);
                });
            } else {
                injectScripts(currentTab.id, false);
            }
        }
    });
}

chrome.runtime.onMessage.addListener(function (request) {
    if (request.type == "update") {
        update(request.reloadTab);
    }
});