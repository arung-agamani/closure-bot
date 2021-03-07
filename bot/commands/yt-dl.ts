/* eslint-disable no-useless-escape */
import ytdl, { getInfo } from 'ytdl-core';
import { resolve } from 'path';
import { createWriteStream, createReadStream, unlinkSync } from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { randomBytes } from 'crypto';
import { Message, MessageEmbed as DEmbed } from 'discord.js';
import * as ClosureType from '../closure';

const BaseEmbedMessage = (videoTitle, thumbnailUrl, author) => {
  return new DEmbed()
    .setTitle(`Closure's Youtube to MP3 Downloader`)
    .setDescription(`Downloading ${videoTitle}`)
    .setImage(thumbnailUrl)
    .setFooter(`Task initiated by ${author.username}`, author.avatarURL());
};
const DownloadEmbedMessage = (progress, base) => {
  return new DEmbed(base).addField(
    'Download Progress',
    `${(progress * 100).toFixed(2)}%`
  );
};

const ConvertEmbedMessage = (progress, base) => {
  return new DEmbed(base)
    .addField('Download Complete!', 'Now converting...')
    .addField('Conversion Progress', `${(progress * 100).toFixed(2)}%`);
};

const ServingEmbedMessage = (urlPath, base) => {
  return new DEmbed(base)
    .addField('Conversion Complete!', 'Done')
    .addField(
      'Serving File',
      `Visit or click ${urlPath} \nFile expires in 5 minutes`
    );
};

const DeletedEmbedMessage = (title, hashcode, base) => {
  return new DEmbed(base).addField(
    'File Deleted',
    `"${title}" at ${hashcode} has been deleted.`
  );
};

function main(
  message: Message,
  args: Array<string>,
  botObject: ClosureType.default
): void {
  const ytRegex = new RegExp(
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
  );
  if (ytRegex.test(args[0])) {
    message.channel.send(`Poggers, valid URL. Processing...`).then((msg) => {
      const videoUrl = args[0];
      const destUrl = resolve(botObject.basePath, 'tmp', 'mp3');
      const videoReadableStream = ytdl(videoUrl, {
        filter: 'audioonly',
        quality: 'highestaudio',
      });

      getInfo(videoUrl)
        .then((info) => {
          if (info.formats.some((frmt) => frmt.isLive)) {
            msg.edit(
              `Pepega, it's a live video. Nope.\nAtomic Abortion starts...  <@${message.author.id}>`
            );
            return;
          }
          if (parseInt(info.videoDetails.lengthSeconds, 10) > 600) {
            msg.edit(
              `Pepega, video length is too long. Maximum 10 minutes.\nAtomic Abortion starts...  <@${message.author.id}>`
            );
          } else {
            const videoName = info.videoDetails.title
              .replace('|', '')
              .toString();
            const filePath = resolve(destUrl, `${videoName}.mp4`);
            let percentProgress = 0;
            let downloadLogHandler = null;
            const videoWritableStream = createWriteStream(filePath);
            const stream = videoReadableStream.pipe(videoWritableStream);
            const msgBaseEmbed = BaseEmbedMessage(
              info.videoDetails.title,
              null,
              message.author
            );
            console.log('Start downloading video.');
            videoReadableStream.once('progress', () => {
              console.log('Starting to receive data stream!');
              downloadLogHandler = setInterval(() => {
                console.log('Percent downloaded: ', percentProgress);
                msg.edit(DownloadEmbedMessage(percentProgress, msgBaseEmbed));
              }, 1000);
            });
            stream.on('finish', () => {
              clearInterval(downloadLogHandler);
              console.log('Download video complete:', filePath);
              const timemarkRegex = new RegExp(/^\d\d:(\d\d):(\d\d)\.\d\d$/);
              const videoLength = parseInt(info.videoDetails.lengthSeconds, 10);
              try {
                let conversionLogHandler = null;
                let timeMarks = null;
                let processedSeconds = null;
                ffmpeg(createReadStream(filePath))
                  .toFormat('mp3')
                  /* .on('start', (command) => {
                                console.log('ffmpeg started with command:', command);
                            }) */
                  /* .on('stderr', (stderrLine) => {
                                console.log('stderr output:', stderrLine);
                            }) */
                  .once('progress', () => {
                    conversionLogHandler = setInterval(() => {
                      msg.edit(
                        ConvertEmbedMessage(
                          processedSeconds / videoLength,
                          msgBaseEmbed
                        )
                      );
                    }, 1000);
                  })
                  .on('progress', (progress) => {
                    timeMarks = timemarkRegex.exec(progress.timemark);
                    processedSeconds =
                      parseInt(timeMarks[1], 10) * 60 +
                      parseInt(timeMarks[2], 10);
                    console.log(
                      'Conversion progress: ',
                      processedSeconds / videoLength
                    );
                  })
                  .on('end', () => {
                    console.log('Successfully converting.');
                    clearInterval(conversionLogHandler);
                    const hashfn = randomBytes(4).toString('hex');
                    botObject.ytdlMp3Map.set(
                      hashfn,
                      resolve(destUrl, `${videoName}.mp3`)
                    );
                    msg.edit(
                      ServingEmbedMessage(
                        `https://closure.howlingmoon.dev/ytdl/mp3/download?f=${hashfn}`,
                        BaseEmbedMessage(
                          info.videoDetails.title,
                          info.videoDetails.thumbnail.thumbnails[
                            info.videoDetails.thumbnail.thumbnails.length - 1
                          ].url,
                          message.author
                        )
                      )
                    );
                    unlinkSync(filePath);
                    setTimeout(() => {
                      unlinkSync(resolve(destUrl, `${videoName}.mp3`));
                      msg.edit(
                        DeletedEmbedMessage(videoName, hashfn, msgBaseEmbed)
                      );
                      botObject.ytdlMp3Map.delete(hashfn);
                    }, 300 * 1000);
                  })
                  .on('error', (ffmpegErr) => {
                    console.log('Error on converting: ', ffmpegErr);
                    clearInterval(conversionLogHandler);
                    message.channel.send(
                      `Error on conversion :< <@${message.author.id}>\n Try again next time`
                    );
                  })
                  .pipe(
                    createWriteStream(resolve(destUrl, `${videoName}.mp3`)),
                    { end: true }
                  );
              } catch (ffmpegErr) {
                console.log('Error on converting file to mp3:', ffmpegErr);
                message.channel.send(
                  `Error on creating ffmpeg object <@${message.author.id}>`
                );
              }
            });
            stream.on('error', (streamErr) => {
              clearInterval(downloadLogHandler);
              message.channel.send(
                `Error occured when streaming data to writeable stream. <@${message.author.id}>`
              );
              console.log(
                'Error on streaming data to writablestream',
                streamErr
              );
            });
            videoReadableStream.on(
              'progress',
              (chunkLength, downloaded, total) => {
                percentProgress = downloaded / total;
              }
            );
          }
        })
        .catch((err) => {
          message.channel.send(
            `Halah, Error occured on fetching info. <@${message.author.id}>`
          );
          console.error('Error on retrieving info:', err);
        });
    });
  } else {
    message.channel.send(
      `Invalid URL. Atomic Abortion starts... <@${message.author.id}>`
    );
  }
}

export const name = 'ytdl';
export const execute = main;
