// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let tagsUrl = chrome.runtime.getURL('tags.json');
let tagsXHR = new XMLHttpRequest();
let tagsContainer = {};
tagsXHR.onreadystatechange = () => {
    if (tagsXHR.readyState == XMLHttpRequest.DONE) {
        tagsContainer = JSON.parse(tagsXHR.responseText);
        for (const tagObj of tagsContainer.tags) {
            chrome.contextMenus.create({
                title : tagObj.text,
                parentId : "WARFARIN_001",
                contexts : ["image"],
                id : "WARFARIN_002_" + tagObj.tag
            });
        }
    }
}
tagsXHR.open('GET', chrome.runtime.getURL('tags.json'));
tagsXHR.send();

function checkOrigin(pageUrl) {
    if (pageUrl.match("facebook")) {
        return "Facebook";
    } else if (pageUrl.match("twitter") || pageUrl.match("twimg")) {
        return "Twitter";
    }
}

function checkTags(menuItemId) {
    let retval = "";
    for (const obj of tagsContainer.tags) {
        if (menuItemId.match(new RegExp(obj.tag, 'i'))) {
            retval = obj.tag;
            break;
        }
    }
    return retval;
}

function sendImageLink(info, tab) {
    let xhr = new XMLHttpRequest();
        let jsonBody = {};
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    alert(xhr.responseText);
                } else {
                    alert("There is a problem with the XHR : " + xhr.status + " : " + xhr.statusText)
                }
            }
        }
    if (info.menuItemId.match("WARFARIN_LINK")) {
        jsonBody.type = "link";
        jsonBody.value = info;
        jsonBody.pageUrl = info.pageUrl;
        xhr.open('POST', 'http://localhost:2000/warfarin');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(jsonBody));
    } else if (info.menuItemId.match(/002/i)) {
        jsonBody.requestOrigin = checkOrigin(info.pageUrl);
        jsonBody.pageUrl = info.pageUrl;
        jsonBody.srcUrl = info.srcUrl;
        jsonBody.linkUrl = info.linkUrl;
        jsonBody.frameUrl = info.frameUrl;
        jsonBody.tag = checkTags(info.menuItemId);
        xhr.open('POST', 'http://localhost:2000/warfarin');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(jsonBody));
    } else {
        return;
    }
    
}

chrome.contextMenus.create({
    title : "Send to Discord",
    contexts : ["image"],
    id : "WARFARIN_001"
});
chrome.contextMenus.create({
    title : "Send Pixiv Link to Discord",
    contexts : ["link"],
    id : "WARFARIN_LINK_001",
    documentUrlPatterns : ["https://*.pixiv.net/*", "https://*.pximg.net/*"]
});




chrome.contextMenus.onClicked.addListener(sendImageLink);