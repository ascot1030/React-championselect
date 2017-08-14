// 1
import browserHistory from '../browserHistory';

const callApiMiddleware = (dispatch, getState) => next => action {
  const {
    types,
    callApi,
    shouldCallApi,
    payload = {},
    redirectTo = null,
    callbackOptions = {}
  } = action;

  if (!types) {
    // Normal action: pass it on
    return next(action);
  }

  if (!Array.isArray(types) || types.length !== 3 || !types.every(type => typeof type === 'string')) {
    throw new Error('Expected an array of three string types.');
  }

  if (typeof callApi !== 'function') {
    throw new Error('Expected callApi to be a function.');
  }

  if (typeof shouldCallApi === 'function' && !shouldCallApi(getState())) {
    return;
  }

  // TODO: should order matter?
  const [requestType, successType, failureType] = types;

  // TODO: separate into function?
  dispatch({
    ...payload,
    type: requestType
  });

  return callApi()
    .then(response => {
      dispatch({
        ...payload,
        response,
        type: successType
      });

      if (typeof redirectTo === 'function') {
        browserHistory.push(redirectTo(response));

      } else if (typeof redirectTo === 'string' && redirectTo.length) {
        browserHistory.push(redirectTo);
      }

      if (typeof callbackOptions.successCallback === 'function') {
        callbackOptions.successCallback(response);
      }
    })
    // TODO: Should I catch here?
    .catch(error => {
      console.log('LOG: error inside of callApiMiddleware', error);

      dispatch({
        ...payload,
        error,
        type: failureType
      });

      if (typeof callbackOptions.errorCallback === 'function') {
        callbackOptions.errorCallback(error);
      }
    })
};

// 2
import 'isomorphic-fetch';

import {
  Schema,
  arrayOf,
  normalize
} from 'normalizr';

// import {
//   camelizeKeys
// } from 'humps';

import {
  CS_API_ROOT
} from '../constants/urls';

// TODO: interface with pagination
const getNextPageUrl = response => {
  const link = response.headers.get('link');

  if (!link) {
    return null;
  }

  const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1);

  if (!nextLink) {
    return null;
  }

  return nextLink.split(';')[0].slice(1, -1);
};

const callApi = (endpoint, schema) => {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API)ROOT + endpoint : endpoint;

  return fetch(fullUrl)
    .then(response =>
      response.json().then(json => ({json, response}))
    ).then({json, response}) => {
      if (!response.ok) {
        return Promise.reject(json);
      }

      const camelizedJson = camelizeKeys(json);
      const nextPageUrl = getNextPageUrl(response);

      return {
        normalize(camelizedJson, schema),
        nextPageUrl
      };
    };
};

const userSchema = new Schema('users', {
  idAttribute: user => user.login.toLowerCase()
});

const repoSchema = new Schema('repos', {
  idAttribute: repo => repo.fullName.toLowerCase()
});

repoSchema.define({
  owner: userSchema
});

// Schemas for Github API responses
export const Schemas = {
  USER: userSchema,
  USER_ARRAY: arrayOf(userSchema),
  REPO: repoSchema,
  REPO_ARRAY: arrayOf(repoSchema)
};

// Symbol to mark actions as API calls.
export const CALL_API = Symbol('Call API');

export default store => next => action => {
  const callApi = action[CALL_API];

  if (typeof callApi === 'undefined') {
    return next(action);
  }

  let {
    endpoint
  } = callApi;

  const {
    schema,
    types
  } = callApi;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }

  if (!schema) {
    throw new Error('Specify one of the exported schemas.');
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }

  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const actionWith = data => {
    const finalAction = {
      ...action,
      data
    };

    // for cleanup
    delete finalAction[CALL_API];
    return finalAction;
  }

  const [
    requestType,
    successType,
    failureType
  ] = types;

  next(actionWith({
    type: requestType
  }));

  return callApi(endpoint, schema).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'An error occurred.'
    }));
  );
}

export default callApiMiddleware;
