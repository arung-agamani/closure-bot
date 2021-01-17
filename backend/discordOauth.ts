import { Router, Request, Response } from 'express';
import axios from 'axios';
import qs from 'qs';
import btoa from 'btoa';
import fetch from 'node-fetch';

const discordRouter = Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const redirectUriRaw = `${
  process.env.NODE_ENV === 'dev'
    ? 'http://localhost:2000'
    : 'https://closure.howlingmoon.dev'
}/api/discord/callback`;
const redirectUri = encodeURIComponent(redirectUriRaw);

discordRouter.get('/login', (req: Request, res: Response) => {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=identify`
  );
});

discordRouter.get('/callback', async (req: Request, res: Response) => {
  const { code } = req.query;
  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUriRaw,
    scope: 'identify',
  };
  try {
    const fetchRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: qs.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const response = await fetchRes.json();
    const discordMe = await axios.get('https://discordapp.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${response.access_token}`,
      },
    });
    const queryData = btoa(JSON.stringify(discordMe.data));
    res.redirect(`/disc_redir?discordAData=${queryData}`);
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed on callback',
      data: error.message,
    });
  }
});

export default discordRouter;
