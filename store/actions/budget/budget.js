// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const BUDGETS_REQUEST = 'BUDGETS_REQUEST';
export const BUDGETS_FAIL = 'BUDGETS_FAIL';
export const BUDGETS_SUCCESS = 'BUDGETS_SUCCESS';

export const BUDGET_REQUEST = 'BUDGET_REQUEST';
export const BUDGET_FAIL = 'BUDGET_FAIL';
export const BUDGET_SUCCESS = 'BUDGET_SUCCESS';

export const NEW_BUDGET_REQUEST = 'NEW_BUDGET_REQUEST';
export const NEW_BUDGET_FAIL = 'NEW_BUDGET_FAIL';
export const NEW_BUDGET_SUCCESS = 'NEW_BUDGET_SUCCESS';

export const UPDATE_BUDGET_REQUEST = 'UPDATE_BUDGET_REQUEST';
export const UPDATE_BUDGET_FAIL = 'UPDATE_BUDGET_FAIL';
export const UPDATE_BUDGET_SUCCESS = 'UPDATE_BUDGET_SUCCESS';

export const DELETE_BUDGET_REQUEST = 'DELETE_BUDGET_REQUEST';
export const DELETE_BUDGET_FAIL = 'DELETE_BUDGET_FAIL';
export const DELETE_BUDGET_SUCCESS = 'DELETE_BUDGET_SUCCESS';

export const DISPLAYED_BUDGET_SET = 'DISPLAYED_BUDGET_SET';

export const activebudgets = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.BUDGETS),
      params: {
        options: 'sysAttrs',
        q: 'status!="adjudicated"',
        limit: 200
      }
    },
    types: [BUDGETS_REQUEST, BUDGETS_SUCCESS, BUDGETS_FAIL],
  });
};

export const myBudgets = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.BUDGETS),
      params: {
        options: 'sysAttrs',
        q: 'status!="adjudicated"',
        limit: 200
      }
    },
    types: [BUDGETS_REQUEST, BUDGETS_SUCCESS, BUDGETS_FAIL],
  });
};

export const budgets = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.BUDGETS),
      params: {
        options: 'sysAttrs',
        limit: 200

      }
    },
    types: [BUDGETS_REQUEST, BUDGETS_SUCCESS, BUDGETS_FAIL],
  });
};

export const budget = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.BUDGETS + data),
      params: {
        options: 'sysAttrs',
      }
    },
    types: [BUDGET_REQUEST, BUDGET_SUCCESS, BUDGET_FAIL],
  });
};

export const newBudget = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.BUDGETS),
    },
    types: [NEW_BUDGET_REQUEST, NEW_BUDGET_SUCCESS, NEW_BUDGET_FAIL],
  });
};

export const updateBudget = (data) => {
  const { auth_token: userToken } = parseCookies();
  const id = data?.id;

  delete data.id;

  return createAction({
    meta: null,
    request: {
      ...data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'PATCH',
      url: getApiURL(endpoints.BUDGETS + id),
      params: {
        options: 'replace'
      }
    },
    types: [UPDATE_BUDGET_REQUEST, UPDATE_BUDGET_SUCCESS, UPDATE_BUDGET_FAIL],
  });
};

export const deleteBudget = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'DELETE',
      url: getApiURL(endpoints.BUDGETS + data),
    },
    types: [DELETE_BUDGET_REQUEST, DELETE_BUDGET_SUCCESS, DELETE_BUDGET_FAIL],
  });
};

export const setDisplayingBudget = (data) => {
  return {
    type: DISPLAYED_BUDGET_SET,
    data,
  };
};
