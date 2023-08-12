/* eslint-disable react/prop-types */
//  Nodes
import CssBaseline from '@mui/material/CssBaseline';
import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import { PackagePlus, Save, X } from 'lucide-react';
import CustomBreadcrumbs from '../../breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';

import { Box, ButtonGroup, Divider, Tooltip } from '@mui/material';
import Router from 'next/router';
import routes from '../../../navigation/routes';
import styles from '../../../styles/StockDetail.module.css';
import MyInput from '../../inputs/myInput';
import Navbar from '../../layout/navbar/navbar';

const EditStock = ({ ...props }) => {
  const { stock, breadcrumbsPath, pageProps } = props;
  const [newStock, setNewStock] = useState(props.stock);

  function OnFieldChange (props) {
    setNewStock({ ...newStock, [props.target.name]: props.target.value });
  }

  return (
    <>

      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }} >
        <CssBaseline />
        <CustomBreadcrumbs path={breadcrumbsPath} />
        <Content>
          <Box
            id='pad'
            className='flex'
            alignItems={'center'}
            justifyContent='space-between'
          >
            <Box id='align'>
              <a className='headerTitleXl'>{stock?.material}</a>
              <Box className='spacer' />
              <Tooltip title={`${stock?.qtd} unidade(s)`}>

                {stock?.qtd > 0
                  ? <a className="successBalloon">Disponível</a>
                  : <a className="errorBalloon">Indisponível</a>}
              </Tooltip>
            </Box>

            <ButtonGroup>
              <PrimaryBtn
                text='Guardar'
                icon={
                  <Save
                    strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                    size={pageProps?.globalVars?.iconSize || 20}
                  />
                }
                onClick={() => Router.push(routes.private.internal.stock + stock.id)}
              />
              <PrimaryBtn
                text='Cancelar'
                icon={
                  <X
                    strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                    size={pageProps?.globalVars?.iconSize || 20}
                  />
                }
                light
                onClick={() => Router.back()}
              />
            </ButtonGroup>
          </Box>
          <Grid container id='pad' className='flex'>
            {/* Product Info panels */}
            <Grid container md={6} xs={12}>
              <Grid container md={6} xs={6} p={0.5}>
                <Grid item xs={12}>
                  <MyInput onChange={(e) => OnFieldChange(e)} name='material' label={'Material'} value={newStock?.material} />
                </Grid>
              </Grid>
              <Grid container md={6} xs={6} p={0.5}>
                <Grid item xs={12}>
                  <MyInput onChange={(e) => OnFieldChange(e)} name='qtd' label={'Quantidade disponível'} value={newStock?.qtd} type='number' />
                </Grid>
              </Grid>
              <Grid container md={6} xs={6} p={0.5}>
                <Grid item xs={12}>
                  <MyInput onChange={(e) => OnFieldChange(e)} name='warehouse' label={'Armazém'} value={newStock?.warehouse} />
                </Grid>
              </Grid>
              <Grid container md={6} xs={6} p={0.5}>
                <Grid item xs={12}>
                  <MyInput onChange={(e) => OnFieldChange(e)} name='comp' label={'Comprimento'} value={newStock?.comp} type='number'/>
                </Grid>
              </Grid>
              <Grid container md={6} xs={6} p={0.5}>
                <Grid item xs={12}>
                  <MyInput onChange={(e) => OnFieldChange(e)} name='larg' label={'Largura'} value={newStock?.larg} type='number'/>
                </Grid>
              </Grid>
              <Grid container md={6} xs={6} p={0.5}>
                <Grid item xs={12}>
                  <MyInput onChange={(e) => OnFieldChange(e)} name='esp' label={'Espessura'} value={newStock?.esp} type='number'/>
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
                    <MyInput label={'Lorem Ipsum'} />
                  </Grid>
                </Grid>
                <Grid container item md={6} sm={6} xs={12} p={1}>
                  <Grid item xs={12}>
                    <MyInput label={'Lorem Ipsum'} />
                  </Grid>
                </Grid>
                <Grid md={12}>
                  <Divider />
                </Grid>
                <Grid container item md={6} sm={6} xs={12} p={1}>
                  <Grid item xs={12}>
                    <MyInput label={'Lorem Ipsum'} />
                  </Grid>
                </Grid>
                <Grid container item md={6} sm={6} xs={12} p={1}>
                  <Grid item xs={12}>
                    <MyInput label={'Lorem Ipsum'} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Grid></>
  );
};

export default EditStock;
