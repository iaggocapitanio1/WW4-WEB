// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const MESSAGES_REQUEST = 'MESSAGES_REQUEST';
export const MESSAGES_FAIL = 'MESSAGES_FAIL';
export const MESSAGES_SUCCESS = 'MESSAGES_SUCCESS';
export const NEW_MESSAGE_REQUEST = 'NEW_MESSAGE_REQUEST';
export const NEW_MESSAGE_FAIL = 'NEW_MESSAGE_FAIL';
export const NEW_MESSAGE_SUCCESS = 'NEW_MESSAGE_SUCCESS';

export const messages = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.MESSAGES),

    },
    types: [MESSAGES_REQUEST, MESSAGES_SUCCESS, MESSAGES_FAIL],
  });
};

export const conversationMessages = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.MESSAGES),
      params: {
        project: data
      }
    },
    types: [MESSAGES_REQUEST, MESSAGES_SUCCESS, MESSAGES_FAIL],
  });
};

export const newMessage = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.MESSAGES),
    },
    types: [NEW_MESSAGE_REQUEST, NEW_MESSAGE_SUCCESS, NEW_MESSAGE_FAIL],
  });
};
