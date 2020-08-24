const ytdl = require('ytdl-core');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const crypto = require('crypto');

function main(message, args, botObject) {
    const ytRegex = new RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);
    if (ytRegex.test(args[0])) {
        message.channel.send(`Poggers, valid URL. Processing...`).then((msg) => {
            const videoUrl = args[0];
            const destUrl = path.resolve(botObject.basePath, 'tmp', 'mp3');
            const videoReadableStream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio'});
            
            ytdl.getInfo(videoUrl).then(info => {
                if (info.formats.some(frmt => frmt.live)) {
                    msg.edit(`Pepega, it's a live video. Nope.\nAtomic Abortion starts...  <@${message.author.id}>`);
                    return;
                }
                if (parseInt(info.length_seconds) > 600) {
                    msg.edit(`Pepega, video length is too long. Maximum 10 minutes.\nAtomic Abortion starts...  <@${message.author.id}>`);
                    return;
                } else {
                    const videoName = info.title.replace('|', '').toString('utf-8');
                    const filePath = path.resolve(destUrl, videoName + '.mp4');
                    const videoWritableStream = fs.createWriteStream(filePath);
                    const stream = videoReadableStream.pipe(videoWritableStream);
                    console.log('Start downloading video.');
                    stream.on('finish', () => {
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
                                message.channel.send(`Download and Conversion complete! <@${message.author.id}>\nServing file on https://closure.howlingmoon.dev/ytdl/mp3/download?f=${hashfn}` +
                                `\nFile expires in 5 minutes.`);
                                fs.unlinkSync(filePath);
                                setTimeout(() => {
                                    fs.unlinkSync(path.resolve(destUrl, videoName + '.mp3'));
                                    message.channel.send(`File for "${videoName}" with code "${hashfn}" has been deleted. <@${message.author.id}>`);
                                    botObject.ytdlMp3Map.delete(hashfn);
                                }, 300*1000);
                            })
                            .on('error', (ffmpegErr, stdout, stderr) => {
                                console.log('Error on converting: ', ffmpegErr);
                                message.channel.send(`Error on conversion :< <@${message.author.id}>\n Try again next time`);
                            })
                            .pipe(fs.createWriteStream(path.resolve(destUrl, videoName + '.mp3')), { end: true })
                        } catch (ffmpegErr) {
                            console.log('Error on converting file to mp3:', ffmpegErr);
                            message.channel.send('Error on creating ffmpeg object <@${message.author.id}>');
                        }
                    });
                    stream.on('error', (streamErr) => {
                        message.channel.send(`Error occured when streaming data to writeable stream. <@${message.author.id}>`);
                        console.log('Error on streaming data to writablestream', streamErr);
                    })
                }
                
            }).catch((err) => {
                message.channel.send(`Halah, Error occured on fetching info. <@${message.author.id}>`);
                console.error('Error on retrieving info:', err);
                return;
            })
        })
    } else {
        message.channel.send(`Invalid URL. Atomic Abortion starts... <@${message.author.id}>`);
    }
}

module.exports = {
    name : 'ytdl',
    execute: main,
}