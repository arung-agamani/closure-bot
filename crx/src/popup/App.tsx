import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import WarfarinStore from './stores/warfarin';

import PageIndexRouter from './pages/IndexRouter';

import './styles.css';

const App: React.FC = () => {
  return (
    <Provider store={WarfarinStore}>
      {/* <Navbar /> */}
      <Router>
        <PageIndexRouter />
      </Router>
    </Provider>
  );
};

export default App;
