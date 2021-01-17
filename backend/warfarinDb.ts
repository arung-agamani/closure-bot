import { Router, Request, Response } from 'express';
import WarfarinDb from '../bot/database/index';

const connection = new WarfarinDb();

const warfarinRouter = Router();

warfarinRouter.get('/playlist/list', async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (userId !== null) {
    try {
      const list = await connection.getPlaylistAsArray(userId);
      res.json({
        status: 'success',
        data: list,
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error,
      });
    }
  } else {
    res.status(400).json({
      status: 'failed',
      message: 'missing userid',
    });
  }
});

export default warfarinRouter;
