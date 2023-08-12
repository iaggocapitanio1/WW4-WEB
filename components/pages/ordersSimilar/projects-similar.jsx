/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
//  Nodes
import CssBaseline from '@mui/material/CssBaseline';
import React, { useState } from 'react';

import PropTypes from 'prop-types';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Tooltip, Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import CustomBreadcrumbs from '../../breadcrumbs';
import Content from '../../content/content';

import moment from 'moment';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import FilterPopUp from './FilterPopup';

const ProjectsSimilarScreen = ({ ...props }) => {
  const {
    breadcrumbsPath,
    projects,
  } = props;

  // Filters States
  const [anchorEl, setAnchorEl] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState();
  const [fullScreenFilters, setFullScreenFilters] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const cellPropsLabel = {
    sm: 12 / 10,
    md: 12 / 10,
    xs: 12 / 10,
    container: true,
    alignItems: 'center',
    p: 2,
  };

  const cellProps = {
    sm: 12 / 10,
    md: 12 / 10,
    xs: 12 / 10,
    container: true,
    alignItems: 'center',
    pl: 2,
    pr: 2,
  };

  const toggleValueInArray = (value, array) => {
    const index = array.indexOf(value);

    if (index === -1) {
      return [...array, value];
    }

    return [...array.slice(0, index), ...array.slice(index + 1)];
  };

  const [expandedGroups, setExpandedGroups] = useState([]);

  const handleChange = (expandedGroups, setExpandedGroups) => (panel) => {
    setExpandedGroups((prevExpandedGroups) =>
      toggleValueInArray(panel, prevExpandedGroups)
    );
  };

  const handlePanelChange = handleChange(expandedGroups, setExpandedGroups);

  const filteredArray = projects.filter((ele) => {
    const filtersKeys = Object.keys(appliedFilters || {});

    if (filtersKeys.length === 0) {
      return true; // Return true to keep the element when there are no filters applied
    }

    // Check if all non-empty filter values match the corresponding values in the element
    return filtersKeys.every((key) => {
      const filterValue = appliedFilters[key];

      if (typeof filterValue === 'object') {
        // Handle the object filters
        const elementValue = ele[key];

        if (filterValue.value === '') {
          return true; // Skip filtering for empty filter values
        }

        const operator = filterValue.operator.toLowerCase();
        const filterDate = moment(filterValue.value, 'DD/MM/YYYY');

        if (moment(elementValue, 'DD/MM/YYYY').isValid()) {
          const elementDate = moment(elementValue, 'DD/MM/YYYY');

          if (operator === 'bigger') {
            return elementDate.isAfter(filterDate);
          } else if (operator === 'smaller') {
            return elementDate.isBefore(filterDate);
          } else if (operator === 'equal') {
            return elementDate.isSame(filterDate, 'day');
          }
        }

        // Compare other values using the specified operator
        if (operator === 'bigger') {
          return elementValue > filterValue.value;
        } else if (operator === 'smaller') {
          return elementValue < filterValue.value;
        } else if (operator === 'equal') {
          return elementValue === filterValue.value;
        }

        return true; // Return true if the operator is not recognized
      }

      // Skip filtering for empty filter values
      if (filterValue === '') {
        return true;
      }

      // Check if the element has the filter key and the value matches
      // eslint-disable-next-line no-prototype-builtins
      return ele.hasOwnProperty(key) && ele[key].toLowerCase().includes(filterValue.toLowerCase());
    });
  });

  return (
    <>
      <FilterPopUp fullScreen={fullScreenFilters} setAppliedFilters={setAppliedFilters} open={anchorEl} onClose={() => setAnchorEl(null)} {...props} />
      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
        <CssBaseline />
        {/* Breadcrumbs */}
        <CustomBreadcrumbs path={breadcrumbsPath} />
        {/* Orders */}
        <Content>
          <Box id='pad' className='flex' style={{ alignItems: 'center' }}>
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
              <Box>
                <Typography variant='title' >{breadcrumbsPath[0].title}</Typography>
              </Box>
            </Box>
            <Box
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--grayTexts)',
                fontSize: 'small',
              }}
            >
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box display={{ lg: 'flex', md: 'flex', sm: 'none', xs: 'none' }} style={{ marginLeft: 'auto', alignItems: 'center' }}>
                <IconButton onClick={(e) => { setFullScreenFilters(false); handleClick(e); }}>
                  <Filter />
                </IconButton>
              </Box>
              <Box display={{ lg: 'none', md: 'none', sm: 'flex', xs: 'flex' }} style={{ marginLeft: 'auto', alignItems: 'center' }}>
                <IconButton onClick={(e) => { setFullScreenFilters(true); handleClick(e); }}>
                  <Filter />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Grid container md={12} sm={12} xs={12} sx={{ padding: 0, overflow: 'scroll', pb: 0 }}>
            <Grid container md={12} sm={12} xs={12} sx={{ minWidth: '1024px', height: 'fit-content' }}>
              <Grid container md={12} sm={12} xs={12} bgcolor={'primary.main'} color='white'>
                <Grid {...cellPropsLabel}><Typography variant='subtitle2'>Cliente</Typography></Grid>
                <Grid {...cellPropsLabel}><Typography variant='subtitle2'>Nome</Typography></Grid>
                <Grid {...cellPropsLabel}><Typography variant='subtitle2'>Num</Typography></Grid>
                <Grid {...cellPropsLabel}><Typography variant='subtitle2'>Previsto</Typography></Grid>
                <Grid {...cellPropsLabel}><Typography variant='subtitle2'>Realizado</Typography></Grid>
                <Grid {...cellPropsLabel}><Typography variant='subtitle2'>Qtd. Móveis</Typography></Grid>
                <Grid {...cellPropsLabel}><Typography variant='subtitle2'>Início</Typography> </Grid>
                <Grid {...cellPropsLabel}><Typography variant='subtitle2'>Fim </Typography> </Grid>
                <Grid {...cellPropsLabel}><Typography variant='subtitle2'>Desvio</Typography> </Grid>
                <Grid {...cellPropsLabel}justifyContent={'end'}><Typography variant='subtitle2'>Móveis</Typography></Grid>
              </Grid>
              {filteredArray
                .map((proj, index) => {
                  return <>
                    <Accordion
                      expanded={expandedGroups.includes(proj.id)}
                      onChange={() => handlePanelChange(proj.id)}
                      sx={{ width: '100%' }}>
                      <AccordionSummary sx={{ padding: 0 }} aria-controls="panel1d-content" id="panel1d-header"
                        bgcolor={index % 2 !== 0 && 'lightGray.edges'}
                      >
                        <Grid container md={12} sm={12} xs={12} alignItems={'center'}>
                          <Grid {...cellProps}><Typography variant='subtitle2'> {proj.ClienteLabel}</Typography></Grid>
                          <Grid {...cellProps}><Typography variant='subtitle2'> {proj.Nome}</Typography></Grid>
                          <Grid {...cellProps}><Typography variant='subtitle2'> {proj.Número}</Typography></Grid>
                          <Grid {...cellProps}><Typography variant='subtitle2'> {proj.Previsto}</Typography></Grid>
                          <Grid {...cellProps}><Typography variant='subtitle2'> {proj.Realizado}</Typography></Grid>
                          <Grid {...cellProps}><Typography variant='subtitle2'> {proj.Quantidade}</Typography></Grid>
                          <Grid {...cellProps}><Typography variant='subtitle2'> {proj.begin.value}</Typography> </Grid>
                          <Grid {...cellProps}><Typography variant='subtitle2'> {proj.Fim}</Typography> </Grid>
                          <Grid {...cellProps}><Typography variant='sm' className={proj.Desvio.includes('-') ? 'errorBalloon' : 'successBalloon'}> {proj.desvio}</Typography></Grid>
                          <Grid {...cellProps} onClick={() => {}} justifyContent={'end'} sx={{ cursor: 'pointer' }}>
                            <Tooltip title={expandedGroups.includes(proj.id) ? 'Fechar Móveis' : 'Mostrar Móveis'}>
                              <IconButton> {expandedGroups.includes(proj.id) ? <ChevronUp /> : <ChevronDown /> } </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ width: '100%' }}>
                          {/* <Divider sx={{ marginTop: '1rem', marginBottom: '1rem', borderBottomWidth: 2 }} /> */}
                        </Box>
                        <Grid container md={12} sm={12} xs={12} sx={{ borderBottom: '1px solid', borderTop: '1px solid', borderColor: 'divider' }} >
                          <Grid {...cellPropsLabel} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Móvel</Typography> </Box></Grid>
                          <Grid {...cellPropsLabel} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Quantidade</Typography> </Box></Grid>
                          <Grid {...cellPropsLabel} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Início Prod.</Typography> </Box></Grid>
                          <Grid {...cellPropsLabel} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Fim Prod.</Typography> </Box></Grid>
                          <Grid {...cellPropsLabel} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Início Mont.</Typography> </Box></Grid>
                          <Grid {...cellPropsLabel} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Fim Mont.</Typography> </Box></Grid>
                          <Grid {...cellPropsLabel} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Início Emb.</Typography>  </Box></Grid>
                          <Grid {...cellPropsLabel} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Fim Emb.</Typography>  </Box></Grid>
                          <Grid {...cellPropsLabel} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Valor total</Typography> </Box></Grid>
                          <Grid {...cellPropsLabel}><Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Valor por móvel</Typography></Grid>
                        </Grid>
                        {proj.furnitures?.map((furni, index) => {
                          return <Grid key={furni.id} container md={12} sm={12} xs={12} bgcolor={index % 2 !== 0 && 'lightGray.edges'}>
                            <Grid {...cellPropsLabel}><Typography variant='sm'>{furni.name.value}</Typography></Grid>
                            <Grid {...cellPropsLabel}><Typography variant='sm'>{furni.amount.value}</Typography></Grid>
                            <Grid {...cellPropsLabel}><Typography variant='sm'>{furni.beginProd?.value}</Typography></Grid>
                            <Grid {...cellPropsLabel}><Typography variant='sm'>{furni.endProd?.value}</Typography></Grid>
                            <Grid {...cellPropsLabel}><Typography variant='sm'>{furni.beginAssembly?.value || moment(furni.endProd?.value, 'DD/MM/YYYY HH:mm').add(1, 'day').format('DD/MM/YYYY HH:mm')}</Typography></Grid>
                            <Grid {...cellPropsLabel}><Typography variant='sm'>{furni.endAssembly?.value || moment(furni.endProd?.value, 'DD/MM/YYYY HH:mm').add(2, 'day').format('DD/MM/YYYY HH:mm')}</Typography></Grid>
                            <Grid {...cellPropsLabel}><Typography variant='sm'>{furni.beginPackaging?.value || moment(furni.endProd?.value, 'DD/MM/YYYY HH:mm').add(3, 'day').format('DD/MM/YYYY HH:mm')}</Typography></Grid>
                            <Grid {...cellPropsLabel}><Typography variant='sm'>{furni.endPackaging?.value || moment(furni.endProd?.value, 'DD/MM/YYYY HH:mm').add(4, 'day').format('DD/MM/YYYY HH:mm')}</Typography></Grid>
                            <Grid {...cellPropsLabel}><Typography variant='sm'>{furni.price?.value || '0€'}</Typography></Grid>
                            <Grid {...cellPropsLabel}><Typography variant='sm'>{furni.price?.value ? Number(parseInt(furni?.price?.value) / furni?.amount?.value).toFixed(2) + '€' : '0€'} </Typography></Grid>
                          </Grid>;
                        })}
                      </AccordionDetails>
                    </Accordion>
                  </>;
                })}
            </Grid>
          </Grid>
        </Content>
      </Grid>
      <Footer/>
    </>
  );
};

ProjectsSimilarScreen.propTypes = {
  projects: PropTypes.array,
  clients: PropTypes.array,
  products: PropTypes.arrayOf(PropTypes.object),
  breadcrumbsPath: PropTypes.arrayOf(PropTypes.object),
  pageProps: PropTypes.object,
};

export default ProjectsSimilarScreen;
