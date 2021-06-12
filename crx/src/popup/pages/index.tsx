import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { page } from '../reducers/pageReducer';

import FallbackPage from './Arknights';

// pages
const ArknightsPage = React.lazy(() => import('./Arknights'));
const GenshinPage = React.lazy(() => import('./Genshin'));
const AzurPage = React.lazy(() => import('./AzurLane'));

const index: React.FC = () => {
  const pageState = useSelector(page);

  let retval: JSX.Element;
  switch (pageState.name) {
    case 'AK':
      retval = <ArknightsPage />;
      break;
    case 'GI':
      retval = <GenshinPage />;
      break;
    case 'AL':
      retval = <AzurPage />;
      break;
    default:
      retval = <FallbackPage />;
      break;
  }

  return <Suspense fallback={<h1>Loading component...</h1>}>{retval}</Suspense>;
};

export default index;
