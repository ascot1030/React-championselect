import {
  combineReducers
} from 'redux';

import {
  REQUEST_CHAMPION,
  RECEIVE_CHAMPION,
  REQUEST_COUNTER_TIPS,
  RECEIVE_COUNTER_TIPS,
  REQUEST_HOME_COUNTER_TIPS,
  RECEIVE_HOME_COUNTER_TIPS,
  REQUEST_MATCHUPS,
  REQUEST_MATCHUPS_SUCCESS,
  REQUEST_MATCHUPS_FAILURE,
  RECEIVE_MATCHUP
} from '../actions/api';

import {
  LANES
} from '../constants/matchups';

const initialChampionState = {
  isFetching: false,
  data: null
};

function champion (state = initialChampionState, action) {
  switch (action.type) {
    case REQUEST_CHAMPION:
      return {
        ...state,
        championKey: action.championKey,
        isFetching: true
      };
    case RECEIVE_CHAMPION:
      return {
        ...state,
        isFetching: false,
        data: action.data
      };
    default:
      return state;
  }
}

const initialCounterTipsState = {
  isFetching: false,
  data: null,
  shouldInvalidate: false
};

function counterTips (state = initialCounterTipsState, action) {
  switch (action.type) {
    case REQUEST_COUNTER_TIPS:
      return {
        ...state,
        championKey: action.championKey,
        isFetching: true
      };
    case RECEIVE_COUNTER_TIPS:
      return {
        ...state,
        isFetching: false,
        data: action.data
      };
    case 'INVALIDATE_COUNTER_TIPS_CHAMPION':
      return {
        ...state,
        shouldInvalidate: true
      };
    default:
      return state;
  }
}

const initialHomeCounterTipsState = {
  isFetching: false,
  data: []
};

function homeCounterTips (state = initialHomeCounterTipsState, action) {
  switch (action.type) {
    case REQUEST_HOME_COUNTER_TIPS:
      return {
        ...state,
        championKey: action.championKey,
        isFetching: true
      };
    case RECEIVE_HOME_COUNTER_TIPS:
      return {
        ...state,
        isFetching: false,
        data: action.data
      };
    default:
      return state;
  }
}

const initializedMatchups = LANES.reduce((acc, lane) => {
  return {
    ...acc,
    [lane]: null
  };
}, {});

const initialMatchupsState = {
  championKey: null,
  matchups: initializedMatchups,
  isFetching: false,
};

function matchups (state = initialMatchupsState, action) {
  switch (action.type) {
    case REQUEST_MATCHUPS:
      return {
        ...state,
        championKey: action.championKey,
        isFetching: true
      };
    case RECEIVE_MATCHUP:
      const {
        matchups
      } = state;

      return {
        ...state,
        matchups: {
          ...matchups,
          [action.lane]: action.matchup
        }
      };
    case REQUEST_MATCHUPS_SUCCESS:
      return {
        ...state,
        isFetching: false
      };
    case REQUEST_MATCHUPS_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
}

const api = combineReducers({
  champion,
  counterTips,
  homeCounterTips,
  matchups
});

export default api;
