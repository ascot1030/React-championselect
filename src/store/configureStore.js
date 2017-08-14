import thunk from 'redux-thunk';

import rootReducer from '../reducers/index';

import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';

export default function configureStore (preloadedState) {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(thunk),
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    )
  );

  return store;
}
