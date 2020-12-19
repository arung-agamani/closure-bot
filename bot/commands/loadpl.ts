/* eslint-disable no-console */
/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  Message,
  TextChannel,
  VoiceChannel,
  VoiceConnection,
} from 'discord.js';
import ytdl from 'ytdl-core';
import * as ClosureType from '../closure';

export const name = 'loadpl';
export const description = 'Save Playlist';
export interface MusicQueue {
  textChannel: TextChannel;
  voiceChannel: VoiceChannel;
  connection: VoiceConnection;
  songs: SongInfo[];
  playing: boolean;
  currentlyPlaying: number;
}
export interface SongInfo {
  title: string;
  url: string;
  length: number;
}

// eslint-disable-next-line consistent-return
export function execute(
  message: Message,
  args: Array<string>,
  botObject: ClosureType.default
): unknown {
  if (args.length === 0) {
    return message.channel.send('Give name for your playlist to load');
  }
  message.channel.send('Loading playlist...');
  botObject.remoteDb
    .getPlaylistItems(message.author.id, args[0])
    // eslint-disable-next-line consistent-return
    .then(async (res) => {
      const voiceChannel = message.member.voice.channel;
      for (const item of res) {
        const song = { title: '', url: '', length: 0 };
        const songInfo = await ytdl.getInfo(item.link);
        song.title = songInfo.videoDetails.title;
        song.url = songInfo.videoDetails.video_url;
        song.length = parseInt(songInfo.videoDetails.lengthSeconds, 10);
        // const songInfo = await ytdl.getInfo(song.url);

        if (!botObject.musicQueue.get(message.guild.id)) {
          const queueConstruct = {
            textChannel: message.channel,
            voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
            currentlyPlaying: 0,
          };
          botObject.musicQueue.set(message.guild.id, queueConstruct);
          queueConstruct.songs.push(song);

          try {
            const connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0], botObject);
          } catch (err) {
            botObject.musicQueue.delete(message.guild.id);
            return message.channel.send(err.message);
          }
        } else {
          botObject.musicQueue.get(message.guild.id).songs.push(song);
          return message.channel.send(
            `${song.title} has been added to the queue!`
          );
        }
      }
    })
    .catch((err) => {
      return message.channel.send(`Error on saving playlist: ${err}`);
    });
}

function play(guild, song, botObject) {
  const musicQueue = botObject.musicQueue.get(guild.id);
  if (musicQueue.currentlyPlaying >= musicQueue.songs.length) {
    musicQueue.voiceChannel.leave();
    musicQueue.textChannel.send(
      'Reached the end in playlist. Aight, Imma head out.'
    );
    botObject.musicQueue.delete(guild.id);
    return;
  }
  const dispatcher = musicQueue.connection
    .play(
      ytdl(song.url, {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
      })
    )
    .on('finish', () => {
      // musicQueue.songs.shift();
      musicQueue.currentlyPlaying++;
      play(guild, musicQueue.songs[musicQueue.currentlyPlaying], botObject);
    })
    .on('error', (error) => {
      console.error(error);
    });
  dispatcher.setVolumeLogarithmic(musicQueue.volume / 5);
  musicQueue.textChannel.send(`Start playing **${song.title}**`);
}
