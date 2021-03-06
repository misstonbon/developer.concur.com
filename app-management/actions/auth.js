import 'es6-promise';
import fetch from 'isomorphic-fetch';
import { hashHistory } from 'react-router';
import { reset } from 'redux-form';
import auth from '../utils/auth';
import { authHelpers } from '../utils/actionHelpers';

export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

export function loginRequest() {
  return { type: AUTH_LOGIN_REQUEST };
}

export function loginFailure(message) {
  return {
    type: AUTH_LOGIN_FAILURE,
    message,
  };
}

export function loginSuccess(token) {
  auth.setToken(token);
  return {
    type: AUTH_LOGIN_SUCCESS,
    token,
  };
}

export function logout() {
  auth.removeToken();
  return { type: AUTH_LOGOUT };
}

export function login(user) {
  return (dispatch) => {
    dispatch(loginRequest());

    const options = {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return fetch(`${process.env.DEVCENTER_API_FORMS}/auth/login`, options)
      .then(authHelpers.isAuthorized)
      .then(authHelpers.isSuccessful)
      .then(response => response.json())
      .then(authHelpers.hasValidToken)
      .then((data) => {
        dispatch(loginSuccess(data.access_token));
        dispatch(reset('login'));
        hashHistory.push('/');
      })
      .catch(err => dispatch(loginFailure(err.message)));
  };
}
