/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'discord.js';
import * as ClosureType from '../closure';
import { setChannelTag } from '../../db/prisma';
import logger from '../../utils/winston';

export const name = 'rc';
export const description = 'Registering the channel';

export function execute(
  message: Message,
  args: Array<string>,
  botObject: ClosureType.default
): void {
  if (message.member.hasPermission('ADMINISTRATOR')) {
    setChannelTag(
      message.guild.id,
      message.channel.id,
      args[0],
      message.author.id
    )
      .then((res) => {
        logger.info(`Channel Registration Event: ${res}`);
        message.channel.send(`Channel registered with tag: ${args[0]}`);
      })
      .catch((err) => {
        logger.error(`Error on Channel Registration Event: ${err}`);
        message.channel.send('Error on creating the entry');
      });
  } else {
    message.channel.send('You need administrator rights, Doctor.');
  }
}
