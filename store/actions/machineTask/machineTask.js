// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const MACHINETASKS_REQUEST = 'MACHINETASKS_REQUEST';
export const MACHINETASKS_FAIL = 'MACHINETASKS_FAIL';
export const MACHINETASKS_SUCCESS = 'MACHINETASKS_SUCCESS';
export const NEW_MACHINETASK_REQUEST = 'NEW_MACHINETASK_REQUEST';
export const NEW_MACHINETASK_FAIL = 'NEW_MACHINETASK_FAIL';
export const NEW_MACHINETASK_SUCCESS = 'NEW_MACHINETASK_SUCCESS';

export const machineTasks = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.MACHINETASKS),

    },
    types: [MACHINETASKS_REQUEST, MACHINETASKS_SUCCESS, MACHINETASKS_FAIL],
  });
};

export const newMachineTask = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.MACHINETASKS),
    },
    types: [NEW_MACHINETASK_REQUEST, NEW_MACHINETASK_SUCCESS, NEW_MACHINETASK_FAIL],
  });
};
