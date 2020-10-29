import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Server } from 'socket.io';
import ytdl from 'ytdl-core';
import FFMPEG from 'fluent-ffmpeg';
import { FfmpegCommand } from 'fluent-ffmpeg';

const ytRegex = new RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);

class YTDLAppSocket {
  public socketIOServer: Server;
  public map: Map<string, string>;

  constructor(socketIOServer: Server, map: Map<string, string>) {
    this.socketIOServer = socketIOServer;
    this.map = map;
  }

  start() {
    this.socketIOServer.on('connection', (socket) => {
      console.log('New client connected');
      socket.send("Hello from server");
      socket.on('disconnect', () => {
        console.log('Client Disconnected');
      });
      let jobCount = 0;
      socket.on('init url', data => {
        console.log(data);
        const incomingUrl = data as string;
        if (jobCount >= 3) {
          socket.send('Maximum 3 concurrent jobs. Please finish your current jobs before adding new job.');
        } else {
          if (ytRegex.test(incomingUrl)) {
            socket.send('URL is valid. Processing');
            ytdl.getInfo(incomingUrl).then(videoInfo => {
              jobCount += 1;
              console.log('Finished getting video metadata');
              socket.emit('metadata', videoInfo.videoDetails);
              if (videoInfo.formats.some(frmt => frmt.isLive)) {
                console.log('Video is live');
                socket.send('Video is currently live. Cannot process that. Aborting.');
              } else if (parseInt(videoInfo.videoDetails.lengthSeconds) > 600) {
                console.log('Video is too long');
                socket.send('Video is too long (over 10 minutes). Aborting.');
              } else {
                console.log('Video is elligible');
                const videoName = videoInfo.videoDetails.title.replace(/[\/|\|]/g, ' - ');
                const filePath = path.resolve(__dirname, '..', 'temp', videoName + '.mp4');
                const destUrl = path.resolve(__dirname, '..', 'temp', 'mp3');
                const videoWriteableStream = fs.createWriteStream(filePath);
                const videoReadableStream = ytdl(incomingUrl, { filter: 'audioonly', quality: 'highestaudio'});
                const stream = videoReadableStream.pipe(videoWriteableStream);
                let percentProgress = 0;
                let downloadLogHandler = null;
  
                socket.send('Start downloading video');
                videoReadableStream.once('progress', () => {
                  socket.send('Start receiving data stream');
                  downloadLogHandler = setInterval(() => {
                    socket.emit('download', percentProgress);
                  }, 1000);
                });
                videoReadableStream.on('progress', (chunkLength, downloaded, total) => {
                  percentProgress = downloaded / total;
                });
                stream.on('finish', () => {
                  clearInterval(downloadLogHandler);
                  socket.send('Download video complete');
                  const timemarkRegex = new RegExp(/^\d\d:(\d\d):(\d\d)\.\d\d$/)
                  const videoLength = parseInt(videoInfo.videoDetails.lengthSeconds)
                  let ffmpeg: FfmpegCommand;
                  try {
                    let conversionHandler = null;
                    let timemarks = null;
                    let processedSecond = 0;
                    ffmpeg = FFMPEG(fs.createReadStream(filePath)).toFormat('mp3');
                    ffmpeg.once('progress', (progress) => {
                      conversionHandler = setInterval(() => {
                        socket.emit('conversion', processedSecond / videoLength);
                      }, 1000);
                    })
                    .on('progress', (progress) => {
                      timemarks = timemarkRegex.exec(progress.timemark);
                      processedSecond = parseInt(timemarks[1]) * 60 + parseInt(timemarks[2]);
                    })
                    .on('end', () => {
                      clearInterval(conversionHandler);
                      const hashfn = crypto.randomBytes(4).toString('hex');
                      this.map.set(hashfn, path.resolve(destUrl, videoName + '.mp3'));
                      socket.emit('done', {
                        filename: videoName,
                        link : `http://closure.howlingmoon.dev/ytdl/${hashfn}`,
                        metadata: videoInfo.videoDetails
                      });
                      fs.unlinkSync(filePath);
                      setTimeout(() => {
                        fs.unlinkSync(path.resolve(destUrl, videoName + '.mp3'));
                        socket.emit('delete', videoName);
                        console.log(`${videoName}.mp3 is now expired and deleted`);
                      }, 300 * 1000)
                      console.log('Finished converting. Now serving until expired');
                      jobCount -= 1;
                    })
                    .on('error', (ffmpegErr, stdout, stderr) => {
                      socket.send('Error on conversion. Try again next time');
                      console.log('Error conversino: ', ffmpegErr);
                      jobCount -= 1;
                    })
                    .pipe(fs.createWriteStream(path.resolve(destUrl, videoName + '.mp3')), { end: true })
                  } catch (ffmpegErr) {
                    console.log('Error on mp3 conversion:', ffmpegErr);
                    socket.send('Error on mp3 conversion task.');
                    ffmpeg.removeAllListeners();
                    jobCount -= 1;
                  }
                });
                stream.on('error', (streamErr) => {
                  clearInterval(downloadLogHandler);
                  console.log('Error on streaming data to writablestream: ', streamErr);
                  socket.send('Error when data streaming');
                  stream.close();
                  jobCount -= 1;
                });
              }
            })
            .catch((err) => {
              socket.send('Error on fetching info');
              console.error('Error on fetching video info: ', err);
              jobCount -= 1;
            })
          } else {
            socket.send('URL is invalid. Aborting');
          }
        }
        
      })
    });
  }
}

export default YTDLAppSocket;
