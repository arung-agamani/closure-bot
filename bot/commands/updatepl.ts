import {
  Message,
  TextChannel,
  VoiceChannel,
  VoiceConnection,
} from 'discord.js';
import * as ClosureType from '../closure';

export const name = 'updatepl';
export const description = 'Update Playlist';
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
    return message.channel.send('Give name to your playlist');
  }
  const musicQueue: MusicQueue = botObject.musicQueue.get(message.guild.id);
  const links = [];
  for (let i = 0; i < musicQueue.songs.length; i += 1) {
    links.push(musicQueue.songs[i].url);
  }
  message.channel.send('Updating playlist...');
  botObject.remoteDb
    .updatePlaylist(message.author.id, args[0], links)
    .then((res) => {
      return message.channel.send(res);
    })
    .catch((err) => {
      return message.channel.send(`Error on saving playlist: ${err}`);
    });
}
