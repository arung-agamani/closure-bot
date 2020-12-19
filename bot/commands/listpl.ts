import {
  Message,
  TextChannel,
  VoiceChannel,
  VoiceConnection,
} from 'discord.js';
import * as ClosureType from '../closure';

export const name = 'listpl';
export const description = 'List Playlist';
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

export function execute(
  message: Message,
  args: Array<string>,
  botObject: ClosureType.default
) {
  message.channel.send('Loading playlist...');
  botObject.remoteDb
    .getPlaylist(message.author.id)
    .then((res) => {
      return message.channel.send(res);
    })
    .catch((err) => {
      return message.channel.send(`Error on fetching user playlist: ${err}`);
    });
}
