import fetch from 'isomorphic-fetch';

/**
 * Make an async call to an API endpoint. Dispatch actions for every request
 * state and return API data if a request is successful.
 *
 * @param endpoint - full url of api endpoint
 * @param types    - object of action types {request, success, failure, receive}
 *                   for every request state
 * @param data     - data (whether it exists or not) in the state tree
 */
export function callApiIfNeeded (endpoint, types, data) {
  return dispatch => {
    if (shouldCallApi(data)) {
      return dispatch(callApi(endpoint, types));
    }
  };
}

// TODO: cleanup logic
function shouldCallApi (data) {
  return true;
}

// TODO: cleanup error handling
export function callApi (endpoint, types) {
  return dispatch => {
    dispatch(requestApi(types));

    return fetch(endpoint)

      // Indicate the appropriate request status.
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          dispatch(requestApiSuccess(response, types));
          return response;
        } else {
          const error = new Error(response.statusText);
          console.log(`Response returned an error for ${endpoint}: ${error.message}`);
          dispatch(requestApiFailure(error, types));
          return Promise.reject(error);
        }
      })
      .then(response => response.json())

      // Indicate the data has been received, and process it.
      .then(json => {
        dispatch(receiveData(json, types))
      })

      .catch(error => {
        console.log(`Request failed for ${endpoint}: ${error.message}`);
        dispatch(requestApiFailure(error, types));
      });
  };
}

// Indicate a request to the API endpoint has been sent.
function requestApi ({request}) {
  return {
    type: request
  };
}

function requestApiSuccess (response, {success}) {
  return {
    type: success,
    response
  };
}

function requestApiFailure (error, {failure}) {
  return {
    type: failure,
    error
  };
}

// Receive the data from a successful API call.
function receiveData (data, {receive}) {
  return {
    type: receive,
    data
  };
}
