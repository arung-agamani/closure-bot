import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider, Arwes, createTheme } from 'arwes';

const DiscordLoginRedirect: React.FC = () => {
  const query = new URLSearchParams(useLocation().search);
  useEffect(() => {
    const user = atob(query.get('discordAData'));
    if (user === '') {
      window.close();
    } else {
      window.localStorage.setItem('discordAuthData', user);
      setTimeout(() => {
        window.close();
      }, 5000);
    }
  }, []);
  return (
    <Wrapper>
      <ThemeProvider theme={createTheme()}>
        <Arwes animated>
          <h1>Discord Authentication Page</h1>
          <p>You&apos;ll be redirected soon.</p>
        </Arwes>
      </ThemeProvider>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: 'Titillium Web', 'sans-serif';
  .content {
    padding: 2rem;
  }
`;

export default DiscordLoginRedirect;
