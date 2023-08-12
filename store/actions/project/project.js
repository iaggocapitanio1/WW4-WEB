// Network
import { parseCookies } from 'nookies';
import GenerateQueryFilters from '../../../components/utils/GenerateQueryFilters';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const PROJECTS_REQUEST = 'PROJECTS_REQUEST';
export const PROJECTS_FAIL = 'PROJECTS_FAIL';
export const PROJECTS_SUCCESS = 'PROJECTS_SUCCESS';

export const PROJECT_REQUEST = 'PROJECT_REQUEST';
export const PROJECT_FAIL = 'PROJECT_FAIL';
export const PROJECT_SUCCESS = 'PROJECT_SUCCESS';

export const NEW_PROJECT_REQUEST = 'NEW_PROJECT_REQUEST';
export const NEW_PROJECT_FAIL = 'NEW_PROJECT_FAIL';
export const NEW_PROJECT_SUCCESS = 'NEW_PROJECT_SUCCESS';

export const UPDATE_PROJECT_REQUEST = 'UPDATE_PROJECT_REQUEST';
export const UPDATE_PROJECT_SUCCESS = 'UPDATE_PROJECT_SUCCESS';
export const UPDATE_PROJECT_FAIL = 'UPDATE_PROJECT_FAIL';

export const DELETE_PROJECT_REQUEST = 'DELETE_PROJECT_REQUEST';
export const DELETE_PROJECT_SUCCESS = 'DELETE_PROJECT_SUCCESS';
export const DELETE_PROJECT_FAIL = 'DELETE_PROJECT_FAIL';

export const PROD_PROJECTS_REQUEST = 'PROD_PROJECTS_REQUEST';
export const PROD_PROJECTS_FAIL = 'PROD_PROJECTS_FAIL';
export const PROD_PROJECTS_SUCCESS = 'PROD_PROJECTS_SUCCESS';

export const ACTIVE_PROJECTS_REQUEST = 'ACTIVE_PROJECTS_REQUEST';
export const ACTIVE_PROJECTS_FAIL = 'ACTIVE_PROJECTS_FAIL';
export const ACTIVE_PROJECTS_SUCCESS = 'ACTIVE_PROJECTS_SUCCESS';

export const DISPLAYED_PROJECT_SET = 'DISPLAYED_PROJECT_SET';

export const projects = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.PROJECTS),
      params: {
        options: 'sysAttrs',
        q: data && GenerateQueryFilters(data),

      }
    },
    types: [PROJECTS_REQUEST, PROJECTS_SUCCESS, PROJECTS_FAIL],
  });
};

export const project = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.PROJECTS + data),
      params: {
        options: 'sysAttrs',
      }
    },
    types: [PROJECT_REQUEST, PROJECT_SUCCESS, PROJECT_FAIL],
  });
};

export const projectsInProduction = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.PROJECTS),
      params: {
        options: 'sysAttrs',
        q: 'status=="production"'
      }
    },
    types: [PROD_PROJECTS_REQUEST, PROD_PROJECTS_SUCCESS, PROD_PROJECTS_FAIL],
  });
};

export const myProjects = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.PROJECTS),
      params: {
        options: 'sysAttrs',
      }
    },
    types: [PROJECTS_REQUEST, PROJECTS_SUCCESS, PROJECTS_FAIL],
  });
};

export const finalizedProjects = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.PROJECTS),
      params: {
        options: 'sysAttrs',
        q: 'status=="finished"'
      }
    },
    types: [PROJECTS_REQUEST, PROJECTS_SUCCESS, PROJECTS_FAIL],
  });
};

export const activeProjects = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.PROJECTS),
      params: {
        options: 'sysAttrs',
        q: 'status!="finished"'
      }
    },
    types: [ACTIVE_PROJECTS_REQUEST, ACTIVE_PROJECTS_SUCCESS, ACTIVE_PROJECTS_FAIL],
  });
};

export const setDisplayedProject = (data) => {
  return {
    type: DISPLAYED_PROJECT_SET,
    data,
  };
};

export const newProject = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.PROJECTS),
    },
    types: [NEW_PROJECT_REQUEST, NEW_PROJECT_SUCCESS, NEW_PROJECT_FAIL],
  });
};

export const updateProject = (data) => {
  const { auth_token: userToken } = parseCookies();
  const id = data?.id;

  delete data.id;

  return createAction({
    meta: null,
    request: {
      ...data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'PATCH',
      url: getApiURL(endpoints.PROJECTS + id),
    },
    types: [UPDATE_PROJECT_REQUEST, UPDATE_PROJECT_SUCCESS, UPDATE_PROJECT_FAIL],
  });
};

export const deleteProject = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'DELETE',
      url: getApiURL(endpoints.PROJECTS + data),
    },
    types: [DELETE_PROJECT_REQUEST, DELETE_PROJECT_SUCCESS, DELETE_PROJECT_FAIL],
  });
};
