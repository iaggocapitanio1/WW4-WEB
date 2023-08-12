// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';
import GenerateQueryFilters from '../../../components/utils/GenerateQueryFilters';

export const MODULES_REQUEST = 'MODULES_REQUEST';
export const MODULES_FAIL = 'MODULES_FAIL';
export const MODULES_SUCCESS = 'MODULES_SUCCESS';
export const NEW_MODULE_REQUEST = 'NEW_MODULE_REQUEST';
export const NEW_MODULE_FAIL = 'NEW_MODULE_FAIL';
export const NEW_MODULE_SUCCESS = 'NEW_MODULE_SUCCESS';
export const UPDATE_MODULE_REQUEST = 'UPDATE_MODULE_REQUEST';
export const UPDATE_MODULE_FAIL = 'UPDATE_MODULE_FAIL';
export const UPDATE_MODULE_SUCCESS = 'UPDATE_MODULE_SUCCESS';

export const modules = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.MODULES),
      params: {
        limit: 400,
        q: data && GenerateQueryFilters(data),

      }
    },
    types: [MODULES_REQUEST, MODULES_SUCCESS, MODULES_FAIL],
  });
};

export const projectModules = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.MODULES),
      params: {
        q: `belongsTo=="${data}"`,
      }
    },
    types: [MODULES_REQUEST, MODULES_SUCCESS, MODULES_FAIL],
  });
};

export const newModule = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.MODULES),
    },
    types: [NEW_MODULE_REQUEST, NEW_MODULE_SUCCESS, NEW_MODULE_FAIL],
  });
};

export const updateModule = (data) => {
  const { auth_token: userToken } = parseCookies();
  const id = data?.id;

  delete data.id;

  return createAction({
    meta: null,
    request: {
      ...data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'PATCH',
      url: getApiURL(endpoints.MODULES + id),
    },
    types: [UPDATE_MODULE_REQUEST, UPDATE_MODULE_SUCCESS, UPDATE_MODULE_FAIL],
  });
};
