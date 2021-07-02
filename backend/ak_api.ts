import { Router, Request, Response } from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';
import path from 'path';

import prisma from '../db/prisma';
import operatorApi from './ak_api/operator';
import skillApi from './ak_api/skills';

const akAPIRouter = Router();

const logger = winston.createLogger({
  transports: [
    new WinstonDaily({
      filename: 'log-ak-api-%DATE%.txt',
      datePattern: 'YYYY-MM-DD',
      dirname: path.resolve(__dirname, 'logs'),
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.label({ label: 'ak_api' }),
    winston.format.uncolorize(),
    winston.format.json()
  ),
});

akAPIRouter.use(
  expressWinston.logger({
    winstonInstance: logger,
    expressFormat: true,
  })
);

akAPIRouter.use('/operator', operatorApi);
akAPIRouter.use('/skill', skillApi);

akAPIRouter.get('/operators', async (req: Request, res: Response) => {
  try {
    const ops = await prisma.ak_operator.findMany({
      select: {
        name: true,
        char_id: true,
      },
      orderBy: [{ name: 'asc' }],
    });
    res.status(200).json({
      status: 'success',
      data: ops,
    });
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'something went wrong',
    });
  }
});

export default akAPIRouter;
