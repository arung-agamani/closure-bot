import ytdl from 'ytdl-core';
console.log('initiating get info')
ytdl.getInfo('https://www.youtube.com/watch?v=2EwbLyG5nQI')
    .then(info => {
        console.log(info);
    })
    .catch(err => {
        console.error(err);
    })