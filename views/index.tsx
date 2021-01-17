import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

import closureStore from './store/closureStore';
import Main from './components/Main';

const App: React.FC = () => {
  return (
    <Provider store={closureStore}>
      <Main />
    </Provider>
  );
};

// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.getElementById('app'));
