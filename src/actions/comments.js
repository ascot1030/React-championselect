import fetch from 'isomorphic-fetch';
import qs from 'querystring';

import {
  CS_COMMENTS_URL
} from '../constants/urls';

export const ADD_COMMENT_ATTEMPT = 'ADD_COMMENT_ATTEMPT';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

// {
//     token: <auth token>,
//     authorName: <author name from auth>,
//     authorId: <author id from auth>,
//     content: <the comment>,
//     *title: <title>,
//     *anonymous: <if auth is anon (boolean)>,
//     champKey: <the champion>,
//     *matchupChampKey: <the matchup champ (defaults to "general")>,
//     *type: <counter,tie,synergy,strongpick,general (defaults to general)>,
//     *lane: <top, jungle, middle, bottom, general (defaults to general)>,
//     *parent: <id of the immediate parent comment>,
//     *root: <id of the root comment of the tree>
// }

export function addComment () {
  return {
    dispatch(signInRequest());

    const data = qs.stringify({
      email,
      password,
    });

    return fetch(SIGN_IN_URL, {
      body: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    })
      .then(response => {
        const {
          status,
          statusText
        } = response;

        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          dispatch(signInFailure(error));

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(json => {
        if (json.hasOwnProperty('error')) {
          const error = new Error(json.error);
          dispatch(signInFailure(error));
        } else {
          const {
            access_token: token,
            user: {
              // email,
              // id: userId,
              username
            }
          } = json;

          localStorage.setItem('token', token);
          localStorage.setItem('username', username);

          // TODO: return?
          dispatch(signInSuccess({token, username}));
        }
      })
  };
}

export function addCommentAttempt () {
  return {
    type: ADD_COMMENT_ATTEMPT
  }
}

export function fetchCommentsIfNeeded (params) {
  return (dispatch, getState) => {
    if (shouldFetchComments(getState())) {
      const fullUrl = `${CS_COMMENTS_URL}?${qs.stringify(params)}`;

      return dispatch(fetchComments(fullUrl));
    }
  };
}

function shouldFetchComments (state) {
  const {
    all: {
      comments
    }
  } = state;

  if (comments.isFetching)
    return false;

  return true;
}

function fetchComments (url) {
  return dispatch => {
    dispatch(requestComments());

    return fetch(url)
      .then(response => {
        const {
          status,
          statusText
        } = response;

        if (status >= 200 && status < 300) {
          return response;
        } else {
          const error = new Error(statusText);
          console.log(`Response returned an error for ${url}: ${error.message}`);

          return Promise.reject(error);
        }
      })
      .then(response => response.json())
      .then(json => dispatch(receiveComments(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestComments () {
  return {
    type: REQUEST_ALL_COMMENTS
  };
}

function requestCommentsSuccess () {
  return {
    type: REQUEST_ALL_COMMENTS_SUCCESS
  };
}

function requestCommentsFailure () {
  return {
    type: REQUEST_ALL_COMMENTS_FAILURE
  };
}

function receiveComments (data) {
  return {
    type: RECEIVE_ALL_COMMENTS,
    data
  };
}
xport const SIGN_OUT = 'SIGN_OUT';
