/* eslint-disable react/prop-types */
//  Nodes
import { Box, Tab, Tabs } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import '@tremor/react/dist/esm/tremor.css';
import React, { useState } from 'react';
import CustomBreadcrumbs from '../../breadcrumbs';
import Content from '../../content/content';
import Navbar from '../../layout/navbar/navbar';
import TabPanel from './TabPanel';
import PagesAccessTab from './tabs/PagesAccessTab';
import PermissionsTab from './tabs/PermissionsTab';

const OrdersScreen = ({ ...props }) => {
  const { breadcrumbsPath } = props;
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps (index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }} >        {/* Breadcrumbs */}
        <CssBaseline />
        <CustomBreadcrumbs path={breadcrumbsPath} />
        <Grid container md={12} sm={12} xs={12}>
          <Grid container md={2} sm={3} xs={12} pr={1}>
            <Box sx={{ width: '100%' }}>
              <Content>
                <Box>
                  <Tabs value={value} onChange={handleChange} orientation="vertical">
                    <Tab indicatorColor={''} label="Recursos de permissões" {...a11yProps(0)} />
                    <Tab indicatorColor={''} label="Acessos de permissões" {...a11yProps(1)} />
                  </Tabs>
                </Box>
              </Content>
            </Box>
          </Grid>
          <Grid container md={10} sm={9} xs={12} pl={1}>
            <Box sx={{ width: '100%', overflowY: 'scroll', height: '80vh' }}>
              <TabPanel value={value} index={0}>
                <PermissionsTab {...props} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <PagesAccessTab {...props} />
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default OrdersScreen;
