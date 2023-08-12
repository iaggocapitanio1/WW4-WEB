// Node modules
import { AppBar, Box, Hidden, IconButton, LinearProgress, Toolbar, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import companyLogo from '../../../public/Logotipo_Vetorizado.png';
// import companyLogo from '../../../public/Logotipo_Vetorizado.png';
import woodWorkyLogo from '../../../public/logo_bw_ww40_inv-big.png';
import * as appStatesActions from '../../../store/actions/appState';
import * as authActions from '../../../store/actions/auth';
import styles from '../../../styles/components/navbar.module.css';
import DrawerMobile from '../drawer/drawer';

const Navbar = ({ ...pageProps }) => {
  const dispatch = useDispatch();
  const toggleDrawer = () => dispatch(appStatesActions.toggleDrawer());
  const logout = () => dispatch(authActions.logout());
  const reduxState = useSelector((state) => state);

  return (
    <>
      <AppBar position='sticky' sx={{ backgroundColor: 'default.sides' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex' }}>
            <Box className={styles.logos} sx={{ p: 1 }}>
              <Image
                src={companyLogo}
                alt={'company Logo'}
                width={50}
                height={50}
                placeholder='blur'
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title='Abrir Menu'>
                <IconButton
                  id='drawerToggleBtn'
                  className={styles.menuBtn}
                  color='inherit'
                  aria-label='open drawer'
                  edge='start'
                  sx={{ ml: 2 }}
                  onClick={() => toggleDrawer()}
                >
                  <Menu
                    strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
                    style={{ color: 'var(--white)' }}
                  />
                </IconButton>
              </Tooltip>
            </Box>

          </Box>
          <Box display={'none'}>DEV</Box>
          <Box id='align' justifyContent={'end'}>
            <Box pr={3}>
              <Typography variant='subtitle2' color='white' sx={{ display: !reduxState.auth.me && 'none' }}>
                {reduxState.auth.me?.name?.value ||
                reduxState.auth.me?.givenName?.value ||
                (reduxState.auth.me?.first_name !== ''
                  ? reduxState.auth.me?.first_name + ' ' + reduxState.auth.me?.last_name
                  : reduxState.auth.me.username)}
              </Typography>
            </Box>
            <Box className={styles.logos} >
              <Image
                src={woodWorkyLogo}
                alt={'App Logo'}
                width={50}
                height={50}
                placeholder='blur'
                loading='lazy'
              />
            </Box>
          </Box>
        </Toolbar>
        {reduxState.appStates.loading && false && <LinearProgress color="secondary"/>}
      </AppBar>
      <Hidden>
        <DrawerMobile
          state={reduxState}
          {...pageProps}
          toggleDrawer={toggleDrawer}
          logout={logout}
        />
      </Hidden>
    </>
  );
};

Navbar.propTypes = {
  me: PropTypes.any,
  toggleDrawer: PropTypes.func,
};

export default Navbar;
