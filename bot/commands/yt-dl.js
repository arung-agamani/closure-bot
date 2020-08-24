const ytdl = require('ytdl-core');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const crypto = require('crypto');

function main(message, args, botObject) {
    const ytRegex = new RegExp(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/);
    if (ytRegex.test(args[0])) {
        message.channel.send(`Valid URL. Downloading...`).then((msg) => {
            const videoUrl = args[0];
            const destUrl = path.resolve(botObject.basePath, 'tmp', 'mp3');

            // console.log(videoUrl);
            // console.log(destUrl);

            const videoReadableStream = ytdl(videoUrl, { filter: 'audioonly' });

            ytdl.getInfo(videoUrl, (err, info) => {
                if (err) {
                    message.channel.send(`Error occured on fetching info.`);
                    return;
                }
                const videoName = info.title.replace('|', '').toString('utf-8');
                const filePath = path.resolve(destUrl, videoName + '.mp4');
                const videoWritableStream = fs.createWriteStream(filePath);
                const stream = videoReadableStream.pipe(videoWritableStream);
                console.log('Start downloading video.');
                stream.on('finish', () => {
                    // message.channel.send(`Download complete!\nServing file on https://closure.howlingmoon.dev/ytdl/mp3/${encodeURIComponent(videoName)}.mp3`);
                    console.log('Download video complete:', filePath);
                    // const escapedFilePath = '"'+filePath+'"';
                    // console.log('Escaped file path:', escapedFilePath);
                    try {
                        ffmpeg(fs.createReadStream(filePath))
                        .toFormat('mp3')
                        /* .on('start', (command) => {
                            console.log('ffmpeg started with command:', command);
                        }) */
                        /* .on('stderr', (stderrLine) => {
                            console.log('stderr output:', stderrLine);
                        }) */
                        .on('end', () => {
                            console.log('Successfully converting.');
                            const hashfn = crypto.randomBytes(4).toString('hex');
                            botObject.ytdlMp3Map.set(hashfn, path.resolve(destUrl, videoName + '.mp3'));
                            message.channel.send(`Download and Conversion complete!\nServing file on https://closure.howlingmoon.dev/ytdl/mp3/download?f=${hashfn}` +
                            `\nFile expires in 5 minutes.`);
                            fs.unlinkSync(filePath);
                            setTimeout(() => {
                                fs.unlinkSync(path.resolve(destUrl, videoName + '.mp3'));
                                message.channel.send(`File for ${videoName} with code ${hashfn} has deleted.`);
                                botObject.ytdlMp3Map.delete(hashfn);
                            }, 30*1000);
                        })
                        .on('error', (ffmpegErr, stdout, stderr) => {
                            console.log('Error on converting: ', ffmpegErr);
                        })
                        .pipe(fs.createWriteStream(path.resolve(destUrl, videoName + '.mp3')), { end: true })
                    } catch (ffmpegErr) {
                        console.log('Error on converting file to mp3:', ffmpegErr);
                        message.channel.send('Error on creating ffmpeg object');
                    }
                    
                    /* ffmpegObject.then(ffmpegVideo => {
                        ffmpegVideo.fnExtractSoundToMP3('"'+path.resolve(destUrl, encodeURIComponent(videoName) + '.mp3')+'"', (ffmpegErr, ffmpegMp3) => {
                            if (ffmpegErr) {
                                console.log('Error on converting file to mp3:', ffmpegErr);
                                message.channel.send('Error on converting file to mp3');
                                return;
                            }
                            console.log('Successfully converting.');
                            message.channel.send('Download and Conversion complete!\nServing file on https://closure.howlingmoon.dev/ytdl/mp3/${encodeURIComponent(videoName)}.mp3')
                        });
                    })
                    .catch(ffmpegObjErr => {
                        console.log('Error on converting file to mp3:', ffmpegObjErr);
                        message.channel.send('Error on creating ffmpeg object');
                    }) */
                });
                stream.on('error', (streamErr) => {
                    message.channel.send(`Error occured when streaming data to writeable stream.`);
                    console.log('Error on streaming data to writablestream', streamErr);
                })
            })
        })
    } else {
        message.channel.send(`Invalid URL. Aborting...`);
    }
}

module.exports = {
    name : 'ytdl',
    execute: main,
}