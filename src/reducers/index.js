import all from './all';
import api from './api';
import auth from './auth';
import matchup from './matchup';
import riot from './riot';

import {
  routerReducer
} from 'react-router-redux';

import {
  combineReducers
} from 'redux';

const rootReducer = combineReducers({
  all,
  api,
  auth,
  matchup,
  riot,
  routing: routerReducer
});

export default rootReducer;
