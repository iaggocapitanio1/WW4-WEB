// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';
export const FORGOT_PASSWORD_FAIL = 'FORGOT_PASSWORD_FAIL';
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const USER_MODULES_REQUEST = 'USER_MODULES_REQUEST';
export const USER_MODULES_FAIL = 'USER_MODULESGIN_FAIL';
export const USER_MODULES_SUCCESS = 'USER_MODULES_SUCCESS';

export const CUSTOMER_REQUEST = 'CUSTOMER_REQUEST';
export const CUSTOMER_FAIL = 'CUSTOMER_FAIL';
export const CUSTOMER_SUCCESS = 'CUSTOMER_SUCCESS';

export const USER_PERMISSIONS_REQUEST = 'USER_PERMISSIONS_REQUEST';
export const USER_PERMISSIONS_FAIL = 'USER_PERMISSIONS_FAIL';
export const USER_PERMISSIONS_SUCCESS = 'USER_PERMISSIONS_SUCCESS';
export const USER_PERMISSIONS_SET = 'USER_PERMISSIONS_SET';

export const customer = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: `Bearer ${userToken}` },
      method: 'GET',
      url: getApiURL(endpoints.CUSTOMER + data),
    },
    types: [CUSTOMER_REQUEST, CUSTOMER_SUCCESS, CUSTOMER_FAIL],
  });
};
