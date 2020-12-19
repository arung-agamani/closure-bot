/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Message } from 'discord.js';
import * as ClosureType from '../closure';
import { MusicQueue } from './nowplaying';

const validRegex = new RegExp(/^\d+$/);
export const name = 'skip';
export const description = 'Skip currently playing music!d';
// eslint-disable-next-line consistent-return
export function execute(
  message: Message,
  args: Array<string>,
  botObject: ClosureType.default
) {
  if (!message.member.voice.channel) {
    return message.channel.send(
      'You have to be in voice channel to use this command'
    );
  }
  if (!botObject.musicQueue) {
    return message.channel.send('Nothing played, nothing to skip :D');
  }
  if (args.length === 2) {
    if (args[0] === 'to' && validRegex.test(args[1])) {
      const jumpPos = parseInt(args[1], 10);
      const musicQueue: MusicQueue = botObject.musicQueue.get(message.guild.id);
      if (jumpPos > musicQueue.songs.length || jumpPos < 1) {
        return message.channel.send(
          'Index out of queue range. Enter valid position >:('
        );
      }
      musicQueue.currentlyPlaying = jumpPos - 2;
      musicQueue.connection.dispatcher.end();
      return message.channel.send(
        `Skipping to pos ${jumpPos}: **${musicQueue.songs[jumpPos - 1].title}**`
      );
    }
    return message.channel.send(
      'Wrong command. Use ```skip to <jump position>``` as the flag'
    );
  }
  if (args.length === 0) {
    const musicQueue: MusicQueue = botObject.musicQueue.get(message.guild.id);
    musicQueue.connection.dispatcher.end();
  } else {
    return message.channel.send('What.... are you trying to do...?');
  }
}
/* module.exports = {
    name : 'skip',
    description : 'Skip currently playing music!',
    execute(message, args, botObject) {
        if (!message.member.voice.channel) {
            return message.channel.send("You have to be in voice channel to use this command");
        }
        if (!botObject.musicQueue) {
            return message.channel.send("Nothing played, nothing to skip :D");
        }
        botObject.musicQueue.get(message.guild.id).connection.dispatcher.end();
    }
} */
