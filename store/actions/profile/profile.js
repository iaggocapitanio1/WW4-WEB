// Network
import { parseCookies } from 'nookies';
import GenerateQueryFilters from '../../../components/utils/GenerateQueryFilters';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const PROFILES_REQUEST = 'PROFILES_REQUEST';
export const PROFILES_FAIL = 'PROFILES_FAIL';
export const PROFILES_SUCCESS = 'PROFILES_SUCCESS';

export const UPDATE_PROFILES_REQUEST = 'UPDATE_PROFILES_REQUEST';
export const UPDATE_PROFILES_FAIL = 'UPDATE_PROFILES_FAIL';
export const UPDATE_PROFILES_SUCCESS = 'UPDATE_PROFILES_SUCCESS';

export const DELETE_PROFILE_REQUEST = 'DELETE_PROFILE_REQUEST';
export const DELETE_PROFILE_FAIL = 'DELETE_PROFILE_FAIL';
export const DELETE_PROFILE_SUCCESS = 'DELETE_PROFILE_SUCCESS';

export const NEW_PROFILE_REQUEST = 'NEW_PROFILE_REQUEST';
export const NEW_PROFILE_FAIL = 'NEW_PROFILE_FAIL';
export const NEW_PROFILE_SUCCESS = 'NEW_PROFILE_SUCCESS';

export const RESOURCES_REQUEST = 'RESOURCES_REQUEST';
export const RESOURCES_FAIL = 'RESOURCES_FAIL';
export const RESOURCES_SUCCESS = 'RESOURCES_SUCCESS';

export const profiles = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.PROFILESLIST),
      params: {
        q: data && GenerateQueryFilters(data),
        limit: 200
      }
    },
    types: [PROFILES_REQUEST, PROFILES_SUCCESS, PROFILES_FAIL],
  });
};

export const profile = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.PROFILES + data),
    },
    types: [PROFILES_REQUEST, PROFILES_SUCCESS, PROFILES_FAIL],
  });
};

export const resources = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.RESOURCES + 'no_pagination/'),
    },
    types: [RESOURCES_REQUEST, RESOURCES_SUCCESS, RESOURCES_FAIL],
  });
};

export const newProfile = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/x-www-form-urlencoded', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.PROFILES),
    },
    types: [NEW_PROFILE_REQUEST, NEW_PROFILE_SUCCESS, NEW_PROFILE_FAIL],
  });
};

export const newResource = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      ...data,
      headers: { 'content-type': 'application/x-www-form-urlencoded', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.RESOURCES),
    },
    types: [NEW_PROFILE_REQUEST, NEW_PROFILE_SUCCESS, NEW_PROFILE_FAIL],
  });
};

export const updateProfile = (data) => {
  const { auth_token: userToken } = parseCookies();
  const id = data?.id;

  delete data.id;

  return createAction({
    meta: null,
    request: {
      ...data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'PUT',
      url: getApiURL(endpoints.PROFILES + id),
    },
    types: [UPDATE_PROFILES_REQUEST, UPDATE_PROFILES_SUCCESS, UPDATE_PROFILES_FAIL],
  });
};

export const updateResource = (data) => {
  const { auth_token: userToken } = parseCookies();
  const id = data?.id;

  delete data.id;

  return createAction({
    meta: null,
    request: {
      ...data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'PUT',
      url: getApiURL(endpoints.RESOURCES + id),
    },
    types: [UPDATE_PROFILES_REQUEST, UPDATE_PROFILES_SUCCESS, UPDATE_PROFILES_FAIL],
  });
};

export const deleteProfile = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/x-www-form-urlencoded', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'DELETE',
      url: getApiURL(endpoints.PROFILES + data),
    },
    types: [DELETE_PROFILE_REQUEST, DELETE_PROFILE_SUCCESS, DELETE_PROFILE_FAIL],
  });
};

export const deleteResource = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/x-www-form-urlencoded', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'DELETE',
      url: getApiURL(endpoints.RESOURCES + data),
    },
    types: [DELETE_PROFILE_REQUEST, DELETE_PROFILE_SUCCESS, DELETE_PROFILE_FAIL],
  });
};
