// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const FILES_REQUEST = 'FILES_REQUEST';
export const FILES_FAIL = 'FILES_FAIL';
export const FILES_SUCCESS = 'FILES_SUCCESS';

export const FILE_REQUEST = 'FILE_REQUEST';
export const FILE_FAIL = 'FILE_FAIL';
export const FILE_SUCCESS = 'FILE_SUCCESS';

export const DOWNLOAD_FILE_REQUEST = 'DOWNLOAD_FILE_REQUEST';
export const DOWNLOAD_FILE_FAIL = 'DOWNLOAD_FILE_FAIL';
export const DOWNLOAD_FILE_SUCCESS = 'DOWNLOAD_FILE_SUCCESS';

export const NEW_FILE_REQUEST = 'NEW_FILE_REQUEST';
export const NEW_FILE_FAIL = 'NEW_FILE_FAIL';
export const NEW_FILE_SUCCESS = 'NEW_FILE_SUCCESS';

export const DELETE_FILE_REQUEST = 'DELETE_FILE_REQUEST';
export const DELETE_FILE_FAIL = 'DELETE_FILE_FAIL';
export const DELETE_FILE_SUCCESS = 'DELETE_FILE_SUCCESS';

export const UPDATE_FILE_REQUEST = 'UPDATE_FILE_REQUEST';
export const UPDATE_FILE_FAIL = 'UPDATE_FILE_FAIL';
export const UPDATE_FILE_SUCCESS = 'UPDATE_FILE_SUCCESS';

export const files = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.FILES),
      params: {
        options: 'sysAttrs',
        limit: 600
      }
    },
    types: [FILES_REQUEST, FILES_SUCCESS, FILES_FAIL],
  });
};

export const downloadFile = (data) => {
  return createAction({
    meta: null,
    request: {
      method: 'GET',
      url: data,
    },
    types: [FILES_REQUEST, FILES_SUCCESS, FILES_FAIL],
  });
};

export const file = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.FILES + data),
      params: {
        options: 'sysAttrs',
      }
    },
    types: [FILE_REQUEST, FILE_SUCCESS, FILE_FAIL],
  });
};

export const newFile = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.FILES),
    },
    types: [NEW_FILE_REQUEST, NEW_FILE_SUCCESS, NEW_FILE_FAIL],
  });
};

export const batchFiles = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.FILESBATCH),
    },
    types: [NEW_FILE_REQUEST, NEW_FILE_SUCCESS, NEW_FILE_FAIL],
  });
};

export const budgetFiles = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.FILES),
      params: {
        options: 'sysAttrs',
        limit: 600
      }
    },
    types: [FILES_REQUEST, FILES_SUCCESS, FILES_FAIL],
  });
};

export const deleteFile = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/x-www-form-urlencoded', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'DELETE',
      url: getApiURL(endpoints.FILES + data),
    },
    types: [DELETE_FILE_REQUEST, DELETE_FILE_SUCCESS, DELETE_FILE_FAIL],
  });
};
