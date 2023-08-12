// Network
import { parseCookies } from 'nookies';
import GenerateQueryFilters from '../../../components/utils/GenerateQueryFilters';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const CONSUMABLES_REQUEST = 'CONSUMABLES_REQUEST';
export const CONSUMABLES_FAIL = 'CONSUMABLES_FAIL';
export const CONSUMABLES_SUCCESS = 'CONSUMABLES_SUCCESS';
export const NEW_CONSUMABLE_REQUEST = 'NEW_CONSUMABLE_REQUEST';
export const NEW_CONSUMABLE_FAIL = 'NEW_CONSUMABLE_FAIL';
export const NEW_CONSUMABLE_SUCCESS = 'NEW_CONSUMABLE_SUCCESS';

export const consumables = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.CONSUMABLES),
    },
    types: [CONSUMABLES_REQUEST, CONSUMABLES_SUCCESS, CONSUMABLES_FAIL],
  });
};

export const projectConsumables = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.CONSUMABLES),
      params: {
        limit: 400,
        q: GenerateQueryFilters(data),
      }
    },
    types: [CONSUMABLES_REQUEST, CONSUMABLES_SUCCESS, CONSUMABLES_FAIL],
  });
};

export const consumable = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.CONSUMABLES),
      params: {
        q: `belongsTo=="${data}"`,
      }
    },
    types: [CONSUMABLES_REQUEST, CONSUMABLES_SUCCESS, CONSUMABLES_FAIL],
  });
};

export const newConsumable = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    request: {
      data,
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'POST',
      url: getApiURL(endpoints.CONSUMABLES),
    },
    types: [NEW_CONSUMABLE_REQUEST, NEW_CONSUMABLE_SUCCESS, NEW_CONSUMABLE_FAIL],
  });
};
