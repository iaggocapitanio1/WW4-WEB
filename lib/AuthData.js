import Router from 'next/router';
import { destroyCookie, parseCookies } from 'nookies';
import { bindActionCreators } from 'redux';
import routes from '../navigation/routes';
import * as appStatesActions from '../store/actions/appState';
import * as authActionsRedux from '../store/actions/auth';

// eslint-disable-next-line consistent-return
const AuthData = async (dispatch) => {
  const { me, userPermissionsSet } = bindActionCreators(authActionsRedux, dispatch);
  const { setLastRefreshed } = bindActionCreators(appStatesActions, dispatch);
  const { auth_token: userToken } = parseCookies();
  const isInternalPage = Object.values(routes.private.internal).includes(window.location.pathname);
  const isClientPage = Object.values(routes.private).includes(window.location.pathname);

  if (!userToken) {
    true && isInternalPage && Router.push('/signin');
    true && isClientPage && Router.push('/');
  }

  try {
    const meRes = await me();

    if (meRes.response?.status === 403) throw meRes;

    setLastRefreshed();

    const perms = await userPermissionsSet({
      description: meRes.data.role,
      type: meRes.data.role !== 'CUSTOMER' ? 'internal' : 'client',
      permissions_orion: meRes.data.orion_permissions,
    });

    return { perms, me: meRes.data };
  } catch (error) {
    destroyCookie(null, 'auth_token');

    if (error.response?.status === 403) {
      // Handle 403 error here
      true && isInternalPage && Router.push('/signin');
      true && isClientPage && Router.push('/');
    } else {
      // Handle all other errors here

      return error;
    }
  }
};

export default AuthData;
