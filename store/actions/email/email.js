// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const EMAIL_REQUEST = 'EMAIL_REQUEST';
export const EMAIL_FAIL = 'EMAIL_FAIL';
export const EMAIL_SUCCESS = 'EMAIL_SUCCESS';

export const UPDATE_PASSWORD_REQUEST = 'EMAIL_REQUEST';
export const UPDATE_PASSWORD_FAIL = 'EMAIL_FAIL';
export const UPDATE_PASSWORD_SUCCESS = 'EMAIL_SUCCESS';

export const resetPassword = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.RESETPASSWORD1),
    },
    types: [EMAIL_REQUEST, EMAIL_SUCCESS, EMAIL_FAIL],
  });
};

export const updatePassword = (data) => {
  const { auth_token: userToken } = parseCookies();
  const id = data?.id;

  delete data.id;

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.RESETPASSWORD + id + '.'),
    },
    types: [UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAIL],
  });
};

export const budgetAdjudicated = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.EMAILSERVICE),
    },
    types: [EMAIL_REQUEST, EMAIL_SUCCESS, EMAIL_FAIL],
  });
};

export const resetSuccess = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.EMAILSERVICE),
    },
    types: [EMAIL_REQUEST, EMAIL_SUCCESS, EMAIL_FAIL],
  });
};
