// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const LEFTOVERS_REQUEST = 'LEFTOVERS_REQUEST';
export const LEFTOVERS_FAIL = 'LEFTOVERS_FAIL';
export const LEFTOVERS_SUCCESS = 'LEFTOVERS_SUCCESS';

export const leftovers = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.LEFTOVERS),
    },
    types: [LEFTOVERS_REQUEST, LEFTOVERS_SUCCESS, LEFTOVERS_FAIL],
  });
};
