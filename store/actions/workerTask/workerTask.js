// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';
import GenerateQueryFilters from '../../../components/utils/GenerateQueryFilters';

export const WORKERTASKS_REQUEST = 'WORKERTASKS_REQUEST';
export const WORKERTASKS_FAIL = 'WORKERTASKS_FAIL';
export const WORKERTASKS_SUCCESS = 'WORKERTASKS_SUCCESS';

export const NEW_WORKERTASK_REQUEST = 'NEW_WORKERTASK_REQUEST';
export const NEW_WORKERTASK_FAIL = 'NEW_WORKERTASK_FAIL';
export const NEW_WORKERTASK_SUCCESS = 'NEW_WORKERTASK_SUCCESS';

export const UPDATE_WORKERTASK_REQUEST = 'UPDATE_WORKERTASK_REQUEST';
export const UPDATE_WORKERTASK_FAIL = 'UPDATE_WORKERTASK_FAIL';
export const UPDATE_WORKERTASK_SUCCESS = 'UPDATE_WORKERTASK_SUCCESS';

export const workerTasks = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.WORKERTASKS),
      params: {
        limit: 400,
        q: data && GenerateQueryFilters(data),
      }
    },
    types: [WORKERTASKS_REQUEST, WORKERTASKS_SUCCESS, WORKERTASKS_FAIL],
  });
};

export const newWorkerTask = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.WORKERTASKS),
    },
    types: [NEW_WORKERTASK_REQUEST, NEW_WORKERTASK_SUCCESS, NEW_WORKERTASK_FAIL],
  });
};

export const updateWorkerTask = (data) => {
  const { auth_token: userToken } = parseCookies();
  const id = data?.id;

  delete data.id;

  return createAction({
    meta: null,
    request: {
      ...data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'PATCH',
      url: getApiURL(endpoints.WORKERTASKS + id),
    },
    types: [UPDATE_WORKERTASK_REQUEST, UPDATE_WORKERTASK_SUCCESS, UPDATE_WORKERTASK_FAIL],
  });
};
