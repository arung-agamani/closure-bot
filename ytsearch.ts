import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import stream from 'stream';
import fs from 'fs';

console.log('initiating get info');

const ffmpegPipe = fs.createWriteStream('pipetest.mp3');
const passStream = new stream.PassThrough();

const video = ytdl('https://www.youtube.com/watch?v=ft-HOsTzQQ4', {
  filter: 'audioonly',
})
  .on('progress', (chunkLength) => {
    console.log(`[ytdl] chunk downloaded: ${chunkLength}`);
  })
  .on('end', () => {
    console.log('ytdl finished fetching file');
  });

const ffmpegCommand = ffmpeg()
  .format('mp3')
  .audioCodec('libmp3lame')
  .output(ffmpegPipe)
  .on('start', () => {
    console.log('[ffmpeg] starting...');
  })
  .on('progress', (frames) => {
    console.log(`[ffmpeg] has processed frames`);
    console.log(frames);
  })
  .on('end', () => {
    console.log('Finished?');
  });

video.pipe(passStream);
ffmpegCommand.input(passStream).run();
