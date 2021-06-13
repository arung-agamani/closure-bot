import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';

const akAPIRouter = Router();

akAPIRouter.get('/operators', async (req: Request, res: Response) => {
  try {
    const ops = await prisma.ak_operator.findMany({
      select: {
        name: true,
        char_id: true,
      },
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

akAPIRouter.get(
  '/operator/:charId/info',
  async (req: Request, res: Response) => {
    try {
      const { charId } = req.params;
      const info = await prisma.ak_operator.findFirst({
        where: {
          char_id: charId,
        },
      });
      if (info) {
        res.status(200).json({
          status: 'success',
          data: info,
        });
      } else {
        res.status(404).json({
          status: 'failed',
          message: 'not found',
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'failed',
        message: 'something went wrong',
      });
    }
  }
);

akAPIRouter.get(
  '/operator/:charId/charword',
  async (req: Request, res: Response) => {
    try {
      const { charId } = req.params;
      const info = await prisma.ak_operator_charword.findMany({
        where: {
          charId,
        },
      });
      if (info) {
        res.status(200).json({
          status: 'success',
          data: info,
        });
      } else {
        res.status(404).json({
          status: 'failed',
          message: 'not found',
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'failed',
        message: 'something went wrong',
      });
    }
  }
);

export default akAPIRouter;
