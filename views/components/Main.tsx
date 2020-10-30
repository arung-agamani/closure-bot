import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import YTDL from './YTDL';
// import Homepage from './Homepage';

const YTDL = React.lazy(() => import('./YTDL'));
const Homepage = React.lazy(() => import('./Homepage'));

const Main: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/ytdl" component={YTDL} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default Main;
