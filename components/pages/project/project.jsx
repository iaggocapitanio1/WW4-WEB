/* eslint-disable no-constant-condition */
/* eslint-disable react/no-unknown-property */
//  Nodes
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import routes from '../../../navigation/routes';
import stylesMessage from '../../../styles/Messages.module.css';
import styles from '../../../styles/Order.module.css';
import CustomBreadcrumbs from '../../breadcrumbs';
import Content from '../../content/content';
import Notification from '../../dialogs/Notification';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';
import Docs from './sections/Docs';
import DocsClient from './sections/DocsClient';
import Head from './sections/Head';
import Messages from './sections/Messages';
import Production from './sections/Production';
import Products from './sections/Products';
import ProductsObservations from './sections/ProductsObservations';

const Order = ({ ...props }) => {
  const { breadcrumbsPath } = props;
  const [order, setOrder] = useState(props.order);
  const path = useRouter();
  const isInternalPage = Object.values(routes.private.internal).includes(path.route.replace('[Id]', ''));

  return (
    <>
      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem', height: '100%' }}>
        <CssBaseline />
        <Notification />
        <CustomBreadcrumbs path={breadcrumbsPath} />
        {/* Page Header */}
        <Content >
          <Head {...props} order={order} setOrder={setOrder} isInternalPage={isInternalPage} />
        </Content>
        {/* Products */}
        <Content>
          <Products open={isInternalPage} styles={styles} {...props} />
        </Content>
        {/* Products */}
        <Content>
          <ProductsObservations open={isInternalPage} styles={styles} {...props} />
        </Content>
        {/* Production per furniture */}
        <Content>
          <Production {...props} open={isInternalPage && order.status.value !== 'drawing' && order.startedProduction?.value} />
        </Content>
        {/* Docs */}
        <Content>
          <Docs open={isInternalPage && CanDo('list_file')} styles={styles} {...props} />
        </Content>
        {/* Messages */}
        <Content>
          <Messages open={CanDo('list_message')} stylesMessage={stylesMessage} {...props} />
        </Content>
        {/* Docs Client */}
        <Content >
          <DocsClient open={CanDo('list_file')} styles={styles} {...props} isInternalPage={isInternalPage} />
        </Content>
      </Grid >
      <Footer />
    </>
  );
};

Order.propTypes = {
  breadcrumbsPath: PropTypes.array,
  order: PropTypes.object,
};

export default Order;
