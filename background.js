chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url.includes("www.youtube.com"))
    {
        chrome.tabs.executeScript(tabId, {file: "run.js", runAt: "document_start"});
    }
});