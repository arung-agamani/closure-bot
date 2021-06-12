import { Router, Request, Response } from 'express';
import prisma from '../bot/database/prisma';
import logger from '../utils/winston';

const crxRouter = Router();

crxRouter.get('/', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

crxRouter.get(
  '/warf/discord/guild/:guildId/tags',
  async (req: Request, res: Response) => {
    const { guildId } = req.params;
    try {
      const tags = await prisma.discord_guild_tags.findMany({
        include: {
          discord_guild_channels: true,
        },
        where: {
          discord_guild_channels: {
            guild_id: guildId,
          },
        },
      });
      const tagsTransformed = tags.map((item) => item.tag);
      res.status(200).json({
        status: 'success',
        data: tagsTransformed,
      });
    } catch (error) {
      logger.error(`Warfarin Error at ${req.url}: ${JSON.stringify(error)}`);
      res.status(500).json({
        status: 'failed',
        message: 'Error query probably',
      });
    }
  }
);

export default crxRouter;
