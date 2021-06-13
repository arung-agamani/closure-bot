/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { PrismaClient } from '@prisma/client';
import winston from '../utils/winston';

const prisma = new PrismaClient();

prisma.$on('beforeExit', () => {
  winston.info(`PrismaJS Connection has ended at ${new Date().toISOString()}`);
});

export async function getServerPrefix(guildId: string) {
  return prisma.discord_guild_prefix.findUnique({
    where: {
      guild_id: guildId,
    },
  });
}

export async function getChannelTags(guildId: string, channelId: string) {
  return prisma.discord_guild_tags.findMany({
    include: {
      discord_guild_channels: true,
    },
    where: {
      discord_guild_channels: {
        guild_id: guildId,
        channel_id: channelId,
      },
    },
  });
}

export async function setChannelTag(
  guildId: string,
  channelId: string,
  tag: string,
  registrar: string
) {
  return prisma.discord_guild_tags.create({
    data: {
      tag,
      registrar,
      discord_guild_channels: {
        connectOrCreate: {
          where: {
            guild_id_channel_id: {
              guild_id: guildId,
              channel_id: channelId,
            },
          },
          create: {
            guild_id: guildId,
            channel_id: channelId,
            registrar,
          },
        },
      },
    },
  });
}

export default prisma;
