/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'discord.js';
import * as ClosureType from '../closure';

export const name = 'reload';
export const description = 'Ping Pong!';

export function execute(
  message: Message,
  args: Array<string>,
  botObject: ClosureType.default
): void {
  if (message.member.hasPermission('ADMINISTRATOR')) {
    botObject
      .reload_REQUIRE()
      .then(() => {
        message.channel.send('Hot reloading success!');
      })
      .catch(() => {
        message.channel.send('Hot reloading failed :(');
      });
  } else {
    message.channel.send("You're not an administrator");
  }
}
