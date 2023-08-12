/* eslint-disable react/prop-types */
//  Nodes
import Image from 'next/image';
import React from 'react';
import IsInternal from '../../utils/IsInternal';

//  Material UI
import {
  Box,
  Divider,
  IconButton,
  MenuItem, SwipeableDrawer
} from '@mui/material';

//  Services
import { navLinks } from '../../utils/navLinks';

//  Icons
import { LogOut, User, X } from 'lucide-react';

//  Navigation
import routes from '../../../navigation/routes';

//  "Page" Component
import ActiveLink from './activeLink';

//  Styles
import styles from '../../../styles/components/navbar.module.css';

//  Image
import companyLogo from '../../../public/Logotipo_Vetorizado.png';

// import companyLogo from '../../../public/Logotipo_Vetorizado.png';
import Router from 'next/router';
import { destroyCookie } from 'nookies';
import CanDo from '../../utils/CanDo';

// import { useTranslation } from 'react-i18next';

const DrawerMobile = ({ logout, toggleDrawer, state }) => {
  const loggedUser = state.auth.me;
  const userPermissions = state.auth.userPermissions;
  // const { t, i18n } = useTranslation();

  async function destroySessionCookie () {
    destroyCookie(null, 'auth_token');
  }

  async function onLogout () {
    await destroySessionCookie().then(() => {
      toggleDrawer();
      logout();
      Router.push(userPermissions?.type === 'client' ? '/' : '/signin');
    });
  }

  const builtLinks = navLinks
    .map((group) => ({
      ...group,
      pages: group.pages.filter((item) => {
        if (!loggedUser) return false;

        if (!userPermissions) return false;

        const canAccess = userPermissions?.permissions_orion.find(
          (ele) =>
            ele === item.allowed_ ||
          item.allowed_.toLowerCase() === userPermissions?.description.toLowerCase()
        );

        const isInternal = IsInternal(userPermissions?.description);

        const isInternalUrl = Object.values(routes.private.internal).includes(
          item.url.replace('[Id]', '')
        );

        return canAccess && isInternal === isInternalUrl;
      }),
    }))
    .filter((group) => group.pages.length > 0);

  console.log(builtLinks);

  return (
    <SwipeableDrawer
      disableSwipeToOpen={false}
      onOpen={() => toggleDrawer()}
      swipeAreaWidth={20}
      variant='temporary'
      anchor={'left'}
      open={state.appStates.drawerOpen}
      onClose={() => toggleDrawer()}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <Box
        sx={{ backgroundColor: 'default.sides' }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '250px',
        }}
      >
        {/* Sidebar Items List here */}
        <Box style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }} >
          <IconButton style={{ color: 'white', position: 'absolute', right: '0%' }} onClick={() => toggleDrawer()}>
            <X />
          </IconButton>
          <Box style={{ margin: '1rem' }}>
            <Image
              src={companyLogo}
              alt='company logo'
              width={75}
              height={75}
            />
          </Box>
          <Divider
            color='white'
            width='100%'
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
          />
        </Box>
        <Box className='scrollableZone' >
          {builtLinks
            .map((group, indexGrp) => {
              return <>
                {group.pages.map((item, i) => (
                  <Box key={i}>
                    <ActiveLink
                      toggleDrawer={toggleDrawer}
                      item={item}
                    />
                  </Box>
                ))}
                {group.underline && group.pages.length > 0 && indexGrp + 1 !== builtLinks.length && <Divider
                  color='white'
                  width='100%'
                  style={{ marginTop: '.5rem', marginBottom: '.5rem' }}
                />}
              </>;
            })}
          <Divider
            color='white'
            width='100%'
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
          />
          {CanDo('see_account') && <ActiveLink
            toggleDrawer={toggleDrawer}
            item={{
              t: 'Account',
              icon: <User strokeWidth='1' size={20} color='white' />,
              title: 'Conta',
              url: IsInternal(userPermissions?.description) ? `${routes.private.internal.account}` : `${routes.private.account}`
            } }
          />}
          <MenuItem
            className={styles.navItemContainer}
            sx={{
              padding: '0',
              width: '100%',
              borderLeft: '5px solid',
              borderColor: 'transparent',
            }}
            onClick={() => onLogout()}>
            <LogOut strokeWidth='1' size={20} />
            <div style={{ paddingRight: '.5rem' }} />
            Sair
          </MenuItem>
        </Box>
        <Box style={{ position: 'relative', bottom: 0, float: 'bottom', width: '100%' }}>

        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default DrawerMobile;
