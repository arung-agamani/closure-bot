import React, { Suspense } from 'react';

// import YTDL from './YTDL';

const YTDL = React.lazy(() => import('./YTDL'));

const Main: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <YTDL />
    </Suspense>
  );
};

export default Main;
