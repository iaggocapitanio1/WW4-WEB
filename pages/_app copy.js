//  Node modules
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

//  Proptypes
import PropTypes from 'prop-types';

//  Styles
import '../styles/globals.css';

//  App Layout
import Layout from '../components/layout/layout';

//  Services

//  Material UI
import { ThemeProvider } from '@mui/material';

//  Navigation
import routes from '../navigation/routes';

//  Utils

//  Momment
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { destroyCookie, parseCookies } from 'nookies';
import { useDispatch, useSelector } from 'react-redux';
import MomentJsConfig from '../components/utils/MomentJsConfig';
import RedirectTo from '../components/utils/RedirectTo';

import AuthData from '../lib/AuthData';
import * as appStatesActions from '../store/actions/appState';
import { storeWrapper } from '../store/store';
import MuiTheme from './MuiTheme';

export const initializeClientSideProps = async ({ Component, ctx }) => {
  const pageProps = {
    ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
  };

  return { pageProps };
};

const App = ({ Component, pageProps }) => {
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [fontSize, setFontSize] = useState('md');
  const { auth_token: token } = parseCookies();
  const router = useRouter();
  const reduxState = useSelector((state) => state);
  const theme = MuiTheme({ selectedTheme: reduxState.appStates.themeColor, fontSize });
  const dispatch = useDispatch();
  const setTheme = (data) => dispatch(appStatesActions.setTheme(data));

  moment.locale(MomentJsConfig());

  const toggleTheme = () => {
    const desiredTheme = selectedTheme === 'light' ? 'dark' : 'light';

    localStorage.setItem('theme', desiredTheme);
    setSelectedTheme(desiredTheme);

    return desiredTheme;
  };

  const toggleFontSize = (value) => {
    localStorage.setItem('font', value);
    setFontSize(value);

    return value;
  };

  const isPublicPage = Object.values(routes.public).some((route) => route === router.route);

  useEffect(() => {
    const load = async () => {
      await setTheme(theme);

      //  theme
      if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'light');
      else if (selectedTheme !== localStorage.getItem('theme')) setSelectedTheme(localStorage.getItem('theme'));

      if (!localStorage.getItem('font')) localStorage.setItem('font', 'md');
      else if (fontSize !== localStorage.getItem('font')) setFontSize(localStorage.getItem('font'));

      if (typeof token !== 'undefined') {
        const decodedToken = jwt.decode(token);
        const a = true;
        let myCredentials;

        if (!reduxState.auth.me || !reduxState.auth.userPermissions) myCredentials = await AuthData(dispatch);

        if (moment(new Date(0).setUTCSeconds(decodedToken?.exp)) > moment() || a) {
          pageProps.theme = selectedTheme;

          const nextPage = RedirectTo(myCredentials?.me);

          if (myCredentials) {
            console.log(nextPage);
            isPublicPage && router.push(nextPage);
          }
        } else {
          destroyCookie('auth-token');
          router.push(routes.public.signIn);
        }
      } else {
        destroyCookie('auth-token');
        !isPublicPage && router.push(routes.public.signIn);
      }
    };

    load();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Wood Work 4.0" />
        <meta name="keywords" content="work, madeira, moveis, barato" />
        <meta name="author" content="Bruno Barros" />
        <title>Wood Work 4.0</title>
        <link rel='icon' href='/logo_bw_ww40_inv.png' />
      </Head>
      <Layout {...pageProps} toggleTheme={toggleTheme} toggleFontSize={toggleFontSize}>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
};

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
  ctx: PropTypes.any,
};

export default storeWrapper.withRedux(App);
