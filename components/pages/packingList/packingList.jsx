/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import { Box, ButtonGroup, Card, CardActions, CardContent, Grid, Grow, Tooltip, Typography } from '@mui/material';
import React from 'react';

import { Calendar, List, Plus } from 'lucide-react';
import Router from 'next/router';
import routes from '../../../navigation/routes';
import CustomBreadcrumbs from '../../breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';
import Link from 'next/link';

const PackingList = ({ ...props }) => {
  const { breadcrumbsPath, projects } = props;
  const hasPermissions = CanDo('add_package');

  return <>
    <Navbar />
    <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
      <CustomBreadcrumbs path={breadcrumbsPath} />
      <Grid container md={12} pt={4} >
        <Grid container md={12} p={1} >
          <Typography variant='title'>Embalamentos</Typography>
        </Grid>
        <Grid container md={12} pl={1} pb={4} >
          <Typography variant='subtitle2'>Escolha um projeto para embalar</Typography>
        </Grid>
        <Grid container md={12} sm={12} xs={12}>
          {projects
            .map((proj, i) => {
              return <>
                { projects[i - 1]?.budget.dateDeliveryProject.value !== proj.budget.dateDeliveryProject.value && <Grid container md={12} sm={12} xs={12} alignItems={'center'}>
                  <Box container md={12} sm={12} xs={12} color='lightTextSm.main'>
                    <Calendar strokeWidth={1.5} />
                  </Box>
                  <Typography variant="h5" textAlign={'center'} pl={1}>{proj.budget.dateDeliveryProject.value}</Typography>
                </Grid>}
                <Grid
                  container
                  md={6}
                  sm={12}
                  xs={12}
                  sx={{ p: 1 }}>
                  <Grow in>
                    <Box>
                      {hasPermissions
                        ? <Link href={routes.private.internal.newPackage + proj.id} >
                          <Card sx={{ cursor: 'pointer', width: '100%', p: 2 }} >
                            <CardContent onClick={() => {
                              hasPermissions && Router.push(routes.private.internal.newPackage + proj.id);
                            // Router.push(routes.private.internal.projectPackages + proj.id);
                            }}>
                              <Grid container md={12} sm={12} xs={12} >
                                <Grid container md={6} sm={6} xs={6} >
                                  <Tooltip title='Projeto'>
                                    <Typography fontWeight={'bold'} variant="h5">
                                      {proj.name.value}
                                    </Typography>
                                  </Tooltip>
                                </Grid>
                                <Grid container md={6} sm={6} xs={6} justifyContent={'end'} >
                                  <Tooltip title='Número'>
                                    <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Número: </a>{proj?.budget.num?.value}</Typography>
                                  </Tooltip>
                                </Grid>
                                <Grid container md={6} sm={6} xs={6} pb={0.5} >
                                  <Tooltip title='Cliente'>
                                    <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Cliente: </a>{proj?.client.user?.first_name} {proj?.client.user?.last_name}</Typography>
                                  </Tooltip>
                                </Grid>
                              </Grid>
                            </CardContent>
                            {false && <CardActions >
                              <ButtonGroup fullWidth >
                                <PrimaryBtn sx={{ minHeight: '50px' }} icon={<List />} text='Embalamentos' onClick={() => {
                                  Router.push(routes.private.internal.projectPackages + proj.id);
                                }}/>
                                <PrimaryBtn sx={{ minHeight: '50px' }} icon={<Plus />} text='Novo' color='success' onClick={() => {
                                  Router.push(routes.private.internal.newPackage + proj.id);
                                }}/>
                              </ButtonGroup>
                            </CardActions>}
                          </Card>
                        </Link>
                        : <Card sx={{ width: '100%', p: 2 }} >
                          <CardContent>
                            <Grid container md={12} sm={12} xs={12} >
                              <Grid container md={6} sm={6} xs={6} >
                                <Tooltip title='Projeto'>
                                  <Typography fontWeight={'bold'} variant="h5">
                                    {proj.name.value}
                                  </Typography>
                                </Tooltip>
                              </Grid>
                              <Grid container md={6} sm={6} xs={6} justifyContent={'end'} >
                                <Tooltip title='Número'>
                                  <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Número: </a>{proj?.budget.num?.value}</Typography>
                                </Tooltip>
                              </Grid>
                              <Grid container md={6} sm={6} xs={6} pb={0.5} >
                                <Tooltip title='Cliente'>
                                  <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Cliente: </a>{proj?.client.user?.first_name} {proj?.client.user?.last_name}</Typography>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </CardContent>
                          {false && <CardActions >
                            <ButtonGroup fullWidth >
                              <PrimaryBtn sx={{ minHeight: '50px' }} icon={<List />} text='Embalamentos' onClick={() => {
                                Router.push(routes.private.internal.projectPackages + proj.id);
                              }}/>
                              <PrimaryBtn sx={{ minHeight: '50px' }} icon={<Plus />} text='Novo' color='success' onClick={() => {
                                Router.push(routes.private.internal.newPackage + proj.id);
                              }}/>
                            </ButtonGroup>
                          </CardActions>}
                        </Card> }
                    </Box>

                  </Grow>
                </Grid>
              </>;
            })}
        </Grid>
      </Grid>
    </Grid>
    <Footer/>
  </>;
};

export default PackingList;
