import fetch from 'isomorphic-fetch';
import qs from 'querystring';

import {
  CS_CHAMPION_URL
} from '../constants/urls';

export const REQUEST_MATCHUP_COUNTER_TIPS = 'REQUEST_MATCHUP_COUNTER_TIPS';
export const RECEIVE_MATCHUP_COUNTER_TIPS = 'RECEIVE_MATCHUP_COUNTER_TIPS';

// 50 items with highest score in descending order
const defaultParams = {
  limit: 100,
  orderBy: 'score',
  order: -1
};

export function fetchCounterTipsIfNeeded (championKey, matchupChampionKey, params = defaultParams) {
  return (dispatch, getState) => {
    if (shouldFetchCounterTips(getState(), championKey, matchupChampionKey)) {
      const root = `${CS_CHAMPION_URL}/${championKey}/${matchupChampionKey}/countertips`;
      const fullUrl = `${root}?${qs.stringify(params)}`;

      return dispatch(fetchCounterTips(fullUrl, championKey, matchupChampionKey));
    }
  };
}

function shouldFetchCounterTips (state, championKey, matchupChampionKey) {
  const {
    matchup: {
      counterTips
    }
  } = state;

  if (counterTips.isFetching)
    return false;

  // if (counterTips.isFetching || (championKey === counterTips.championKey && matchupChampionKey === counterTips.matchupChampionKey))
  //   return false;

  return true;
}

function fetchCounterTips (url, championKey, matchupChampionKey) {
  return dispatch => {
    dispatch(requestCounterTips(championKey, matchupChampionKey));

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
      .then(json => dispatch(receiveCounterTips(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestCounterTips (championKey, matchupChampionKey) {
  return {
    type: REQUEST_MATCHUP_COUNTER_TIPS,
    championKey,
    matchupChampionKey
  };
}

function receiveCounterTips (data) {
  return {
    type: RECEIVE_MATCHUP_COUNTER_TIPS,
    data
  };
}

export const REQUEST_MATCHUP_MATCHUPS = 'REQUEST_MATCHUP_MATCHUPS';
export const RECEIVE_MATCHUP_MATCHUPS = 'RECEIVE_MATCHUP_MATCHUPS';

export function fetchMatchupsIfNeeded (championKey, matchupChampionKey, params = defaultParams) {
  return (dispatch, getState) => {
    if (shouldFetchMatchups(getState(), championKey, matchupChampionKey)) {
      const root = `${CS_CHAMPION_URL}/${championKey}/${matchupChampionKey}/matchups`;
      const fullUrl = `${root}?${qs.stringify(params)}`;

      return dispatch(fetchMatchups(fullUrl, championKey, matchupChampionKey));
    }
  };
}

function shouldFetchMatchups (state, championKey, matchupChampionKey) {
  const {
    matchup: {
      matchups
    }
  } = state;

  if (matchups.isFetching || (championKey === matchups.championKey && matchupChampionKey === matchups.matchupChampionKey))
    return false;

  return true;
}

function fetchMatchups (url, championKey, matchupChampionKey) {
  return dispatch => {
    dispatch(requestMatchups(championKey, matchupChampionKey));

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
      .then(json => dispatch(receiveMatchups(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestMatchups (championKey, matchupChampionKey) {
  return {
    type: REQUEST_MATCHUP_MATCHUPS,
    championKey,
    matchupChampionKey
  };
}

function receiveMatchups (data) {
  return {
    type: RECEIVE_MATCHUP_MATCHUPS,
    data
  };
}

const defaultCommentsParams = {
  limit: 100,
  orderBy: 'score',
  order: -1
};

export const REQUEST_MATCHUP_COMMENTS = 'REQUEST_MATCHUP_COMMENTS';
export const RECEIVE_MATCHUP_COMMENTS = 'RECEIVE_MATCHUP_COMMENTS';

export function fetchCommentsIfNeeded (championKey, matchupChampionKey, params = defaultCommentsParams) {
  return (dispatch, getState) => {
    if (shouldFetchComments(getState(), championKey, matchupChampionKey)) {
      const root = `${CS_CHAMPION_URL}/${championKey}/${matchupChampionKey}/comments`;
      const fullUrl = `${root}?${qs.stringify(params)}`;

      return dispatch(fetchComments(fullUrl, championKey, matchupChampionKey));
    }
  };
}

function shouldFetchComments (state, championKey, matchupChampionKey) {
  const {
    matchup: {
      comments
    }
  } = state;

  if (comments.isFetching)
    return false;

  // if (comments.isFetching || (championKey === comments.championKey && matchupChampionKey === comments.matchupChampionKey))
  //   return false;

  return true;
}

function fetchComments (url, championKey, matchupChampionKey) {
  return dispatch => {
    dispatch(requestComments(championKey, matchupChampionKey));

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

function requestComments (championKey, matchupChampionKey) {
  return {
    type: REQUEST_MATCHUP_COMMENTS,
    championKey,
    matchupChampionKey
  };
}

function receiveComments (data) {
  return {
    type: RECEIVE_MATCHUP_COMMENTS,
    data
  };
}
