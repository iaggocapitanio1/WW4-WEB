/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/prop-types */
//  Nodes

//  Mui
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box, Button, Checkbox, CircularProgress, Container, CssBaseline, Dialog,
  DialogActions,
  DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, Grid,
  Typography
} from '@mui/material';

//  Styles
import styles from '../../../styles/SignIn.module.css';

//  Dialogs
import Notification from '../../dialogs/Notification';

//  Custom components
import MyInput from '../../inputs/myInput';
import Footer from '../../layout/footer/footer';

//  Lucide icons
import { XCircle } from 'lucide-react';

//  Utils

//  PropTypes
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import routes from '../../../navigation/routes';
import companyLogo from '../../../public/Logotipo_Vetorizado.png';
import productLogo from '../../../public/logo_bw_ww40.png';

import ToastSet from '../../utils/ToastSet';

import { setCookie } from 'nookies';
import { toast } from 'react-toastify';

import * as authActionsRedux from '../../../store/actions/auth';
import RedirectTo from '../../utils/RedirectTo';

const SignInPage = (props) => {
  const rootStyles = {
    minHeight: '100vh',
    flexDirection: 'row-reverse',
  };

  const imageContainerStyles = {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(your_bg_image.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const formContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    padding: 'none'
  };

  const formStyles = {
    paddingTop: 4,
    paddingLeft: 4,
    paddingRight: 4,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '& .MuiTextField-root': {
      marginBottom: '16px',
    },
  };

  const footerStyles = {
    marginTop: 'auto',
    textAlign: 'center',
    width: '100%'
  };

  const [visible, setVisible] = useState(true);

  const {
    client,
    forgotPasswordRoute
  } = props;

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

  const [username, setUsername] = useState(Router.route === '/' ? 'bruno.barros@nka.pt' : 'admin@email.com');
  // const [email, setEmail] = useState(Router.route === '/' ? 'geral@nka.pt' : 'bruno.barros@nka.pt');
  const [password, setPassword] = useState(Router.route === '/' ? 'ChangeMe1' : 'zo5JhUY7xzgg5Jk');
  const [loading, setLoading] = useState(false);
  const [usernameErrors, setUsernameErrors] = useState();
  // const [emailErrors, setEmailErrors] = useState();
  const [senhaErrors, setSenhaErrors] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const [windowWidth, setWindowHeight] = useState();
  const dispatch = useDispatch();
  const loginRedux = (data) => dispatch(authActionsRedux.login(data));
  const getMe = (data) => dispatch(authActionsRedux.me(data));
  const userPermissionsSet = (data) => dispatch(authActionsRedux.userPermissionsSet(data));

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

    const errors = {
      email: '',
      password: ''
    };

    if (username === '') errors.email = 'Campo obrigatório';

    if (password === '') errors.password = 'Campo obrigatório';
    else if (password.length < 6) errors.password = 'Senha tem que ter minimo 6 caracteres';

    if (errors.password || errors.username) {
      setSenhaErrors(errors.password);
      setUsernameErrors(errors.username);

      return;
    }

    setLoading(true);

    const loadingNotification = toast.loading('');

    try {
      // eslint-disable-next-line consistent-return
      await loginRedux({ username, password }).then(async (res) => {
        setLoading(false);

        if (res?.response?.status === 400) {
          if (res.response?.data?.error_description === 'Invalid credentials given.') return ToastSet(loadingNotification, 'Credenciais erradas.', 'error');

          return ToastSet(loadingNotification, 'Algo aconteceu. Por favor tente mais tarde', 'error');
        }

        // setCookie(undefined, 'auth_token_expireAt', res?.data?.expires_in);
        setCookie(undefined, 'auth_token', res?.data?.access_token);

        await getMe(res.data.access_token).then(async (res) => {
          const user = res?.data[0] || res?.data;

          await userPermissionsSet({
            description: user.role,
            type: user.role !== 'CUSTOMER' ? 'internal' : 'client',
            permissions_orion: user.orion_permissions,
          });

          ToastSet(loadingNotification, 'A entrar', 'success');
          setLoading(false);

          const nextPage = RedirectTo(user);

          // eslint-disable-next-line no-constant-condition
          if (user.role === 'CUSTOMER' && user.tos === false) router.push('/terms');
          else router.push(nextPage);
        }).catch((err) => console.log(err));
      });
    } catch (err) {
      if (err.response?.data?.error_description === 'Invalid credentials given.') ToastSet(loadingNotification, 'Credenciais erradas.', 'error');
      else ToastSet(loadingNotification, 'Algo aconteceu. Por favor tente mais tarde', 'error');

      setLoading(false);
    }
  };

  return (
    <>

      {true && <Grid container component='main' sx={{ height: '100vh' }}>
        <CssBaseline />
        <Notification />
        {false && <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}>
          <DialogTitle id='alert-dialog-title' sx={{ color: 'var(--primary)' }}>
          Conta Bloqueada
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Box mb={1} sx={{ display: 'flex', justifyContent: 'center' }}>
              <XCircle size={80} color='var(--red)' />
            </Box>
            <DialogContentText id='alert-dialog-description'>
            Esta conta está bloqueada. Se não é suposto, por favor entre em  <a className='link' href={`mailto:${process.env.NEXT_PUBLIC_REPORT_EMAIL}`}>contacto</a> com o responsavel.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>
            Entendido
            </Button>
          </DialogActions>
        </Dialog>}
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
          <Grid container xl={4} lg={6} md={6} sm={6} xs={12} >
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
                  <Box sx={{ width: '100%', display: 'flex' }}>
                    <Box
                      component='form'
                      noValidate
                      onSubmit={handleSubmit}
                      sx={formStyles}>
                      <Typography variant='md' color={'primary'} sx={{ fontWeight: 600 }}>
                        {client ? 'Portal Cliente WW4.0' : 'Portal Interno WW4.0'}
                      </Typography>
                      <Typography component='h1' variant='h2'> Login  </Typography>
                      <MyInput
                        id='email'
                        label='Endereço de email'
                        onChange={(e) => {
                          if (usernameErrors) setUsernameErrors('');

                          setUsername(e.target.value);
                        } }
                        value={username}
                        error={usernameErrors}
                        name='email'
                        type='email'
                      />
                      <MyInput
                        id='password'
                        label='Senha'
                        onChange={(e) => { setSenhaErrors(''); setPassword(e.target.value); }}
                        value={password}
                        error={senhaErrors}
                        name='password'
                        type={visible ? 'password' : 'text'}
                        iconTooltip={visible && 'Mostrar Senha'}
                        adornmentOnClick={() => setVisible(!visible)}
                        adornmentIcon={visible ? <Visibility color={'primary'} /> : <VisibilityOff />} />
                      <Grid container style={{ alignItems: 'center' }}>
                        <Grid item xs>
                          <Typography variant="subtitle2" color="primary">

                            <a
                              style={{ cursor: 'pointer' }}
                              onClick={() => Router.push(forgotPasswordRoute)}
                            >Esqueceu-se da sua senha?</a>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <FormControlLabel
                            control={
                              <Checkbox name='remember' value={true} color='primary' />
                            }
                            label='Lembrar utilizador'
                          />
                        </Grid>
                      </Grid>
                      {client &&
                    <Box display='flex'>
                      <a
                        target='#'
                        onClick={() => Router.push(routes.private.tos)}
                      > <Typography sx={{ cursor: 'pointer' }} color={'primary'}>Termos e Condições</Typography>  </a>
                      <Typography pr={1}pl={1}> | </Typography>
                      <a
                        target='#'
                        onClick={() => Router.push(routes.private.privacy)}
                      >  <Typography sx={{ cursor: 'pointer' }} color={'primary'}>Política de Privacidade</Typography> </a>
                    </Box>
                      }
                      <Button
                        id='submit'
                        onClick={(e) => handleSubmit(e)}
                        type='submit'
                        fullWidth
                        variant='contained'
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                      >
                        {loading
                          ? (
                            <CircularProgress size={25} sx={{ color: 'white' }} />
                          )
                          : (
                            'Entrar'
                          )}
                      </Button>
                    </Box>
                  </Box>
                </Box>}
              </Container>

              <Container component="footer" style={styles2.containerStyle} >
                {/* Bottom container */}
                <Footer isPublicPage={true}/>
              </Container>
            </Box>

            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            <Box display='none'>
              <Grid container md={12} sm={12} xs={12} pt={2} pl={2} pr={2} >
                <Grid container md={6} sm={6} xs={6} >
                  <a
                    target='#'
                    href='http://mofreita.com/'
                  >
                    <Image
                      width={windowWidth > 600 ? 80 : 50}
                      alt='Company Logo'
                      src={productLogo}
                      placeholder='blur'
                    />
                  </a>
                </Grid>
                <Grid container md={6} sm={6} xs={6} justifyContent={'end'}>
                  <Box component='a'
                    sx={{ height: 'fit-content' }}
                    target='#'
                    href='http://mofreita.com/'
                  >
                    <Image
                      width={windowWidth > 600 ? 60 : 50}
                      alt='Company Logo'
                      src={companyLogo}
                      placeholder='blur'
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid container md={12} sm={12} xs={12} sx={{ flexDirection: 'column', alignItems: 'center', overflow: 'scroll', border: '5px solid red' }}>
                <Box p={1} sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%' }}>
                    <Box
                      component='form'
                      noValidate
                      onSubmit={handleSubmit}
                      sx={formStyles}>
                      <Typography variant='md' color={'primary'} sx={{ fontWeight: 600 }}>
                        {client ? 'Portal Cliente WW4.0' : 'Portal Interno WW4.0'}
                      </Typography>
                      <Typography component='h1' variant='h2'> Login  </Typography>
                      <MyInput
                        id='email'
                        label='Endereço de email'
                        onChange={(e) => {
                          if (usernameErrors) setUsernameErrors('');

                          setUsername(e.target.value);
                        } }
                        value={username}
                        error={usernameErrors}
                        name='email'
                        type='email'
                      />
                      <MyInput
                        id='password'
                        label='Senha'
                        onChange={(e) => { setSenhaErrors(''); setPassword(e.target.value); }}
                        value={password}
                        error={senhaErrors}
                        name='password'
                        type={visible ? 'password' : 'text'}
                        iconTooltip={visible && 'Mostrar Senha'}
                        adornmentOnClick={() => setVisible(!visible)}
                        adornmentIcon={visible ? <Visibility color={'primary'} /> : <VisibilityOff />} />
                      <Grid container style={{ alignItems: 'center' }}>
                        <Grid item xs>
                          <Typography variant="subtitle2" color="primary">

                            <a
                              style={{ cursor: 'pointer' }}
                              onClick={() => Router.push(forgotPasswordRoute)}
                            >Esqueceu-se da sua senha?</a>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <FormControlLabel
                            control={
                              <Checkbox name='remember' value={true} color='primary' />
                            }
                            label='Lembrar utilizador'
                          />
                        </Grid>
                      </Grid>
                      {client &&
                    <Box display='flex'>
                      <a
                        target='#'
                        onClick={() => Router.push(routes.private.tos)}
                      > <Typography sx={{ cursor: 'pointer' }} color={'primary'}>Termos e Condições</Typography>  </a>
                      <Typography pr={1}pl={1}> | </Typography>
                      <a
                        target='#'
                        onClick={() => Router.push(routes.private.privacy)}
                      >  <Typography sx={{ cursor: 'pointer' }} color={'primary'}>Política de Privacidade</Typography> </a>
                    </Box>
                      }
                      <Button
                        id='submit'
                        onClick={(e) => handleSubmit(e)}
                        type='submit'
                        fullWidth
                        variant='contained'
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                      >
                        {loading
                          ? (
                            <CircularProgress size={25} sx={{ color: 'white' }} />
                          )
                          : (
                            'Entrar'
                          )}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid sx={footerStyles}>
                <Footer isPublicPage={true}/>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>}
    </>
  );
};

export default SignInPage;
