import {
  combineReducers
} from 'redux';

import {
  REQUEST_MOST_POPULAR_CHAMPIONS,
  RECEIVE_MOST_POPULAR_CHAMPIONS,
  REQUEST_ALL_COMMENTS,
  REQUEST_ALL_COMMENTS_SUCCESS,
  REQUEST_ALL_COMMENTS_FAILURE,
  RECEIVE_ALL_COMMENTS,
  ADD_TO_ALL_COMMENTS
} from '../actions/all';

const initialState = {
  isFetching: false,
  data: null
};

function comments (state = initialState, action) {
  switch (action.type) {
    case REQUEST_ALL_COMMENTS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_ALL_COMMENTS:
      return {
        ...state,
        isFetching: false,
        data: action.data
      };

    case ADD_TO_ALL_COMMENTS:
      return {
        ...state,
        data: action.data
      };
    default:
      return state;
  }
}

function mostPopularChampions (state = initialState, action) {
  switch (action.type) {
    case REQUEST_MOST_POPULAR_CHAMPIONS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_MOST_POPULAR_CHAMPIONS:
      return {
        ...state,
        isFetching: false,
        data: action.data
      };
    default:
      return state;
  }
}

const all = combineReducers({
  comments,
  mostPopularChampions
});

export default all;
