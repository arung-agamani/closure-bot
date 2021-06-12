/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import redisClient from './utils/redis';

config();

const prisma = new PrismaClient();

async function main() {
  try {
    const prefixes = await prisma.discord_guild_prefix.findMany();
    prefixes.forEach((prefix) => {
      redisClient.set(prefix.guild_id, prefix.prefix);
      console.log(`Added prefix to ${prefix.guild_id} : ${prefix.prefix}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
