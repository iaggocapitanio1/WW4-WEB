// Network
import { destroyCookie, parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';
export const FORGOT_PASSWORD_FAIL = 'FORGOT_PASSWORD_FAIL';
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const ACTIVATION_REQUEST = 'ACTIVATION_REQUEST';
export const ACTIVATION_FAIL = 'ACTIVATION_FAIL';
export const ACTIVATION_SUCCESS = 'ACTIVATION_SUCCESS';

export const USER_MODULES_REQUEST = 'USER_MODULES_REQUEST';
export const USER_MODULES_FAIL = 'USER_MODULESGIN_FAIL';
export const USER_MODULES_SUCCESS = 'USER_MODULES_SUCCESS';

export const LOGOUT = 'LOGOUT';

export const ME_REQUEST = 'ME_REQUEST';
export const ME_FAIL = 'ME_FAIL';
export const ME_SUCCESS = 'ME_SUCCESS';

export const USER_PERMISSIONS_REQUEST = 'USER_PERMISSIONS_REQUEST';
export const USER_PERMISSIONS_FAIL = 'USER_PERMISSIONS_FAIL';
export const USER_PERMISSIONS_SUCCESS = 'USER_PERMISSIONS_SUCCESS';
export const USER_PERMISSIONS_SET = 'USER_PERMISSIONS_SET';

export const login = (data) => {
  return createAction({
    meta: null,
    request: {
      data: {
        ...data,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        scope: 'read',
        grant_type: 'password'
      },
      headers: {},
      method: 'POST',
      url: getApiURL(endpoints.LOGIN),
    },
    types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL],
  });
};

export const logout = (data) => {
  destroyCookie(null, 'auth_token');
  localStorage.removeItem('userToken');

  return {
    type: LOGOUT,
    data,
  };
};

export const me = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: (userToken || data) ? `Bearer ${userToken || data}` : '' },
      method: 'GET',
      url: getApiURL(window.location.pathname.includes('/internal/') || window.location.pathname.includes('/signin') ? endpoints.ME : endpoints.MECLIENT),
    },
    types: [ME_REQUEST, ME_SUCCESS, ME_FAIL],
  });
};

export const userPermissionsSet = (data) => {
  return {
    type: USER_PERMISSIONS_SET,
    data,
  };
};

export const userPermissions = (id, token) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: `Bearer ${userToken || token}` },
      method: 'GET',
      url: getApiURL(endpoints.PERMISSIONS + id),
    },
    types: [USER_PERMISSIONS_REQUEST, USER_PERMISSIONS_SUCCESS, USER_PERMISSIONS_FAIL],
  });
};

export const activateUser = (data) => {
  return createAction({
    meta: null,
    request: {
      headers: {},
      method: 'GET',
      url: getApiURL(endpoints.ACTIVATE + data + '.'),
    },
    types: [ACTIVATION_REQUEST, ACTIVATION_SUCCESS, ACTIVATION_FAIL],
  });
};
