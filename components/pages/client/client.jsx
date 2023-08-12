//  Nodes
import Router from 'next/router';
import React, { useState } from 'react';

//  Material UI
import { Box, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';

//  Custom Components
import CustomBreadcrumbs from '../../breadcrumbs';
import Content from '../../content/content';

//  PropTypes
import PropTypes from 'prop-types';

//  Styles
import styles from '../../../styles/NewOrder.module.css';

//  Icons
import { Edit2, Map, Trash, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import * as ClientsActionsRedux from '../../../store/actions/client';
import Buttons from '../../buttons/Buttons';
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import Notification from '../../dialogs/Notification';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';
import ToastSet from '../../utils/ToastSet';

const EditClient = ({ ...props }) => {
  const { breadcrumbsPath, editRoute, pageProps, client } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const deleteClient = (data) => dispatch(ClientsActionsRedux.deleteClient(data));
  const reduxState = useSelector((state) => state);

  async function onDelete () {
    const loading = toast.loading('');

    try {
      await deleteClient(client?.id.replace('urn:ngsi-ld:Owner:', '')).then(() => {
        ToastSet(loading, 'Cliente Removido!', 'success');
        Router.push(routes.private.internal.clients);
      });
    } catch (err) {
      ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde ', 'error');
    }
  }

  const tableFirstCell = {
    container: true,
    sx: { borderLeft: '1px solid', borderRight: '1px solid', borderColor: 'divider' },
    md: 4,
    sm: 4,
    xs: 4,
    p: 0.5
  };

  // const tableLastCell = {
  //   container: true,
  //   sx: { borderRight: '1px solid ', borderColor: 'divider' },
  //   md: 5,
  //   sm: 5,
  //   xs: 5,
  //   p: 0.5
  // };

  const tablemiddleCell = {
    container: true,
    md: 8,
    sm: 8,
    xs: 8,
    p: 0.5,
    sx: { borderRight: '1px solid ', borderColor: 'divider' },

  };

  const canEditClient = CanDo('update_client');
  const canDeleteClient = CanDo('delete_owner');

  return (
    <>
      <ConfirmDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        onConfirm={() => onDelete()}
        message={'Está prestes a apagar um cliente o que é irreversível, tem certeza que quer continuar?'}
      />
      <Navbar />
      <Notification />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
        <CssBaseline />
        <CustomBreadcrumbs path={breadcrumbsPath} />
        <Content>
          <Box fullWidth sx={{ p: '24px', display: 'flex' }}>
            <Typography variant='title'> {client?.user?.first_name + ' ' + client?.user?.last_name} - {client?.isCompany ? 'Empresarial' : 'Particular'} </Typography>
            <Box sx={{ marginLeft: 'auto' }}>
              <Box>
                <Buttons buttons={[
                  {
                    text: 'Editar',
                    hidden: !canEditClient,
                    href: editRoute + client?.id,
                    icon: <Edit2 strokeWidth='1' size={20} />,
                    color: 'primary'
                  },
                  {
                    text: 'Apagar',
                    hidden: !canDeleteClient,
                    icon: <Trash strokeWidth='1' size={20} />,
                    onClick: () => setDialogOpen(true),
                    color: 'error',
                    light: true
                  },
                ]} />
              </Box>
            </Box>
          </Box>
          <Grid id='clientPanel' container sx={{ padding: '24px' }}>
            <Grid item xs={12} md={6} sm={6}>
              <Grid container spacing={3} >
                <Grid container item>
                  <Typography id='align' item color='lightTextSm.main'>
                    <User
                      strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
                      size={pageProps?.globalVars?.iconSize || 20}
                    />
                    <Box pl={1}>Dados Gerais</Box>
                  </Typography>
                </Grid>
                <Grid container item>
                  {/* <Grid item md={6} sm={6} xs={12} pb={1} pt={1}>
                    <Typography item variant="subtitle2"color='lightTextSm.main'>Nome Utilizador</Typography>
                    <Typography item variant="subtitle2"color='lightTextSm.black' >{client?.user?.username}</Typography>
                  </Grid> */}
                  <Grid item md={6} sm={6} xs={6} pb={1} pt={1}>
                    <Typography item variant="subtitle2"color='lightTextSm.main'>Primeiro Nome</Typography>
                    <Typography item variant="subtitle2"color='lightTextSm.black' >{client?.user?.first_name}</Typography>
                  </Grid>
                  <Grid item md={6} sm={6} xs={6} pb={1} pt={1}>
                    <Typography item variant="subtitle2"color='lightTextSm.main'>Último Nome</Typography>
                    <Typography item variant="subtitle2"color='lightTextSm.black' >{client?.user?.last_name}</Typography>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12} pb={1} pt={1} sx={{ overflow: 'hidden' }}>
                    <Typography item variant="subtitle2"color='lightTextSm.main'>Email</Typography>
                    <Typography item variant="subtitle2"color='lightTextSm.black' >{client?.user?.email}</Typography>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <Grid container p={2} bgcolor={'lightGray.main'} className={styles.clientContainer}>
                <Grid container item p={1}>
                  <Grid container item xs={12}>
                    <Typography id='align' variant="subtitle1" color='lightTextSm.main'>
                      <Map
                        strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
                        size={pageProps?.globalVars?.iconSize || 20}
                      />
                      <Box pl={1}>Morada</Box>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container p={1}>
                  <Grid container md={12} sm={12} xs={12} >
                    {/* Headers */}
                    <Grid container md={12} sm={12} xs={12} sx={{ borderBottom: '1px solid', p: 0.5, borderColor: 'divider' }}>
                      {/* <Grid {...tableFirstCell} sx={{ border: 'none' }}>Morada</Grid> */}
                      {/* <Grid {...tablemiddleCell} sx={{ border: 'none' }}><Typography item variant="subtitle2"color='lightTextSm.main'></Typography>Principal</Grid> */}
                      {/* <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.main'></Typography>Entrega</Grid> */}
                    </Grid>
                    {/* Postal Code */}
                    <Grid container md={12} sm={12} xs={12}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>Código Postal</Typography></Grid>
                      <Grid {...tablemiddleCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{client.address?.postalCode}</Typography></Grid>
                      {/* <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{client.delivery_address?.postalCode}</Typography></Grid> */}
                    </Grid>
                    {/* Street */}
                    <Grid container md={12} sm={12} xs={12}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>Rua</Typography></Grid>
                      <Grid {...tablemiddleCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{client.address?.streetAddress}</Typography></Grid>
                      {/* <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{client.delivery_address?.streetAddress}</Typography></Grid> */}
                    </Grid>
                    {/* addressLocality */}
                    <Grid container md={12} sm={12} xs={12}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>Localidade</Typography></Grid>
                      <Grid {...tablemiddleCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{client.address?.addressLocality}</Typography></Grid>
                      {/* <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{client.delivery_address?.addressLocality}</Typography></Grid> */}
                    </Grid>
                    {/* addressRegion */}
                    <Grid container md={12} sm={12} xs={12}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>Região</Typography></Grid>
                      <Grid {...tablemiddleCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{client.address?.addressRegion}</Typography></Grid>
                      {/* <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{client.delivery_address?.addressRegion}</Typography></Grid> */}
                    </Grid>
                    {/* addressCountry */}
                    <Grid container md={12} sm={12} xs={12} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>País</Typography></Grid>
                      <Grid {...tablemiddleCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{reduxState?.countries?.data?.find(ele => ele.cca2 === client.address?.addressCountry).name.common}</Typography></Grid>
                      {/* <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{reduxState?.countries?.data?.find(ele => ele.cca2 === client.delivery_address?.addressCountry).name.common}</Typography></Grid> */}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Grid>
      <Footer/>
    </>
  );
};

EditClient.propTypes = {
  breadcrumbsPath: PropTypes.array.isRequired,
  client: PropTypes.object.isRequired,
  editRoute: PropTypes.string,
  pageProps: PropTypes.any,
};

export default EditClient;
