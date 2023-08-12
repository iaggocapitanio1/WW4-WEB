// Network
import { parseCookies } from 'nookies';
import GenerateQueryFilters from '../../../components/utils/GenerateQueryFilters';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const FURNITURES_REQUEST = 'FURNITURES_REQUEST';
export const FURNITURES_FAIL = 'FURNITURES_FAIL';
export const FURNITURES_SUCCESS = 'FURNITURES_SUCCESS';

export const FURNITURE_REQUEST = 'FURNITURE_REQUEST';
export const FURNITURE_FAIL = 'FURNITURE_FAIL';
export const FURNITURE_SUCCESS = 'FURNITURE_SUCCESS';

export const NEW_FURNITURE_REQUEST = 'NEW_FURNITURE_REQUEST';
export const NEW_FURNITURE_FAIL = 'NEW_FURNITURE_FAIL';
export const NEW_FURNITURE_SUCCESS = 'NEW_FURNITURE_SUCCESS';

export const UPDATE_FURNITURE_REQUEST = 'UPDATE_FURNITURE_REQUEST';
export const UPDATE_FURNITURE_FAIL = 'UPDATE_FURNITURE_FAIL';
export const UPDATE_FURNITURE_SUCCESS = 'UPDATE_FURNITURE_SUCCESS';

export const DELETE_FURNITURE_REQUEST = 'DELETE_FURNITURE_REQUEST';
export const DELETE_FURNITURE_FAIL = 'DELETE_FURNITURE_FAIL';
export const DELETE_FURNITURE_SUCCESS = 'DELETE_FURNITURE_SUCCESS';

export const furnitures = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.FURNITURES),
      params: {
        limit: 600,
        q: data && GenerateQueryFilters(data),
      }
    },
    types: [FURNITURES_REQUEST, FURNITURES_SUCCESS, FURNITURES_FAIL],
  });
};

export const furniture = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.FURNITURES + data),
    },
    types: [FURNITURE_REQUEST, FURNITURE_SUCCESS, FURNITURE_FAIL],
  });
};

export const newFurniture = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.FURNITURES),
    },
    types: [NEW_FURNITURE_REQUEST, NEW_FURNITURE_SUCCESS, NEW_FURNITURE_FAIL],
  });
};

export const updateFurniture = (data) => {
  const { auth_token: userToken } = parseCookies();
  const id = data?.id;

  delete data.id;

  return createAction({
    meta: null,
    request: {
      ...data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'PATCH',
      url: getApiURL(endpoints.FURNITURES + id),
    },
    types: [UPDATE_FURNITURE_REQUEST, UPDATE_FURNITURE_SUCCESS, UPDATE_FURNITURE_FAIL],
  });
};

export const deleteFurniture = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'DELETE',
      url: getApiURL(endpoints.FURNITURES + data),
    },
    types: [DELETE_FURNITURE_REQUEST, DELETE_FURNITURE_SUCCESS, DELETE_FURNITURE_FAIL],
  });
};
