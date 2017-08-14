import {
  combineReducers
} from 'redux';

import {
  REQUEST_ALL_COMMENTS,
  REQUEST_ALL_COMMENTS_SUCCESS,
  REQUEST_ALL_COMMENTS_FAILURE,
  RECEIVE_ALL_COMMENTS
} from '../actions/all';

const initialState = {
  isFetching: false,
  data: null
};

function comments (state = initialState, action) {
  switch (action.type) {
    case ADD_COMMENT_ATTEMPT:
      return {
      };
    case COMMENT_ATTEMPT:
      return {
      };
    default:
      return state;
  }
}

export default comments;
