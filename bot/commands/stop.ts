/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'discord.js';
import * as ClosureType from '../closure';

export const name = 'stop';
export const description = 'Ping Pong!';

export function execute(
  message: Message,
  args: Array<string>,
  botObject: ClosureType.default
): void {
  if (!message.member.voice.channel) {
    message.channel.send('You have to be in voice channel to use this command');
  }
  botObject.musicQueue.get(message.guild.id).songs = [];
  botObject.musicQueue.get(message.guild.id).connection.dispatcher.end();
}
