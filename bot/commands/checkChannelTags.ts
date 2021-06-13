/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'discord.js';
import * as ClosureType from '../closure';
import { getChannelTags } from '../../db/prisma';
import logger from '../../utils/winston';

export const name = 'checktags';
export const description = 'Checking registered tags on this channel';

export function execute(
  message: Message,
  args: Array<string>,
  botObject: ClosureType.default
): void {
  if (message.member.hasPermission('ADMINISTRATOR')) {
    getChannelTags(message.guild.id, message.channel.id)
      .then((res) => {
        logger.info(`Channel Tags Checking Event: ${res}`);
        const tags = [];
        res.forEach((item) => {
          tags.push(item.tag);
        });
        message.channel.send(`Channel registered here: ${tags.join(', ')}`);
      })
      .catch((err) => {
        logger.error(`Error on Channel Tags Checking Event: ${err}`);
        message.channel.send('Error on fetching the entry');
      });
  } else {
    message.channel.send('You need administrator rights, Doctor.');
  }
}
