import {
  combineReducers
} from 'redux';

import {
  REQUEST_CHAMPIONS,
  RECEIVE_CHAMPIONS
} from '../actions/riot';

const initialState = {
  isFetching: false,
  data: null
};

function champions (state = initialState, action) {
  switch (action.type) {
    case REQUEST_CHAMPIONS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_CHAMPIONS:
      return {
        ...state,
        isFetching: false,
        data: action.data
      };
    default:
      return state;
  }
}

const riot = combineReducers({
  champions
});

export default riot;
