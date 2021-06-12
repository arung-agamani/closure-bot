/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import redis from 'redis';
import { config } from 'dotenv';

config();

const redisClient = redis.createClient({
  port: 6379,
  host: 'localhost',
  password: process.env.REDIS_PASSWORD,
});

const prisma = new PrismaClient();

async function main() {
  try {
    const prefixes = await prisma.discord_guild_prefix.findMany();
    prefixes.forEach((prefix) => {
      redisClient.set(prefix.guild_id, prefix.prefix);
    });
    return Promise.resolve('Done Sync!');
  } catch (error) {
    return Promise.reject(error);
  }
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
