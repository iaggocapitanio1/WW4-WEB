// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const PACKAGES_REQUEST = 'PACKAGES_REQUEST';
export const PACKAGES_FAIL = 'PACKAGES_FAIL';
export const PACKAGES_SUCCESS = 'PACKAGES_SUCCESS';
export const NEW_PACKAGE_REQUEST = 'NEW_PACKAGE_REQUEST';
export const NEW_PACKAGE_FAIL = 'NEW_PACKAGE_FAIL';
export const NEW_PACKAGE_SUCCESS = 'NEW_PACKAGE_SUCCESS';
export const UPDATE_PACKAGE_REQUEST = 'UPDATE_PACKAGE_REQUEST';
export const UPDATE_PACKAGE_FAIL = 'UPDATE_PACKAGE_FAIL';
export const UPDATE_PACKAGE_SUCCESS = 'UPDATE_PACKAGE_SUCCESS';

export const packages = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.PACKAGES),
      params: {
        limit: 400
      }
    },
    types: [PACKAGES_REQUEST, PACKAGES_SUCCESS, PACKAGES_FAIL],
  });
};

export const projectPackages = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.PACKAGES),
      params: {
        q: `belongsTo=="${data}"`,
      }
    },
    types: [PACKAGES_REQUEST, PACKAGES_SUCCESS, PACKAGES_FAIL],
  });
};

export const newPackage = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.PACKAGES),
    },
    types: [NEW_PACKAGE_REQUEST, NEW_PACKAGE_SUCCESS, NEW_PACKAGE_FAIL],
  });
};

export const updatePackage = (data) => {
  const { auth_token: userToken } = parseCookies();
  const id = data?.id;

  delete data.id;

  return createAction({
    meta: null,
    request: {
      ...data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'PATCH',
      url: getApiURL(endpoints.PACKAGES + id),
    },
    types: [UPDATE_PACKAGE_REQUEST, UPDATE_PACKAGE_SUCCESS, UPDATE_PACKAGE_FAIL],
  });
};
