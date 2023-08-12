// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const FOLDERS_REQUEST = 'FOLDERS_REQUEST';
export const FOLDERS_FAIL = 'FOLDERS_FAIL';
export const FOLDERS_SUCCESS = 'FOLDERS_SUCCESS';

export const NEW_FOLDER_REQUEST = 'NEW_FOLDER_REQUEST';
export const NEW_FOLDER_FAIL = 'NEW_FOLDER_FAIL';
export const NEW_FOLDER_SUCCESS = 'NEW_FOLDER_SUCCESS';

export const UPDATE_FOLDER_REQUEST = 'UPDATE_FOLDER_REQUEST';
export const UPDATE_FOLDER_FAIL = 'UPDATE_FOLDER_FAIL';
export const UPDATE_FOLDER_SUCCESS = 'UPDATE_FOLDER_SUCCESS';

export const DISPLAYED_FOLDER_SET = 'DISPLAYED_FOLDER_SET';

export const folders = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.FOLDERS),
      params: {
        options: 'sysAttrs',
        limit: 200,
        ...data
      }
    },
    types: [FOLDERS_REQUEST, FOLDERS_SUCCESS, FOLDERS_FAIL],
  });
};

export const newFolder = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.FOLDERS),
    },
    types: [NEW_FOLDER_REQUEST, NEW_FOLDER_SUCCESS, NEW_FOLDER_FAIL],
  });
};

export const folder = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.FOLDERS),
      params: {
        options: 'sysAttrs',
      }
    },
    types: [FOLDERS_REQUEST, FOLDERS_SUCCESS, FOLDERS_FAIL],
  });
};

export const budgetFolders = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.FOLDERS),
      params: {
        options: 'sysAttrs',
        limit: 600,
        budget: data
      }
    },
    types: [FOLDERS_REQUEST, FOLDERS_SUCCESS, FOLDERS_FAIL],
  });
};
