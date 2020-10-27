import Express, { Request, Response } from 'express';

const ytdlRoute = Express.Router();

ytdlRoute.get('/', (req: Request, res: Response) => {
  res.send('ytdl part here');
});

export default ytdlRoute;
