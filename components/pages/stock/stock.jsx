/* eslint-disable react/prop-types */
//  Nodes
import CssBaseline from '@mui/material/CssBaseline';
import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import { Edit2, PackagePlus, Trash } from 'lucide-react';
import CustomBreadcrumbs from '../../breadcrumbs';
import Content from '../../content/content';

import { Box, Divider, Typography } from '@mui/material';
import Router from 'next/router';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import styles from '../../../styles/StockDetail.module.css';
import Buttons from '../../buttons/Buttons';
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import Notification from '../../dialogs/Notification';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';
import ToastSet from '../../utils/ToastSet';

const Stock = ({ ...props }) => {
  const { stock, breadcrumbsPath } = props;
  const [dialogOpen, setDialogOpen] = useState(false);

  function onDelete () {
    setDialogOpen(false);

    const loading = toast.loading('');

    ToastSet(loading, 'Stock apagado.', 'success');
    Router.push(routes.private.internal.stocks);
  }

  const canEditStock = CanDo('update_stock');
  const canDeleteStock = CanDo('delete_stock');

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
          <Box id='pad'>
            <Grid container md={12} sm={12} xs={12} sx={{ marginBottom: '1rem' }}>
              <Grid container md={6} sm={6} xs={11}>
                <Grid container alignItems={'center'}>
                  <Typography variant='title'>{stock?.material}</Typography>
                  <Box pl={2} >
                    {stock?.qtd > 0
                      ? <a className="successBalloon">Disponível</a>
                      : <a className="errorBalloon">Indisponível</a>}
                  </Box>
                </Grid>
              </Grid>
              <Grid container md={6} sm={6} xs={1} justifyContent='end' >
                <Box>
                  <Buttons buttons={[
                    {
                      text: 'Editar',
                      hidden: !canEditStock,
                      href: routes.private.internal.editStock + stock?.id,
                      icon: <Edit2 strokeWidth='1' size={20} />,
                      color: 'primary'
                    },
                    {
                      text: 'Apagar',
                      hidden: !canDeleteStock,
                      icon: <Trash strokeWidth='1' size={20} />,
                      onClick: () => setDialogOpen(true),
                      color: 'error',
                      light: true
                    },
                  ]} />
                </Box>

              </Grid>
            </Grid>

          </Box>
          <Grid container id='pad' className='flex'>
            {/* Product Info panels */}
            <Grid container md={6} xs={12}>
              <Grid container md={6} xs={6}>
                <Grid item xs={12}>
                  <Typography item color='lightTextSm.main'>Material</Typography>
                  <Typography item color='lightTextSm.black'>{stock?.material.replace(/ /g, '_')}</Typography>
                </Grid>
              </Grid>
              <Grid container md={6} xs={6}>
                <Grid item xs={12}>
                  <Typography item color='lightTextSm.main'>Quantidade disponível</Typography>
                  <Typography item color='lightTextSm.black'>{stock?.qtd}</Typography>
                </Grid>
              </Grid>
              <Grid container md={6} xs={6}>
                <Grid item xs={12}>
                  <Typography item color='lightTextSm.main'>Armazém</Typography>
                  <Typography item color='lightTextSm.black'>{stock?.warehouse}</Typography>
                </Grid>
              </Grid>
              <Grid container md={6} xs={6}>
                <Grid item xs={12}>
                  <Typography item color='lightTextSm.main'>Comprimento</Typography>
                  <Typography item color='lightTextSm.black'>{stock?.comp} mm</Typography>
                </Grid>
              </Grid>
              <Grid container md={6} xs={6}>
                <Grid item xs={12}>
                  <Typography item color='lightTextSm.main'>Largura</Typography>
                  <Typography item color='lightTextSm.black'>{stock?.larg} mm</Typography>
                </Grid>
              </Grid>
              <Grid container md={6} xs={6}>
                <Grid item xs={12}>
                  <Typography item color='lightTextSm.main'>Espessura</Typography>
                  <Typography item color='lightTextSm.black'>{stock?.esp} mm </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* Supplier info panel */}
            <Grid container md={6} xs={12} display='none'>
              <Grid container bgcolor={'lightGray.main'} className={styles.supplierInfoContainer}>
                <Grid container item md={12} p={1} id='align' className='lightTextSm'>
                  <PackagePlus style={{ marginRight: '1rem' }} size={20} />
                Fornecedor(es)
                </Grid>
                <Grid container item md={6} sm={6} xs={12} p={1}>
                  <Grid item xs={12}>
                    <Typography item color='lightTextSm.main'>Lorem Ipsum</Typography>
                    <Typography item color='lightTextSm.black'>Lorem ipsum dolor sit amet, consectetur.</Typography>
                  </Grid>
                </Grid>
                <Grid container item md={6} sm={6} xs={12} p={1}>
                  <Grid item xs={12}>
                    <Typography item color='lightTextSm.main'>Lorem Ipsum</Typography>
                    <Typography item color='lightTextSm.black'>Lorem ipsum dolor sit amet, consectetur.</Typography>
                  </Grid>
                </Grid>
                <Grid md={12}>
                  <Divider />
                </Grid>
                <Grid container item md={6} sm={6} xs={12} p={1}>
                  <Grid item xs={12}>
                    <Typography item color='lightTextSm.main'>Lorem Ipsum</Typography>
                    <Typography item color='lightTextSm.black'>Lorem ipsum dolor sit amet, consectetur.</Typography>
                  </Grid>
                </Grid>
                <Grid container item md={6} sm={6} xs={12} p={1}>
                  <Grid item xs={12}>
                    <Typography item color='lightTextSm.main'>Lorem Ipsum</Typography>
                    <Typography item color='lightTextSm.black'>Lorem ipsum dolor sit amet, consectetur.</Typography>
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

export default Stock;
