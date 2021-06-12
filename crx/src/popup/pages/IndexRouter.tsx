import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { switchPage } from '../reducers/pageReducer';

import Navbar from '../components/Navbar';
import ArknightsPage from './Arknights';
import AzurLanePage from './AzurLane';
import GenshinPage from './Genshin';

const IndexRouter = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isInit, setIsInit] = useState(true);
  useEffect(() => {
    chrome.storage.local.get('page', (res) => {
      if (res.page && res.page !== '') {
        dispatch(switchPage(res.page));
        history.push(`/${res.page}`);
        setIsInit(false);
      } else {
        console.log('page empty');
      }
    });
  }, []);
  if (isInit) return null;
  return (
    <>
      <Navbar />
      <Route exact path="/ak">
        <ArknightsPage />
      </Route>
      <Route exact path="/al">
        <AzurLanePage />
      </Route>
      <Route exact path="/gi">
        <GenshinPage />
      </Route>
    </>
  );
};

export default IndexRouter;
