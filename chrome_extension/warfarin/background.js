'use strict';

let pointedGuildId = '';

/* let tagsUrl = chrome.runtime.getURL('tags.json');
let tagsXHR = new XMLHttpRequest();
let tagsContainer = {};
tagsXHR.onreadystatechange = () => {
    if (tagsXHR.readyState == XMLHttpRequest.DONE) {
        tagsContainer = JSON.parse(tagsXHR.responseText);
        for (const tagObj of tagsContainer.tags) {
            chrome.contextMenus.create({
                title : tagObj.tag,
                parentId : "WARFARIN_001",
                contexts : ["image"],
                documentUrlPatterns : ["https://*.twitter.com/*", "https://twitter.com/*"],
                id : "WARFARIN_002_" + tagObj.tag
            });
            chrome.contextMenus.create({
                title : tagObj.tag,
                parentId : "WARFARIN_001",
                contexts : ["image", "link"],
                documentUrlPatterns : ["https://*.pixiv.net/*//* artworks *//*"],
                id : "WARFARIN_PIXIV_" + tagObj.tag
            });
        }
    }
}
tagsXHR.open('GET', chrome.runtime.getURL('tags.json'));
tagsXHR.send(); */

function checkOrigin(pageUrl) {
    if (pageUrl.match("facebook")) {
        return "Facebook";
    } else if (pageUrl.match("twitter") || pageUrl.match("twimg")) {
        return "Twitter";
    }
}

function checkTags(menuItemId) {
    let retval = ""
    retval = menuItemId;
    return retval.split('_').pop();
}

function getPointedGuildId(callback) {
    chrome.storage.local.get('currentUsedServer', serverInfo => {
        callback(serverInfo.currentUsedServer.guildId);
    });
}

function sendImageLink(info, tab) {
    let xhr = new XMLHttpRequest();
        let jsonBody = {};
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    alert("Posted!");
                } else {
                    alert("There is a problem with the XHR : " + xhr.status + " : " + xhr.statusText)
                }
            }
        }
    if (info.menuItemId.match("WARFARIN_LINK")) {
        jsonBody.type = "link";
        jsonBody.value = info;
        jsonBody.pageUrl = info.pageUrl;
        getPointedGuildId(retval => {
            jsonBody.guildId = retval;
            xhr.open('POST', 'https://closure.howlingmoon.dev/warfarin');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(jsonBody));
        })
        
    } else if (info.menuItemId.match(/002/i)) {
        jsonBody.requestOrigin = checkOrigin(info.pageUrl);
        jsonBody.pageUrl = info.pageUrl;
        jsonBody.srcUrl = info.srcUrl;
        jsonBody.linkUrl = info.linkUrl;
        jsonBody.frameUrl = info.frameUrl;
        jsonBody.guildId = pointedGuildId;
        jsonBody.tag = checkTags(info.menuItemId);
        console.log(pointedGuildId);
        getPointedGuildId(retval => {
            jsonBody.guildId = retval;
            xhr.open('POST', 'https://closure.howlingmoon.dev/warfarin');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(jsonBody));
        })
    } else if (info.menuItemId.match(/pixiv/i)) {
        jsonBody.requestOrigin = "pixiv";
        jsonBody.value = info;
        jsonBody.tag = checkTags(info.menuItemId);
        jsonBody.guildId = pointedGuildId;
        console.log(pointedGuildId);
        getPointedGuildId(retval => {
            jsonBody.guildId = retval;
            xhr.open('POST', 'https://closure.howlingmoon.dev/warfarin');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(jsonBody));
        })
    } else {
        return;
    }
    
}

function loadTags() {
    chrome.storage.local.get('currentUsedServer', (serverInfo) => {
        if (serverInfo.currentUsedServer.guildId !== undefined && serverInfo.currentUsedServer.guildId.match(/^\d*$/)) {
            console.log(serverInfo);
            chrome.contextMenus.create({
                title : "Send to Discord",
                contexts : ["image"],
                id : "WARFARIN_001"
            });
            pointedGuildId = serverInfo.currentUsedServer.guildId;
            console.log(pointedGuildId);
            var tags = serverInfo.currentUsedServer.tags;
            for (const tagObj of serverInfo.currentUsedServer.tags) {
                console.log(tagObj);
                chrome.contextMenus.create({
                    title : tagObj,
                    parentId : "WARFARIN_001",
                    contexts : ["image"],
                    documentUrlPatterns : ["https://*.twitter.com/*", "https://twitter.com/*"],
                    id : "WARFARIN_002_" + tagObj
                });
                chrome.contextMenus.create({
                    title : tagObj,
                    parentId : "WARFARIN_001",
                    contexts : ["image", "link"],
                    documentUrlPatterns : ["https://*.pixiv.net/*/artworks/*", "https://*.pixiv.net/*/"],
                    id : "WARFARIN_PIXIV_" + tagObj
                });
            }
            console.log("Tags loaded");
        } else {
            console.log("Server info not found in storage");
            console.log(serverInfo.currentUsedServer);
        }
    })
}

chrome.runtime.onInstalled.addListener(function() {
    console.log('Reloaded||Installed')
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl : {
                    hostEquals: 'developer.chrome.com'
                }
            }), new chrome.declarativeContent.PageStateMatcher({
                pageUrl : {
                    hostContains: 'facebook'
                }
            }), new chrome.declarativeContent.PageStateMatcher({
                pageUrl : {
                    hostContains: 'twitter'
                }
            }), new chrome.declarativeContent.PageStateMatcher({
                pageUrl : {
                    hostContains: 'pixiv'
                }
            })],
            actions : [new chrome.declarativeContent.ShowPageAction()]
        }])
    })
    loadTags();
})

chrome.runtime.onStartup.addListener(() => {
    console.log("Warfarin Deployed");
    loadTags();
})
chrome.contextMenus.onClicked.addListener(sendImageLink);