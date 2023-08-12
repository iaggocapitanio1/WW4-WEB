import { CssBaseline, Grid } from '@mui/material';
import React, { useState } from 'react';
import CustomBreadcrumbs from '../../breadcrumbs';
//  PropTypes
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import routes from '../../../navigation/routes';
import stylesMessage from '../../../styles/Messages.module.css';
import styles from '../../../styles/Order.module.css';
import Content from '../../content/content';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import Docs from './sections/Docs';
import DocsClient from './sections/DocsClient';
import Head from './sections/Head';
import Messages from './sections/Messages';
import Products from './sections/Products';
import ProductsObservations from './sections/ProductsObservations';

const BudgetPage = (props) => {
  const { breadcrumbsPath } = props;
  const [refresh, setRefresh] = useState();
  const path = useRouter();
  const isInternalPage = Object.values(routes.private.internal).includes(path.route.replace('[Id]', ''));

  return (
    <>
      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
        <CssBaseline />
        {/* Breadcrumbs */}
        <CustomBreadcrumbs path={breadcrumbsPath} />
        <Content>
          <Head {...props} isInternalPage={isInternalPage}/>
        </Content>
        {/* Products */}
        <Content>
          <Products open={isInternalPage} styles={styles} onNewFolder={setRefresh} {...props} />
        </Content>
        {/* Observations products */}
        <Content>
          <ProductsObservations open={isInternalPage} styles={styles} onNewFolder={setRefresh} {...props} />
        </Content>
        {/* Docs */}
        <Content>
          <Docs open={isInternalPage} styles={styles} onNewFolder={setRefresh} {...props} />
        </Content>
        {/* Messages */}
        <Content>
          <Messages stylesMessage={stylesMessage} {...props} isInternalPage={isInternalPage} />
        </Content>
        {/* Docs Cliente */}
        <Content id={refresh}>
          <DocsClient styles={styles} {...props} isInternalPage={isInternalPage} />
        </Content>
      </Grid>
      <Footer/>
    </>
  );
};

BudgetPage.propTypes = {
  breadcrumbsPath: PropTypes.array
};

export default BudgetPage;
