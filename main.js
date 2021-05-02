const defaultSettings = {
    
    block_recommendations: true,
    block_explore_feeds: true,
    hide_upcummies: true,
    hide_notifications: true,
    
    hide_thumbnails: true,
    hide_avatars: true,
}

function insertJS(fileName, tabId) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["js/" + fileName]
    });
}

function insertCSS(fileName, tabId) {
    chrome.scripting.insertCSS({
        target: { tabId: tabId },
        files: ["css/" + fileName]
    });
}

function removeCSS(fileName, tabId) {
    chrome.scripting.removeCSS({
        target: { tabId: tabId },
        files: ["css/" + fileName]
    });
}

function injectScripts(tabId) {
    insertCSS("loading.css", tabId);

    insertCSS("injected_styles.css", tabId);
    
    console.log("LOADING SETTINGS..");
    chrome.storage.sync.get(null, function (settingsData) {
        var settings;
        if (Object.entries(settingsData).length == 0) {
            console.log("DEFAULT!");
            settings = defaultSettings;
        } else {
            settings = settingsData;
        }
        console.log(settings);
        
        insertJS("content.js", tabId);
        if (settings.block_recommendations) {
            insertJS("block_recommendations.js", tabId);
        }
        if (settings.block_explore_feeds) {
            insertJS("redirect_feeds.js", tabId);
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
        injectScripts(tabId);
    }
});