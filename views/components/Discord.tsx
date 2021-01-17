import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ThemeProvider, createTheme, Arwes, Button, Line, Frame } from 'arwes';
import axios from 'axios';

import { DiscordState } from '../store/closureStore';
import { addUserData } from '../store/actionCreators';
import { IDiscordUser } from '../interfaces/ReduxTypes';

import PlaylistTable from './Discord/ListPlaylist';

const emptyArrayRef = [];

const Discord: React.FC = () => {
  const discordUser = useSelector(DiscordState);
  const dispatch = useDispatch();
  const [isAuthStart, setIsAuthStart] = useState(false);
  const [playlistData, setPlaylistData] = useState(emptyArrayRef);

  const handleDiscordAuth = () => {
    window.open('/api/discord/login', 'discordAuthWindow');
    setIsAuthStart(true);
    startPolling();
  };

  const handleGetPlaylist = async () => {
    const { data } = await axios.get('/api/warfarin/playlist/list', {
      params: {
        userId: discordUser.id,
      },
    });
    setPlaylistData(data.data);
  };

  const startPolling = () => {
    setTimeout(() => {
      const localData = localStorage.getItem('discordAuthData');
      if (localData !== '') {
        const authData = JSON.parse(localData) as IDiscordUser;
        dispatch(addUserData(authData));
        // localStorage.removeItem('discordAuthData');
      } else {
        startPolling();
      }
    }, 3000);
  };

  useEffect(() => {
    const localData = localStorage.getItem('discordAuthData');
    if (localData !== '') {
      const authData = JSON.parse(localData) as IDiscordUser;
      dispatch(addUserData(authData));
    }
  }, []);

  return (
    <div className="content">
      <h1>Closure&apos;s Discorded Utopia</h1>
      {discordUser === null && (
        <>
          <p>
            Closure identifies using Discord account, so make sure to add it in
            your server beforehand and start using them slick features!
          </p>
          <Button animate onClick={handleDiscordAuth}>
            Login with Discord
          </Button>
          {isAuthStart && <p>Auth Window is opened</p>}
          <Line animate />
        </>
      )}
      {discordUser && (
        <div>
          <p>
            Logged as : {`${discordUser.username}#${discordUser.discriminator}`}
          </p>
          <Button animate onClick={handleGetPlaylist}>
            Show Playlists
          </Button>
          <Button animate onClick={handleGetPlaylist}>
            Show PlaylistItem
          </Button>
          <Frame show={true} animate={true} corners={2}>
            <PlaylistTable playlists={playlistData} />
          </Frame>
        </div>
      )}
    </div>
  );
};

const WrapperComponent: React.FC = () => {
  return (
    <Wrapper>
      <ThemeProvider theme={createTheme()}>
        <Arwes animate background="/static/background-medium.jpg">
          <Discord />
        </Arwes>
      </ThemeProvider>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: 'Titillium Web', 'sans-serif';
  .font-arwes {
    font-family: 'Titillium Web', 'sans-serif';
  }
  .content {
    padding: 2rem;
  }
`;

export default WrapperComponent;
