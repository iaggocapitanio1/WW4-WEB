/* eslint-disable consistent-return */
//  Nodes
import { Button, Container } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ChevronLeft } from 'lucide-react';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../../../styles/SignIn.module.css';
import Notification from '../../dialogs/Notification';
import Footer from '../../layout/footer/footer';

//  PropTypes
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import companyLogo from '../../../public/Logotipo_Vetorizado.png';
import productLogo from '../../../public/logo_bw_ww40.png';

// import companyLogo from '../../../public/Logotipo_Vetorizado.png';
import * as emailActionsRedux from '../../../store/actions/email';
import MyInput from '../../inputs/myInput';
import EmailValidation from '../../utils/EmailValidation';

const ForgotPassword = (props) => {
  const { client, signinRoute } = props;
  const [windowWidth, setWindowHeight] = useState();
  const [email, setEmail] = useState();
  const dispatch = useDispatch();
  const sendResetEmail = (data) => dispatch(emailActionsRedux.resetPassword(data));

  if (typeof window !== 'undefined') {
    useEffect(() => {
      setWindowHeight(window.innerWidth);
    }, [window.innerWidth]);
  }

  const listenToResize = () => {
    setWindowHeight(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', listenToResize);

    return () => window.removeEventListener('resize', listenToResize);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) return toast.error('Prencher formulário');

    if (!EmailValidation(email)) return toast.error('Email mal formatado');

    const FormData = require('form-data');
    const data = new FormData();

    data.append('email', email);

    await sendResetEmail(data).then(() => {
      setEmail('');
      toast.success('Sucesso! Siga as instruções que constam do email enviado.');
    }).catch(() => {
      setEmail('');
      toast.success('Sucesso! Siga as instruções que constam do email enviado.');
      // toast.error('Email não enviado.');
    });
  };

  const formStyles = {
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '& .MuiTextField-root': {
      marginBottom: '16px',
    },
  };

  const styles2 = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%'
    },
    content: {
      flexGrow: 1,
      overflow: 'auto',
    },
    containerStyle: {
      position: 'sticky'
    },
  };

  return (
    <>
      {true && <Grid container component='main' sx={{ height: '100vh' }}>
        <CssBaseline />
        <Notification />
        <Grid container md={12} sm={12} xs={12} >
          <Grid container xl={8} lg={6} md={6} sm={6} xs={12} display={{ xl: 'flex', lg: 'flex', md: 'flex', sm: 'flex', xs: 'none' }} className={styles.sidePanel} >
            <div className={styles.logoImg}>
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                }}
              >
              </Box>
            </div>
          </Grid>
          <Grid container xl={4} lg={6} md={6} sm={6} xs={12} component={Paper}>
            <Box style={styles2.root}>
              <Container component="header" style={styles2.containerStyle} >
                {/* Top container */}
                <Grid container md={12} sm={12} xs={12} >
                  <Grid container md={6} sm={6} xs={6} >
                    <Box component={'a'}
                      display={{ xl: 'none', lg: 'none', md: 'none', sm: 'none', xs: 'flex' }}
                      target='#'
                      href='http://mofreita.com/'
                      sx={{ height: 'fit-content', mt: '25px', ml: '25px' }}

                    >
                      <Image
                        width={80}
                        alt='Company Logo'
                        src={productLogo}
                        placeholder='blur'
                      />
                    </Box>
                  </Grid>
                  <Grid container md={6} sm={6} xs={6} justifyContent={'end'}>
                    <Box component='a'
                      target='#'
                      href='http://mofreita.com/'
                      sx={{ height: 'fit-content', mt: '25px', mr: '25px' }}
                    >
                      <Image
                        width={windowWidth > 600 ? 80 : 50}
                        alt='Company Logo'
                        src={companyLogo}
                        placeholder='blur'
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Container>

              <Container component="main" style={{ ...styles2.content }} sx={{ overflow: 'scroll', height: '1px' }}>
                {/* Middle container */}
                {true && <Box p={1} sx={{ height: '100%', width: '100%', display: 'flex' }}>
                  <Box
                    component='form'
                    noValidate
                    onSubmit={handleSubmit}
                    sx={formStyles}>

                    <Typography variant='md' color={'primary'} sx={{ fontWeight: 600 }}>
                      {client ? 'Portal Cliente WW4.0' : 'Portal Interno WW4.0'}
                    </Typography>
                    <Typography component='h2' variant='h3'>
            Recuperar senha
                    </Typography>
                    <Typography variant='h7'>
            Introduza o seu endereço de email. Irá receber um email para alterar a senha.
                    </Typography>
                    <Box
                      component='form'
                      noValidate
                      onSubmit={handleSubmit}
                      sx={{ mt: 1, width: '100%' }}
                    >
                      <MyInput
                        label={'Email'}
                        required
                        fullWidth
                        id='email'
                        name='email'
                        autoComplete='email'
                        // placeholder='email'
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Box mt={2}>
                        <Button
                          fullWidth
                          type='submit'
                          variant='contained'
                          sx={{ mt: 3, mb: 2 }}
                          onClick={(e) => handleSubmit(e)}

                        >
                Submeter
                        </Button>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <a
                            id='align'
                            onClick={() => Router.push(signinRoute)}
                            className='link'
                          >
                            <ChevronLeft className='link' />
                            <span>Voltar a página de Login</span>
                          </a>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>}
              </Container>

              <Container component="footer" style={styles2.containerStyle} >
                {/* Bottom container */}
                <Footer isPublicPage={true}/>
              </Container>
            </Box>

            {false && <Footer isPublicPage={true}/>}
          </Grid>
        </Grid>
      </Grid>}
    </>
  );
};

ForgotPassword.propTypes = {
  client: PropTypes.bool,
  signinRoute: PropTypes.bool
};

export default ForgotPassword;
