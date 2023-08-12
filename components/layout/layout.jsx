import Router, { useRouter } from 'next/router';
import { destroyCookie, parseCookies } from 'nookies';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FloatingButton from '../../components/floatingButton/FloatingButton';
import PageNotFound from '../../components/pages/404';
import AuthData from '../../lib/AuthData';
import routes from '../../navigation/routes';
// import '../../pages/i18n';
import CanDo from '../utils/CanDo';

const noLayoutScreens = [
  `${routes.public.signIn}`,
  `${routes.public.signInInternal}`,
  `${routes.public.forgotPassword}`,
  `${routes.public.forgotPasswordInternal}`,
  `${routes.public.resetPassword}`,
  `${routes.public.accountActivation}`,
  `${routes.public.resetPasswordInternal}`,
  `${routes.private.terms}`,
  `${routes.private.tos}`,
  `${routes.private.privacy}`,
];

function findNeededPermission (path) {
  const pathRoute = path.route.replace('[Id]', '');

  // Check the private routes
  for (const key in routes.private.internal) {
    const route = routes.private.internal[key];

    if (route === pathRoute) {
      if (key.endsWith('s')) {
        // Plural key, permission required is list_<key>
        return `list_${key.slice(0, -1)}`;
      } else if (key.startsWith('edit')) {
        // Key has "edit" on it, permission required is change_<key without "edit">
        const singularKey = key.replace('edit', '');

        return `update_${singularKey}`;
      } else if (key.startsWith('new')) {
        // Key has "new" on it, permission required is add_<key without "new">
        const singularKey = key.replace('new', '');

        return `create_${singularKey}`;
      }

      // Singular key, permission required is view_<key>
      return `see_${key}`;
    }
  }

  for (const key in routes.private) {
    const route = routes.private[key];

    if (route === pathRoute) {
      if (key.endsWith('s')) {
        // Plural key, permission required is list_<key>
        return `list_${key.slice(0, -1)}`;
      } else if (key.startsWith('edit')) {
        // Key has "edit" on it, permission required is change_<key without "edit">
        const singularKey = key.replace('edit', '');

        return `change_${singularKey}`;
      } else if (key.startsWith('new')) {
        // Key has "new" on it, permission required is add_<key without "new">
        const singularKey = key.replace('new', '');

        return `add_${singularKey}`;
      }

      // Singular key, permission required is view_<key>
      return `see_${key}`;
    }
  }

  // No matching route found
  return null;
}

const Layout = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [noAccess, setNoAccess] = useState(false);
  const path = useRouter();
  const dispatch = useDispatch();

  const listenToScroll = () => {
    const heightToHideFrom = 500;
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHideFrom) {
      !isVisible && setIsVisible(true);
      isVisible && setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    const { auth_token: authToken } = parseCookies();
    const isInternalPage = Object.values(routes.private.internal).includes(path.route.replace('[Id]', ''));
    const isClientPage = Object.values(routes.private).includes(path.route.replace('[Id]', ''));

    const verifyToken = async () => {
      if (!authToken) {
        !noLayoutScreens.includes(path.route.replace('[Id]', '')) && Router.push(isInternalPage ? '/signin' : isClientPage && '/');

        return;
      }

      try {
        const meRes = await AuthData(dispatch);

        if (meRes?.me?.tos === false && path.route !== routes.private.terms) {
          Router.push(routes.private.terms);
        }

        setNoAccess(
          (isInternalPage && meRes?.me?.role === 'CUSTOMER') ||
          (isClientPage && meRes?.me?.role !== 'CUSTOMER') ||
          meRes?.response?.status === 403

        );
        // If the token is valid, do nothing
      } catch (error) {
        console.log(error);

        if (error.response?.status === 403) {
          // Invalid token, delete cookie and redirect to login page
          destroyCookie(null, 'auth_token');
          Router.push('/signin');
        }
      }
    };

    window.addEventListener('scroll', listenToScroll);
    Promise.all([verifyToken()]).then(() => setLoaded(true));

    return () => window.removeEventListener('scroll', listenToScroll);
  }, [path]);

  const neededPermission = findNeededPermission(path);
  let hasNeededPermission = !!CanDo(neededPermission?.toLowerCase());

  if (noLayoutScreens.includes(path.route.replace('[Id]', ''))) hasNeededPermission = true;

  return loaded && <>
    {!hasNeededPermission || noAccess
      ? <PageNotFound noAccess={noAccess || !hasNeededPermission} />
      : <>
        {children}
        <FloatingButton isVisible={isVisible}/>
      </>}
  </>;
};

Layout.propTypes = {
  children: PropTypes.any
};

export default Layout;
