import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as styled from 'styled-components';
// import YTDL from './YTDL';
// import Homepage from './Homepage';
import DiscordRedirect from '../pages/DiscordLoginRedirect';

const YTDL = React.lazy(() => import('./YTDL'));
const Homepage = React.lazy(() => import('./Homepage'));
const Discord = React.lazy(() => import('./Discord'));

const Main: React.FC = () => {
  return (
    <Router>
      <GlobalStyles />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/ytdl" component={YTDL} />
          <Route exact path="/discord" component={Discord} />
          <Route exact path="/disc_redir" component={DiscordRedirect} />
        </Switch>
      </Suspense>
    </Router>
  );
};

const GlobalStyles = styled.createGlobalStyle`
  body {
    margin: 0;
  }
`;

export default Main;
