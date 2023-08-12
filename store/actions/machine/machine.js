// Network
import { parseCookies } from 'nookies';
import GenerateQueryFilters from '../../../components/utils/GenerateQueryFilters';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const MACHINES_REQUEST = 'MACHINES_REQUEST';
export const MACHINES_FAIL = 'MACHINES_FAIL';
export const MACHINES_SUCCESS = 'MACHINES_SUCCESS';

export const DELETE_MACHINE_REQUEST = 'DELETE_MACHINE_REQUEST';
export const DELETE_MACHINE_FAIL = 'DELETE_MACHINE_FAIL';
export const DELETE_MACHINE_SUCCESS = 'DELETE_MACHINE_SUCCESS';

export const NEW_MACHINE_REQUEST = 'NEW_MACHINE_REQUEST';
export const NEW_MACHINE_FAIL = 'NEW_MACHINE_FAIL';
export const NEW_MACHINE_SUCCESS = 'NEW_MACHINE_SUCCESS';

export const UPDATE_MACHINE_REQUEST = 'UPDATE_MACHINE_REQUEST';
export const UPDATE_MACHINE_FAIL = 'UPDATE_MACHINE_FAIL';
export const UPDATE_MACHINE_SUCCESS = 'UPDATE_MACHINE_SUCCESS';

export const machines = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.MACHINES),
      params: {
        limit: 600,
        q: data && GenerateQueryFilters(data),
      }
    },
    types: [MACHINES_REQUEST, MACHINES_SUCCESS, MACHINES_FAIL],
  });
};

export const machine = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.MACHINES + data),
    },
    types: [MACHINES_REQUEST, MACHINES_SUCCESS, MACHINES_FAIL],
  });
};

export const newMachine = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.MACHINES),
    },
    types: [NEW_MACHINE_REQUEST, NEW_MACHINE_SUCCESS, NEW_MACHINE_FAIL],
  });
};

export const updateMachine = (data) => {
  const { auth_token: userToken } = parseCookies();
  const id = data?.id;

  delete data.id;

  return createAction({
    meta: null,
    request: {
      ...data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'PATCH',
      url: getApiURL(endpoints.MACHINES + id),
      params: {
        options: 'replace'
      }
    },
    types: [UPDATE_MACHINE_REQUEST, UPDATE_MACHINE_SUCCESS, UPDATE_MACHINE_FAIL],
  });
};

export const deleteMachine = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'DELETE',
      url: getApiURL(endpoints.MACHINES + data),
    },
    types: [DELETE_MACHINE_REQUEST, DELETE_MACHINE_SUCCESS, DELETE_MACHINE_FAIL],
  });
};
