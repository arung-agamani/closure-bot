import {
  Message,
  TextChannel,
  VoiceChannel,
  VoiceConnection,
} from 'discord.js';
import * as ClosureType from '../closure';

export const name = 'deletepl';
export const description = 'Delete Playlist';
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
  message.channel.send('Deleting playlist...');
  botObject.remoteDb
    .deletePlaylist(message.author.id, args[0])
    .then((res) => {
      return message.channel.send(res);
    })
    .catch((err) => {
      return message.channel.send(`Error on saving playlist: ${err}`);
    });
}
