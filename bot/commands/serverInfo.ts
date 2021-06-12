/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'discord.js';
import * as ClosureType from '../closure';
import prisma from '../database/prisma';
import logger from '../../utils/winston';

export const name = 'server';
export const description = 'Ping Pong!';

export async function execute(
  message: Message,
  args: Array<string>,
  botObject: ClosureType.default
): Promise<void> {
  if (args[0] === 'info') {
    // botObject.getServerPrefix(message.guild.id, message);
    const guildPreview = await message.guild.fetchPreview();
    message.channel.send(`Server Name : ${guildPreview.name}
    `);
  } else if (
    args[0] === 'register' &&
    message.member.hasPermission('ADMINISTRATOR')
  ) {
    try {
      await prisma.discord_guild.create({
        data: {
          guild_name: message.guild.name,
          guild_id: message.guild.id,
          registrar: message.author.id,
        },
      });
      message.channel.send('Server registered!');
    } catch (error) {
      logger.error(
        `Prisma Error on Command "Register": ${JSON.stringify(error)}`
      );
      console.log(error);
      message.channel.send('Error on registering the server');
    }
  } else {
    message.channel.send('Unknown flag...');
  }
}
