import ReactDOM from 'react-dom';
import React from 'react';

import Main from './components/Main';

const App: React.FC = () => {
  return <Main />;
};

// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.getElementById('app'));
