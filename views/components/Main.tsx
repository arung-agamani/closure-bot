import React from 'react';

// import YTDL from './YTDL';

const YTDL = React.lazy(() => import('./YTDL'));

const Main: React.FC = () => {
  return <YTDL />;
};

export default Main;
