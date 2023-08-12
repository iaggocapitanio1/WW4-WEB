/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
/* eslint-disable no-constant-condition */
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import React from 'react';
import Notification from '../../dialogs/Notification';
// import FormGenerator from '../../formGenerator';
import { Box, Typography } from '@mui/material';
import styles from '../../../styles/SignIn.module.css';

const AccountActivation = () => {
  return <Grid container component='main' sx={{ height: '100vh' }}>
    <CssBaseline />
    <Notification />
    <Grid container className={styles.sidePanelForgot} sm={4} md={12}>
      <Box display={'flex'} alignItems='center' justifyContent={'center'} sx={{ width: '100%' }}>
        <Box justifyContent='center' sx={{ borderRadius: '16px', backgroundColor: 'white', minHeight: '400px', minWidth: '400px' }}>
          <Box p={1} sx={{ width: '100%' }}><Typography variant='title'>A ativar a conta</Typography></Box>
          <Box p={1} sx={{ width: '100%', height: 'max-content' }}><Typography variant='title'>A ativar a conta</Typography></Box>
        </Box>
      </Box>
    </Grid>
  </Grid>;
};

export default AccountActivation;
