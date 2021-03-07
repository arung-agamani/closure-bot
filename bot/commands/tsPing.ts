/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'discord.js';
import * as ClosureType from '../closure';

export const name = 'thiss';
export const description = 'Ping Pong!';

function callableFunc() {
  return 'This just edited and called from another func\nFuck aaaaa';
}

export function execute(
  message: Message,
  args: Array<string>,
  botObject: ClosureType.default
): void {
  message.channel.send(`hissssssss\n${callableFunc()}`);
}
