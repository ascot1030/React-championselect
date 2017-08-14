import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import useScroll from 'react-router-scroll';

import configureStore from './store/configureStore';
import routes from './routes/index';

import {
  Provider
} from 'react-redux';

import {
  Router,
  applyRouterMiddleware,
  browserHistory
} from 'react-router';

import {
  syncHistoryWithStore
} from 'react-router-redux';

ReactGA.initialize('UA-34824089-1');

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);
const history = syncHistoryWithStore(browserHistory, store);

const rootElement = document.getElementById('mount');

ReactDOM.render(
  <Provider store={store}>
    <Router
      history={history}
      onUpdate={fireTracking}
      render={applyRouterMiddleware(useScroll())}
      routes={routes}
    >
    </Router>
  </Provider>,
  rootElement
);

function fireTracking () {
  const pathname = window.location.pathname;

  ReactGA.set({page: pathname});
  ReactGA.pageview(pathname);
}
