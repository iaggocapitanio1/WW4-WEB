/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import { Box, Card, CardContent, Grid, Grow, Tooltip, Typography } from '@mui/material';
import React from 'react';

import { Calendar } from 'lucide-react';
import Link from 'next/link';
import routes from '../../../navigation/routes';
import CustomBreadcrumbs from '../../breadcrumbs';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';

const FactoryGround = ({ ...props }) => {
  const { breadcrumbsPath, projects } = props;
  const hasPermissions = CanDo('see_factory');

  return <>
    <Navbar />

    <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
      <CustomBreadcrumbs path={breadcrumbsPath} />
      <Grid container md={12} pt={4} >
        <Grid container md={12} p={1} pb={4}>
          <Typography variant='title'>Chão de Fábrica</Typography>
        </Grid>
        <Grid container md={12} sm={12} xs={12}>
          {projects
            .map((proj, i) => {
              return <>
                {proj.furnitures.length > 0 && projects[i - 1]?.budget.dateDeliveryProject.value !== proj.budget.dateDeliveryProject.value && <Grid container md={12} sm={12} xs={12} alignItems={'center'}>
                  <Box container md={12} sm={12} xs={12} color='lightTextSm.main'>
                    <Calendar strokeWidth={1.5} />
                  </Box>
                  <Typography variant="h5" textAlign={'center'} pl={1}>{proj.budget.dateDeliveryProject.value}</Typography>
                </Grid>}

                {proj.furnitures?.map((furnit) => {
                  return <Grid key={furnit.id}
                    container
                    md={4}
                    sm={12}
                    xs={12}
                    sx={{ p: 1 }}>
                    <Grow in>
                      <Box>
                        {hasPermissions
                          ? <Link href={routes.private.internal.factory + furnit.id}>
                            <Card sx={{ cursor: 'pointer', width: '100%', p: 2 }} >
                              <CardContent>
                                <Grid container md={12} sm={12} xs={12} >
                                  <Grid container md={12} sm={12} xs={12} >
                                    <Tooltip title='Movel'>
                                      <Typography fontWeight={'bold'} variant="h5">
                                        {furnit.name.value}
                                      </Typography>
                                    </Tooltip>
                                  </Grid>
                                  <Grid container md={6} sm={6} xs={6} pb={0.5} >
                                    <Tooltip title='Cliente'>
                                      <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Cliente: </a>{proj?.client.user?.first_name} {proj?.client.user?.last_name}</Typography>
                                    </Tooltip>
                                  </Grid>
                                  <Grid container md={6} sm={6} xs={6} pb={0.5} justifyContent={'end'}>
                                    <Tooltip title='Projeto'>
                                      <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Projeto: </a>{proj?.name?.value}</Typography>
                                    </Tooltip>
                                  </Grid>
                                  <Grid container md={6} sm={6} xs={6} pb={0.5} >
                                    <Tooltip title='Grupo'>
                                      <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Grupo: </a>{furnit?.group?.value}</Typography>
                                    </Tooltip>
                                  </Grid>
                                  <Grid container md={6} sm={6} xs={6} pb={0.5} justifyContent={'end'}>
                                    <Tooltip title='Subgrupo'>
                                      <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Subgrupo: </a>{furnit?.subGroup?.value || 'cozinha'}</Typography>
                                    </Tooltip>
                                  </Grid>
                                  <Grid container md={6} sm={6} xs={6} pb={0.5} >
                                    <Tooltip title='Quantidade Pedida'>
                                      <Typography variant="subtitle1" color='primary'>
                                Quantidade: {furnit.amount.value}
                                      </Typography>
                                    </Tooltip>
                                  </Grid>
                                  <Grid container md={6} sm={6} xs={6} justifyContent={'end'}>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Link>
                          : <Card sx={{ width: '100%', p: 2 }} >
                            <CardContent>
                              <Grid container md={12} sm={12} xs={12} >
                                <Grid container md={12} sm={12} xs={12} >
                                  <Tooltip title='Movel'>
                                    <Typography fontWeight={'bold'} variant="h5">
                                      {furnit.name.value}
                                    </Typography>
                                  </Tooltip>
                                </Grid>
                                <Grid container md={6} sm={6} xs={6} pb={0.5} >
                                  <Tooltip title='Cliente'>
                                    <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Cliente: </a>{proj?.client.user?.first_name} {proj?.client.user?.last_name}</Typography>
                                  </Tooltip>
                                </Grid>
                                <Grid container md={6} sm={6} xs={6} pb={0.5} justifyContent={'end'}>
                                  <Tooltip title='Projeto'>
                                    <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Projeto: </a>{proj?.name?.value}</Typography>
                                  </Tooltip>
                                </Grid>
                                <Grid container md={6} sm={6} xs={6} pb={0.5} >
                                  <Tooltip title='Grupo'>
                                    <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Grupo: </a>{furnit?.group?.value}</Typography>
                                  </Tooltip>
                                </Grid>
                                <Grid container md={6} sm={6} xs={6} pb={0.5} justifyContent={'end'}>
                                  <Tooltip title='Subgrupo'>
                                    <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Subgrupo: </a>{furnit?.subGroup?.value || 'cozinha'}</Typography>
                                  </Tooltip>
                                </Grid>
                                <Grid container md={6} sm={6} xs={6} pb={0.5} >
                                  <Tooltip title='Quantidade Pedida'>
                                    <Typography variant="subtitle1" color='primary'>
                            Quantidade: {furnit.amount.value}
                                    </Typography>
                                  </Tooltip>
                                </Grid>
                                <Grid container md={6} sm={6} xs={6} justifyContent={'end'}>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>}
                      </Box>
                    </Grow>
                  </Grid>;
                })}
              </>;
            })}
        </Grid>
      </Grid>
    </Grid>
    <Footer/>
  </>;
};

export default FactoryGround;
