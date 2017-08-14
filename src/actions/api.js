import fetch from 'isomorphic-fetch';
import qs from 'querystring'

import {
  LANES
} from '../constants/matchups';

import {
  CS_CHAMPION_URL,
  CS_COUNTER_TIPS_URL
} from '../constants/urls';

// import {
//   callApi,
//   callApiIfNeeded
// } from '../utils/api';

export const REQUEST_CHAMPION = 'REQUEST_CHAMPION';
// export const REQUEST_CHAMPION_SUCCESS = 'REQUEST_CHAMPION_SUCCESS';
// export const REQUEST_CHAMPION_FAILURE = 'REQUEST_CHAMPION_FAILURE';
export const RECEIVE_CHAMPION = 'RECEIVE_CHAMPION';

export function fetchChampionIfNeeded (championKey) {
  return (dispatch, getState) => {
    if (shouldFetchChampion(getState(), championKey)) {
      return dispatch(fetchChampion(championKey));
    }
  };
}

function shouldFetchChampion (state, championKey) {
  const {
    api: {
      champion
    }
  } = state;

  if (champion.isFetching || championKey === champion.championKey)
    return false;

  return true;
}

// function fetchChampion (championKey) {
//   return (dispatch, getState) => {
//     const types = {
//       request: REQUEST_CHAMPION,
//       success: REQUEST_CHAMPION_SUCCESS,
//       failure: REQUEST_CHAMPION_FAILURE,
//       receive: RECEIVE_CHAMPION
//     };
//
//     const fullUrl = `${CS_CHAMPION_URL}/${championKey}`;
//
//     return dispatch(callApi(fullUrl, types));
//   };
// }

function fetchChampion (championKey) {
  return dispatch => {
    dispatch(requestChampion(championKey));

    const url = `${CS_CHAMPION_URL}/${championKey}`

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
      .then(json => dispatch(receiveChampion(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestChampion (championKey) {
  return {
    type: REQUEST_CHAMPION,
    championKey
  };
}

function receiveChampion (data) {
  return {
    type: RECEIVE_CHAMPION,
    data
  };
}

export const REQUEST_COUNTER_TIPS = 'REQUEST_COUNTER_TIPS';
// export const REQUEST_COUNTER_TIPS_SUCCESS = 'REQUEST_COUNTER_TIPS_SUCCESS';
// export const REQUEST_COUNTER_TIPS_FAILURE = 'REQUEST_COUNTER_TIPS_FAILURE';
export const RECEIVE_COUNTER_TIPS = 'RECEIVE_COUNTER_TIPS';

// TODO: abstract into fetching general counter tips and counter tips for
// champions

export function fetchCounterTipsForChampion (championKey) {
  return dispatch => {
    const params = {
      limit: 100,
      orderBy: 'score',
      order: -1
    };

    return dispatch(fetchCounterTipsIfNeeded(championKey, params));
  };
}
export function fetchCounterTipsIfNeeded (championKey, params) {
  return (dispatch, getState) => {
    if (shouldFetchCounterTips(getState(), championKey)) {
      const root = `${CS_CHAMPION_URL}/${championKey}/general/countertips`;
      const fullUrl = `${root}?${qs.stringify(params)}`;

      return dispatch(fetchCounterTips(fullUrl, championKey));
    }
  };
}

function shouldFetchCounterTips (state, championKey) {
  const {
    api: {
      counterTips
    }
  } = state;

  if (counterTips.isFetching)
    return false;

  // if ((counterTips.isFetching || championKey === counterTips.championKey))
  //   return false;

  return true;
}

function fetchCounterTips (url, championKey) {
  return dispatch => {
    dispatch(requestCounterTips(championKey));

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

function requestCounterTips (championKey) {
  return {
    type: REQUEST_COUNTER_TIPS,
    championKey
  };
}

function receiveCounterTips (data) {
  return {
    type: RECEIVE_COUNTER_TIPS,
    data
  };
}

function invalidateCounterTips () {
  return {
    type: INVALIDATE_COUNTER_TIPS,
  };
}

export const REQUEST_HOME_COUNTER_TIPS = 'REQUEST_HOME_COUNTER_TIPS';
export const RECEIVE_HOME_COUNTER_TIPS = 'RECEIVE_HOME_COUNTER_TIPS';

export function fetchHomeCounterTipsIfNeeded (params) {
  return (dispatch, getState) => {
    if (shouldFetchHomeCounterTips(getState())) {
      const url = `${CS_COUNTER_TIPS_URL}?${qs.stringify(params)}`;

      return dispatch(fetchHomeCounterTips(url));
    }
  };
}

function shouldFetchHomeCounterTips (state) {
  const {
    api: {
      homeCounterTips
    }
  } = state;

  if (homeCounterTips.isFetching)
    return false;

  return true;
}

function fetchHomeCounterTips (url) {
  return dispatch => {
    dispatch(requestHomeCounterTips());

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
      .then(json => dispatch(receiveHomeCounterTips(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestHomeCounterTips () {
  return {
    type: REQUEST_HOME_COUNTER_TIPS,
  };
}

function receiveHomeCounterTips (data) {
  return {
    type: RECEIVE_HOME_COUNTER_TIPS,
    data
  };
}

export const REQUEST_MATCHUP_COUNTER_TIPS = 'REQUEST_MATCHUP_COUNTER_TIPS';
export const RECEIVE_MATCHUP_COUNTER_TIPS = 'RECEIVE_MATCHUP_COUNTER_TIPS';

export function fetchMatchupCounterTipsIfNeeded (championKey, matchupChampionKey, params) {
  return (dispatch, getState) => {
    if (shouldFetchMatchupCounterTips(getState(), championKey, matchupChampionKey)) {
      const url = `${CS_COUNTER_TIPS_URL}?${qs.stringify(params)}`;

      return dispatch(fetchMatchupCounterTips(url));
    }
  };
}

function shouldFetchMatchupCounterTips (state, championKey, matchupChampionKey) {
  const {
    api: {
      matchupCounterTips
    }
  } = state;

  if (matchupCounterTips.isFetching)
    return false;

  return true;
}

function fetchMatchupCounterTips (url, championKey, matchupChampionKey) {
  return dispatch => {
    dispatch(requestMatchupCounterTips(championKey, matchupChampionKey));

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
      .then(json => dispatch(receiveMatchupCounterTips(json)))
      .catch (error => {
        console.log(`Request failed for ${url}: ${error.message}`);
      });
  }
}

function requestMatchupCounterTips (championKey, matchupChampionKey) {
  return {
    type: REQUEST_MATCHUP_COUNTER_TIPS,
    championKey,
    matchupChampionKey
  };
}

function receiveMatchupCounterTips (data) {
  return {
    type: RECEIVE_MATCHUP_COUNTER_TIPS,
    data
  };
}

export const REQUEST_MATCHUPS = 'REQUEST_MATCHUPS';
export const REQUEST_MATCHUPS_SUCCESS = 'REQUEST_MATCHUPS_SUCCESS';
export const REQUEST_MATCHUPS_FAILURE = 'REQUEST_MATCHUPS_FAILURE';
export const RECEIVE_MATCHUP = 'RECEIVE_MATCHUP';

export function fetchMatchupsForChampion (championKey) {
  return dispatch => {
    const params = {
      // 50 is the max limit
      limit: 50,
      orderBy: 'score',
      order: -1,
      page: 1
    };

    return dispatch(fetchMatchupsIfNeeded(championKey, params));
  };
}

export function fetchMatchupsIfNeeded (championKey, params) {
  return (dispatch, getState) => {
    if (shouldFetchMatchups(getState(), championKey))
      return dispatch(fetchMatchups(championKey, params));
  };
}

function shouldFetchMatchups (state, championKey) {
  const {
    api: {
      matchups
    }
  } = state;

  if (matchups.isFetching)
    return false;

  // if (matchups.isFetching || championKey === matchups.championKey)
  //   return false;

  return true;
}

function fetchMatchups (championKey, params) {
  return dispatch => {
    dispatch(requestMatchups(championKey));

    Promise.all(LANES.map(lane => {

      // `/champion/:name/matchups returns matchups from all lanes
      const laneUrlSegment = (lane === 'all') ? '' : `/${lane}`;
      const root = `${CS_CHAMPION_URL}/${championKey}/matchups${laneUrlSegment}`;
      const fullUrl = `${root}?${qs.stringify(params)}`;

      return fetch(fullUrl)
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

            return Promise.reject(error);
          }
        })
        .then(response => response.json())
        .then(matchup => dispatch(receiveMatchup(matchup, championKey, lane)))
    }))
      .then(responses => {
        dispatch(requestMatchupsSuccess(responses));
      })
      .catch(error => {
        console.log(`Response returned an error for fetching matchups for ${championKey}: ${error.message}`);
        dispatch(requestMatchupsFailure(error));
      });
  };
}

function requestMatchups (championKey) {
  return {
    type: REQUEST_MATCHUPS,
    championKey
  };
}

function requestMatchupsSuccess (responses) {
  return {
    type: REQUEST_MATCHUPS_SUCCESS,
    responses
  };
}

function requestMatchupsFailure (error) {
  return {
    type: REQUEST_MATCHUPS_FAILURE,
    error
  };
}

function receiveMatchup (matchup, championKey, lane) {
  return {
    type: RECEIVE_MATCHUP,
    championKey,
    lane,
    matchup
  };
}
