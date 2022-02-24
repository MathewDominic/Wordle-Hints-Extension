document.addEventListener("DOMContentLoaded", function() {
    var showHintButton = document.getElementById("showHint");
    showHintButton.addEventListener("click", function () {
        // send message to content-script.js since we cannot access localStorage here
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {});
        });
    }, false);
}, false);