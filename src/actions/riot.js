import fetch from 'isomorphic-fetch';
import mapKeys from 'lodash/mapKeys';

import {
  RIOT_CHAMPIONS_URL
} from '../constants/urls';

// import {
//   callApiIfNeeded
// } from '../utils/api';

export const REQUEST_CHAMPIONS = 'REQUEST_CHAMPIONS';
// export const REQUEST_CHAMPIONS_SUCCESS = 'REQUEST_CHAMPIONS_SUCCESS';
// export const REQUEST_CHAMPIONS_FAILURE = 'REQUEST_CHAMPIONS_FAILURE';
export const RECEIVE_CHAMPIONS = 'RECEIVE_CHAMPIONS';

// export function fetchChampions () {
//   return (dispatch, getState) => {
//     const types = {
//       request: REQUEST_CHAMPIONS,
//       success: REQUEST_CHAMPIONS_SUCCESS,
//       failure: REQUEST_CHAMPIONS_FAILURE,
//       receive: RECEIVE_CHAMPIONS
//     };
//
//     return dispatch(callApiIfNeeded(RIOT_CHAMPIONS_URL, types, getState()));
//   };
// }

export function fetchChampionsIfNeeded () {
  return (dispatch, getState) => {
    if (shouldFetchChampions(getState())) {
      return dispatch(fetchChampions(RIOT_CHAMPIONS_URL));
    }
  };
}

function shouldFetchChampions (state) {
  const {
    riot: {
      champions
    }
  } = state;

  // if (champions.isFetching)
  //   return false;

  return true;
}

function fetchChampions (url) {
  return dispatch => {
    dispatch(requestChampions());

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
      .then(json => dispatch(receiveChampions(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestChampions () {
  return {
    type: REQUEST_CHAMPIONS
  };
}

function receiveChampions (data) {
  const cleanedData = mapKeys(data.data, (v, k) => ("" + k).replace(/[-\+'`´\s]+/g, '').toLowerCase());
  data.data = cleanedData;

  return {
    type: RECEIVE_CHAMPIONS,
    data
  };
}
