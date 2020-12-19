import Express, { Request, Response } from 'express';
import fs from 'fs';

const ytdlRoute = Express.Router();

let ytdlMap: Map<string, string>;

ytdlRoute.get('/:f', (req: Request, res: Response) => {
  if (req.params.f) {
    if (ytdlMap.has(req.params.f)) {
      const file = ytdlMap.get(req.params.f);
      if (fs.statSync(file)) {
        res.download(ytdlMap.get(req.params.f));
      } else {
        res.status(404).json({
          status: 'failed',
          message: 'file expired',
        });
      }
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'resources not found',
      });
    }
  } else {
    res.status(400).json({
      status: 'failed',
      message: 'Bad request',
    });
  }
});

export const setMap = (map: Map<string, string>) => {
  ytdlMap = map;
};

export default ytdlRoute;
