// ts section
import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import socketIO from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import { URL } from 'url';
import { config } from 'dotenv';
import Closure from './bot/closure';
import YTDLApp from './web/ytdlApp';

import ytdlRoute, { setMap } from './web/ytdl';
import discordRoute from './backend/discordOauth';
import warfarinRoute from './backend/warfarinDb';
import crxRouter from './backend/crx';
import akAPIRouter from './backend/ak_api';

config();

// const Closure = require('./bot/closure');

// const path = require('path');
// const fs = require('fs');

let botApp: Closure;

if (process.env.BOT === '1') {
  botApp = new Closure();
  console.log('Starting bot.');
  botApp.start(process.env.DISCORD_BOT_TOKEN || '');
}

if (process.env.SERVER === '1') {
  console.log('Starting server.');
  const server = express();
  const httpServer = http.createServer(server);

  const io = socketIO(httpServer);
  const ytdlMap = new Map<string, string>();
  const ytdlApp = new YTDLApp(io, ytdlMap);
  setMap(ytdlMap);
  ytdlApp.start();

  server.use(bodyParser.json());
  server.use(cors());

  server.use('/ytdl', ytdlRoute);
  server.use('/api/discord', discordRoute);
  server.use('/api/warfarin', warfarinRoute);
  server.use('/api/crx', crxRouter);
  server.use('/api/ak', akAPIRouter);

  server.get('/ytdl/mp3/download', (req: Request, res: Response) => {
    // console.log(req.query);
    if (botApp.ytdlMp3Map.has(req.query.f)) {
      res.download(botApp.ytdlMp3Map.get(req.query.f));
    } else {
      res.status(404).send('File not exist or has expired').end();
    }
  });

  server.post('/closure', (req: Request, res: Response) => {
    res.json({ status: 200 });
  });

  server.post('/warfarin', (req: Request, res: Response) => {
    console.log(req.body);

    if (req.body.requestOrigin === 'Twitter') {
      // const urlObject = new URL(req.body.pageUrl);
      // console.log(urlObject);
      const twitterUrl = new URL(req.body.linkUrl);
      const { origin } = twitterUrl;
      const paths = twitterUrl.pathname.split('/');
      const pathm = paths.slice(0, paths.length - 2).join('/');
      botApp.publishLink(req.body.guildId, req.body.tag, origin + pathm);
    } else if (req.body.requestOrigin === 'Facebook') {
      const urlObject = new URL(req.body.pageUrl);
      console.log(urlObject.href);
    } else if (req.body.requestOrigin.match(/pixiv/i)) {
      console.log(req.body.value);
      if (req.body.value.linkUrl.match(/pximg/i)) {
        // this is a right click on image
        botApp.publishLink(
          req.body.guildId,
          req.body.tag,
          req.body.value.pageUrl,
          req.body.value.srcUrl
        );
      } else if (req.body.value.linkUrl.match(/pixiv\.net/i)) {
        // this is a right click on image thumbnail to another artwork
        botApp.publishLink(
          req.body.guildId,
          req.body.tag,
          req.body.value.linkUrl,
          req.body.value.srcUrl
        );
      }
      // botApp.publishLink('339763195554299904', req.body.tag, req.body.value.pageUrl);
    }
    // botApp.publishLink('339763195554299904', req.body.tag, urlObject.href);
    res.send('POST Request 200');
  });

  server.get('/warfarin', (req: Request, res: Response) => {
    res.send('GET Request 200');
  });

  server.get('/warfarin/:guild_id/tags', (req: Request, res: Response) => {
    botApp.getGuildTags(req.params.guild_id, (retval) => {
      if (retval.status === 200) {
        res.json(retval);
      } else {
        res.status(400).send(retval.message);
      }
    });
  });

  server.get('/warfarin/:guild_id/info', (req: Request, res: Response) => {
    botApp.getGuildInfo(req.params.guild_id, (retval) => {
      if (retval.status !== 400) {
        res.json(retval);
      } else {
        res.status(400).send(retval.message);
      }
    });
  });

  server.post('/test', (req: Request, res: Response) => {
    if (req.headers['x-github-event'] !== undefined) {
      res.json({ status: 'from github' });
    } else {
      res.json({ status: 404 });
    }
  });

  server.use(
    '/static',
    express.static(path.resolve(__dirname, 'views', 'dist'))
  );
  server.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'views', 'dist', 'index.html'));
  });

  /* server.listen(2000, () => {
    console.log('Server is on at port 2000');
  }); */
  httpServer.listen(2000, () => {
    console.log('Server is on at port 2000');
  });
}

// misc functions

/* function setDefaultChannel(guildID: string, channelID: string) {
  const configFile = JSON.parse(fs.readFileSync('./bot/closure.json'));
  configFile.defaultGuildID = guildID;
  configFile.defaultChannelID = channelID;
  fs.writeFileSync('./bot/closure.json', JSON.stringify(configFile, null, 4));
} */
