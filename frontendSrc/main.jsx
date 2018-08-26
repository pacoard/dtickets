import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import ReduxProvider from './components/ReduxProvider';

const render = (Component) => {
  ReactDOM.render(
      <ReduxProvider />,
    document.getElementById('root'),
  );
};

render(ReduxProvider);

