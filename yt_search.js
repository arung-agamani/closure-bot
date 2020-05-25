const yts = require('yt-search');

async function search(queryString) {
    const searchResult = await yts(queryString);
    const videos = searchResult.videos.slice(0,6);
    // console.log(videos);
    for (const video of videos) {
        console.log('Title: ' + video.title);
        console.log('Length : ' + video.timestamp);
        console.log('Link: ' + video.url);
        console.log('======================')
    }
    console.log('Search result returns ' + videos.length + ' items');
}

function testLink(url) {
    const ytRegex = new RegExp(/^https:\/\/.*\.youtube\.com\/watch\?v=.*$/);
    if (url.match(ytRegex)) {
        console.log("Matched!");
    } else {
        console.log("Not matched!");        
    }
}

// search('kanzaki elsa independence')
testLink('https://www.youtube.com/watch?v=ytMqO-WQpQ4');