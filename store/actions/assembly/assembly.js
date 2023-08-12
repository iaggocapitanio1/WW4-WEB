// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const ASSEMBLYS_REQUEST = 'ASSEMBLYS_REQUEST';
export const ASSEMBLYS_FAIL = 'ASSEMBLYS_FAIL';
export const ASSEMBLYS_SUCCESS = 'ASSEMBLYS_SUCCESS';
export const NEW_ASSEMBLY_REQUEST = 'NEW_ASSEMBLY_REQUEST';
export const NEW_ASSEMBLY_FAIL = 'NEW_ASSEMBLY_FAIL';
export const NEW_ASSEMBLY_SUCCESS = 'NEW_ASSEMBLY_SUCCESS';
export const UPDATE_ASSEMBLY_REQUEST = 'UPDATE_ASSEMBLY_REQUEST';
export const UPDATE_ASSEMBLY_SUCCESS = 'UPDATE_ASSEMBLY_SUCCESS';
export const UPDATE_ASSEMBLY_FAIL = 'UPDATE_ASSEMBLY_FAIL';

export const assemblys = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.ASSEMBLYS),
      params: {
        limit: 200,
        options: 'sysAttrs',
      }
    },
    types: [ASSEMBLYS_REQUEST, ASSEMBLYS_SUCCESS, ASSEMBLYS_FAIL],
  });
};

export const assembly = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.ASSEMBLYS + data),
    },
    types: [ASSEMBLYS_REQUEST, ASSEMBLYS_SUCCESS, ASSEMBLYS_FAIL],
  });
};

export const newAssembly = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.ASSEMBLYS),
    },
    types: [NEW_ASSEMBLY_REQUEST, NEW_ASSEMBLY_SUCCESS, NEW_ASSEMBLY_FAIL],
  });
};

export const updateAssembly = (data) => {
  const { auth_token: userToken } = parseCookies();
  const id = data?.id;

  delete data.id;

  return createAction({
    meta: null,
    request: {
      ...data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'PATCH',
      url: getApiURL(endpoints.ASSEMBLYS + id),
    },
    types: [UPDATE_ASSEMBLY_REQUEST, UPDATE_ASSEMBLY_SUCCESS, UPDATE_ASSEMBLY_FAIL],
  });
};
