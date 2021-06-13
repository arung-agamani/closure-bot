/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'discord.js';
import * as ClosureType from '../closure';
import prisma from '../../db/prisma';
import logger from '../../utils/winston';
import redis from '../../utils/redis';

export const name = 'prefix';
export const description = 'Ping Pong!';

export async function execute(
  message: Message,
  args: Array<string>,
  botObject: ClosureType.default
): Promise<void> {
  if (message.member.hasPermission('ADMINISTRATOR')) {
    try {
      if (args.length > 0) {
        await redis.set(message.guild.id, args[0]);
        await prisma.discord_guild_prefix.upsert({
          create: {
            guild_id: message.guild.id,
            prefix: args[0],
          },
          update: {
            guild_id: message.guild.id,
            prefix: args[0],
          },
          where: {
            guild_id: message.guild.id,
          },
        });
        message.channel.send(
          `Successfully set the server prefix to ${args[0]}`
        );
      } else {
        const prefix = await redis.get(message.guild.id);
        message.channel.send(`Prefix for this server is : ${prefix}`);
      }
    } catch (error) {
      logger.error(`prefix: ${error}`);
      message.channel.send('Error when calling prefix command');
    }
  }
}
