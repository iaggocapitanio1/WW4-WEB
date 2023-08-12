/* eslint-disable react/prop-types */
//  Nodes
import { Box, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { Map, User } from 'lucide-react';
import React, { useState } from 'react';
import CustomBreadcrumbs from '../../breadcrumbs';
import Content from '../../content/content';
//  Proptypes
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Navbar from '../../layout/navbar/navbar';
//  Styles
import { QRCodeCanvas } from 'qrcode.react';
import styles from '../../../styles/NewOrder.module.css';
import Footer from '../../layout/footer/footer';

const Account = ({ ...props }) => {
  const { user, breadcrumbsPath, owner, pageProps } = props;
  const reduxState = useSelector((state) => state);

  console.log(owner);

  const tableFirstCell = {
    container: true,
    sx: { borderLeft: '1px solid', borderRight: '1px solid', borderColor: 'divider' },
    md: 4,
    sm: 4,
    xs: 4,
    p: 0.5
  };

  const tablemiddleCell = {
    container: true,
    md: 8,
    sm: 8,
    xs: 8,
    p: 0.5,
    sx: { borderRight: '1px solid ', borderColor: 'divider' }
  };

  const downloadQRCode = (e) => {
    e.preventDefault();
    setUrl('');
  };

  const qrCodeEncoder = (e) => {
    setUrl(e.target.value);
  };

  const [url, setUrl] = useState('');

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={url}
      size={300}
      bgColor={'blue'}
      level={'H'}
    />
  );

  return (
    <>
      <Box display='none'>
        <div className="qrcode__container">
          <div>{qrcode}</div>
          <div className="input__group">
            <form onSubmit={downloadQRCode}>
              <label>Enter URL</label>
              <textarea
                type="text"
                value={url}
                onChange={qrCodeEncoder}
                placeholder="https://hackernoon.com"
              />
              <button type="submit" disabled={!url}>
            Download QR code
              </button>
            </form>
          </div>
        </div>
      </Box>

      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
        <CssBaseline />
        <CustomBreadcrumbs path={breadcrumbsPath} />
        <Content>
          <Box fullWidth sx={{ p: '24px', display: 'flex', alignItems: 'center' }}>
            <Typography variant='title'>{breadcrumbsPath[0].title}</Typography>
          </Box>
          <Grid id='clientPanel' container sx={{ padding: '24px' }}>
            <Grid item xs={12} md={6} sm={6}>
              <Grid container spacing={3} >
                <Grid container item>
                  <Typography id='align' item color='lightTextSm.main'><User
                    strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
                    size={pageProps?.globalVars?.iconSize || 20}
                  />
                  <Box pl={1}>Dados Gerais</Box>
                  </Typography>
                </Grid>
                <Grid container item>
                  {/* <Grid item md={6} sm={6} xs={12} pb={1} pt={1}>
                    <Typography item variant="subtitle2"color='lightTextSm.main'>Nome Utilizador</Typography>
                    <Typography item variant="subtitle2"color='lightTextSm.black' >{user?.user?.username}</Typography>
                  </Grid> */}
                  <Grid item md={6} sm={6} xs={12} pb={1} pt={1}>
                    <Typography item variant="subtitle2"color='lightTextSm.main'>Primeiro Nome</Typography>
                    <Typography item variant="subtitle2"color='lightTextSm.black' >{user?.first_name}</Typography>
                  </Grid>
                  <Grid item md={6} sm={6} xs={12} pb={1} pt={1}>
                    <Typography item variant="subtitle2"color='lightTextSm.main'>Último Nome</Typography>
                    <Typography item variant="subtitle2"color='lightTextSm.black' >{user?.last_name}</Typography>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12} pb={1} pt={1} sx={{ overflow: 'hidden' }}>
                    <Typography item variant="subtitle2"color='lightTextSm.main'>Email</Typography>
                    <Typography item variant="subtitle2"color='lightTextSm.black' >{user?.email}</Typography>
                  </Grid>
                  {/* <Grid item md={6} sm={6} xs={12} pb={1} pt={1} display={user?.role !== 'CUSTOMER' && 'none'}>
                    <Typography item variant="subtitle2"color='lightTextSm.main'>Tipo cliente </Typography>
                    <Typography item variant="subtitle2"color='lightTextSm.black' >{owner?.isCompany?.value ? 'Empresarial' : 'Particular'}</Typography>
                  </Grid> */}
                  {/* <Grid item xs={6} md={6} sm={6}>
                    <Typography item variant="subtitle2"color='lightTextSm.main'>Observações </Typography>
                    <Typography item variant="subtitle2"color='lightTextSm.black' >{user?.obs?.value}</Typography>
                  </Grid> */}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} sm={12} display={user?.role !== 'CUSTOMER' && 'none'}>
              <Grid container p={2} bgcolor={'lightGray.main'} className={styles.clientContainer}>
                <Grid container item p={1}>
                  <Grid container item xs={12}>
                    <Typography id='align' variant='subtitle1' color='lightTextSm.main'>
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
                      {/* <Grid {...tableFirstCell} sx={{ border: 'none' }}>Morada</Grid>
                      <Grid {...tablemiddleCell}><Typography item variant="subtitle2"color='lightTextSm.main'></Typography>Principal</Grid>
                      <Grid {...tableLastCell} sx={{ border: 'none' }}><Typography item variant="subtitle2"color='lightTextSm.main'></Typography>Entrega</Grid> */}
                    </Grid>
                    {/* Postal Code */}
                    <Grid container md={12} sm={12} xs={12}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>Código Postal</Typography></Grid>
                      <Grid {...tablemiddleCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{owner?.address?.value?.postalCode}</Typography></Grid>
                      {/* <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{owner?.delivery_address?.value?.postalCode}</Typography></Grid> */}
                    </Grid>
                    {/* Street */}
                    <Grid container md={12} sm={12} xs={12}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>Rua</Typography></Grid>
                      <Grid {...tablemiddleCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{owner?.address?.value?.streetAddress}</Typography></Grid>
                      {/* <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{owner?.delivery_address?.value?.streetAddress}</Typography></Grid> */}
                    </Grid>
                    {/* addressLocality */}
                    <Grid container md={12} sm={12} xs={12}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>Localidade</Typography></Grid>
                      <Grid {...tablemiddleCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{owner?.address?.value?.addressLocality}</Typography></Grid>
                      {/* <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{owner?.delivery_address?.value?.addressLocality}</Typography></Grid> */}
                    </Grid>
                    {/* addressRegion */}
                    <Grid container md={12} sm={12} xs={12}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>Região</Typography></Grid>
                      <Grid {...tablemiddleCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{owner?.address?.value?.addressRegion}</Typography></Grid>
                      {/* <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{owner?.delivery_address?.value?.addressRegion}</Typography></Grid> */}
                    </Grid>
                    {/* addressCountry */}
                    <Grid container md={12} sm={12} xs={12} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>País</Typography></Grid>
                      <Grid {...tablemiddleCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{reduxState.countries.data?.find(ele => ele.cca2 === owner?.address?.value?.addressCountry)?.name?.common}</Typography></Grid>
                      {/* <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{reduxState.countries.data?.find(ele => ele.cca2 === owner?.delivery_address?.value?.addressCountry)?.name?.common}</Typography></Grid> */}
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

Account.propTypes = {
  user: PropTypes.object,
  breadcrumbsPath: PropTypes.object
};

export default Account;
