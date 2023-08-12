// Network
import { parseCookies } from 'nookies';
import { getApiURL } from '../../network/config';
import createAction from '../../network/create-action';
import endpoints from '../../network/endpoints';

export const ORGANIZATIONS_REQUEST = 'ORGANIZATIONS_REQUEST';
export const ORGANIZATIONS_FAIL = 'ORGANIZATIONS_FAIL';
export const ORGANIZATIONS_SUCCESS = 'ORGANIZATIONS_SUCCESS';

export const organizations = (data) => {
  const { auth_token: userToken } = parseCookies();

  return createAction({
    meta: null,
    data,
    request: {
      headers: { 'content-type': 'application/json', Authorization: userToken ? `Bearer ${userToken}` : '' },
      method: 'GET',
      url: getApiURL(endpoints.ORGANIZATIONS),
    },
    types: [ORGANIZATIONS_REQUEST, ORGANIZATIONS_SUCCESS, ORGANIZATIONS_FAIL],
  });
};
