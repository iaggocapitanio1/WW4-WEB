// Node modules
import axios from 'axios';
// Network
import { destroyCookie, parseCookies } from 'nookies';
import { buildURL } from '../../../store/network/config';
import endpoints from '../../../store/network/endpoints';

export const CALL_API = Symbol('CALL_API');

const api = () => () => (dispatch) => async (action) => {
  const { [CALL_API]: callAPI } = action;
  const { auth_token: userToken } = parseCookies();

  if (callAPI === undefined) {
    return dispatch(action);
  }

  const { meta, request, types } = callAPI;
  const [REQUEST, SUCCESS, FAIL] = types;
  const headers = { ...(request.headers || {}), Authorization: request.url !== endpoints.LOGIN && (userToken && `Bearer ${userToken}`) };
  const requestOptions = { ...request, headers, url: !request.url.includes('woodwork4.ddns.net') ? buildURL(request.url) : request.url };
  const actionWith = (payload) => ({ ...action, ...payload });
  const requestAction = actionWith({ type: REQUEST, meta });

  dispatch(requestAction);

  try {
    const response = await axios(requestOptions);
    const successAction = actionWith({ type: SUCCESS, meta, payload: response });

    dispatch(successAction);

    return response;
  } catch (error) {
    if (error?.response?.status === 403 || error?.response?.status === 401) {
      const failAction = actionWith({ type: FAIL, meta, payload: error.response || error });

      if (error.response?.data?.detail === ('Invalid token header. No credentials provided.' || 'Authentication credentials were not provided.')) {
        destroyCookie(null, 'auth_token');

        throw error;
      }

      dispatch(failAction);
    }

    throw error;
  }
};

export default api;
