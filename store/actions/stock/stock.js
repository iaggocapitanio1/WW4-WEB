// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const STOCKS_REQUEST = 'STOCKS_REQUEST';
export const STOCKS_FAIL = 'STOCKS_FAIL';
export const STOCKS_SUCCESS = 'STOCKS_SUCCESS';
export const NEW_STOCK_REQUEST = 'NEW_STOCK_REQUEST';
export const NEW_STOCK_FAIL = 'NEW_STOCK_FAIL';
export const NEW_STOCK_SUCCESS = 'NEW_STOCK_SUCCESS';
export const UPDATE_STOCK_REQUEST = 'UPDATE_STOCK_REQUEST';
export const UPDATE_STOCK_FAIL = 'UPDATE_STOCK_FAIL';
export const UPDATE_STOCK_SUCCESS = 'UPDATE_STOCK_SUCCESS';

export const stocks = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.STOCKS),
      params: {
        limit: 400
      }
    },
    types: [STOCKS_REQUEST, STOCKS_SUCCESS, STOCKS_FAIL],
  });
};

export const projectStocks = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.STOCKS),
      params: {
        q: `belongsTo=="${data}"`,
      }
    },
    types: [STOCKS_REQUEST, STOCKS_SUCCESS, STOCKS_FAIL],
  });
};

export const newStock = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.STOCKS),
    },
    types: [NEW_STOCK_REQUEST, NEW_STOCK_SUCCESS, NEW_STOCK_FAIL],
  });
};

export const updateStock = (data) => {
  const { auth_token: userToken } = parseCookies();
  const id = data?.id;

  delete data.id;

  return createAction({
    meta: null,
    request: {
      ...data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'PATCH',
      url: getApiURL(endpoints.STOCKS + id),
    },
    types: [UPDATE_STOCK_REQUEST, UPDATE_STOCK_SUCCESS, UPDATE_STOCK_FAIL],
  });
};
