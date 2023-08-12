import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Grid, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';

//  PropTypes
import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';
//  Page Component Styles
import styles from '../../../../styles/NewOrder.module.css';

//  Actions
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import moment from 'moment';
import Image from 'next/image';
import MyInput from '../../../inputs/myInput';

const RequestTab = (props) => {
  const {
    budgetData,
    onBudgetChange,
    countries
  } = props;

  const [expanded, setExpanded] = useState(true);
  let portugal = {};

  portugal = countries?.find((option) => option.cca2 === 'PT');

  const keys = Object.keys(budgetData);
  const errors = keys.map((key) => budgetData[key].error);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} sx={{ width: '100%', boxShadow: errors.find(ele => ele) && '0px 0px 4px 1px #d32f2f' }}>
      <AccordionSummary sx={{ background: 'lightGray.main' }} bgcolor={'lightGray.main'} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
        <Typography variant='title' color={errors.find(ele => ele) && 'error'}>Projeto</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid container md={12} sm={12} >
            <Grid bgcolor={'lightGray.main'} className={styles.clientContainer} spacing={1} p={2}>
              {/* <Grid container item sm={12} xs={12} >
                <Grid container md={12}>
                  <Typography id='align' className='headerTitleSm'>
                    <Calendar size={pageProps?.globalVars?.iconSize || 20} strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1} /> Projeto
                  </Typography>
                </Grid>
              </Grid> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container>
                  <Grid container md={6} sm={6} xs={12} p={1}>
                    <MyInput
                      onChange={(e) => onBudgetChange(e.target)}
                      label='Nome'
                      error={budgetData.name.error}
                      required={budgetData.name.required}
                      name='name'
                      paceholder='Escrever nome'
                      value={budgetData.name.value}
                    />
                  </Grid>
                  <Grid container md={6} sm={6} xs={12} p={1}>
                    <MyInput
                      onChange={(e) => onBudgetChange(e.target)}
                      label='Número'
                      error={budgetData.num.error}
                      required={budgetData.num.required}
                      name='num'
                      value={budgetData.num.value}
                    />
                  </Grid>
                  <Divider fullWidth sx={{ width: '100%', marginTop: 1, marginBottom: 1 }} />

                  {/* Date request */}
                  <Grid container md={6} sm={6} xs={12} p={1}>
                    <InputLabel>
                      Data
                      {budgetData.dateRequest.required &&
                        <Tooltip title='Obrigatório' >
                          <span style={{ color: 'var(--red)' }}> *</span>
                        </Tooltip>}
                    </InputLabel>

                    <DesktopDatePicker
                      inputFormat={'DD/MM/YYYY'}
                      maxDate={dayjs().endOf('day')}
                      value={budgetData.dateRequest.value}
                      onChange={(e, newValue) => onBudgetChange({ value: JSON.stringify(e?.$d) === 'null' ? newValue : e?.$d, name: 'dateRequest' })}
                      // onChange={(newValue) => onBudgetChange(newValue)}
                      renderInput={(params) =>
                        <TextField fullWidth {...params} error={budgetData.dateRequest.error} inputProps={{ sx: { color: budgetData.dateRequest.error && 'var(--red)' }, ...params.inputProps, paceholder: budgetData.dateRequest.error || 'DD/MM/YYYY' }}/>}

                    />
                  </Grid>
                  {/* Date agreed delivery */}
                  <Grid container md={6} sm={6} xs={12} p={1}>
                    <InputLabel >
                      Data acordada de entrega de orçamento
                      {budgetData.dateAgreedDelivery.required && <Tooltip title='Obrigatório' >
                        <span style={{ color: 'var(--red)' }}> *</span>
                      </Tooltip>}

                    </InputLabel>
                    <DesktopDatePicker
                      inputFormat={'DD/MM/YYYY'}
                      minDate={dayjs(budgetData.dateRequest.value).endOf('day')}
                      value={budgetData.dateAgreedDelivery.value}
                      onChange={(e, newValue) => onBudgetChange({ value: JSON.stringify(e?.$d) === 'null' ? newValue : e?.$d, name: 'dateAgreedDelivery' })}
                      renderInput={(params) =>
                        <TextField fullWidth {...params} error={budgetData.dateAgreedDelivery.error} inputProps={{ sx: { color: budgetData.dateAgreedDelivery.error && 'var(--red)' }, ...params.inputProps, paceholder: budgetData.dateAgreedDelivery.error || 'DD/MM/YYYY' }}/>}
                    />
                  </Grid>
                  {/* Date budget Delivery */}
                  <Grid container item sm={6} xs={12} p={1}>
                    <InputLabel >
                      Data de entrega do orçamento
                      {budgetData.dateDelivery.required && <Tooltip title='Obrigatório' >
                        <span style={{ color: 'var(--red)' }}> *</span>
                      </Tooltip>}

                    </InputLabel>
                    <DesktopDatePicker
                      inputFormat={'DD/MM/YYYY'}
                      value={budgetData.dateDelivery.value}
                      minDate={dayjs(budgetData.dateRequest.value).endOf('day')}

                      onChange={(e, newValue) => onBudgetChange({ value: JSON.stringify(e?.$d) === 'null' ? newValue : e?.$d, name: 'dateDelivery' })}
                      renderInput={(params) =>
                        <TextField fullWidth {...params} error={budgetData.dateDelivery.error} inputProps={{ sx: { color: budgetData.dateDelivery.error && 'var(--red)' }, ...params.inputProps, paceholder: budgetData.dateDelivery.error || 'DD/MM/YYYY' }}/>}
                    />
                  </Grid>
                  {/* Date agree delivery Project */}
                  <Grid container item sm={6} xs={12} p={1}>
                    <InputLabel >
               Data de entrega de projeto
                      {budgetData.dateDeliveryProject.required && <Tooltip title='Obrigatório' >
                        <span style={{ color: 'var(--red)' }}> *</span>
                      </Tooltip>}

                    </InputLabel>
                    <DesktopDatePicker
                      inputFormat={'DD/MM/YYYY'}
                      minDate={moment.utc().startOf('day')}
                      value={budgetData.dateDeliveryProject.value}
                      onChange={(e, newValue) => onBudgetChange({ value: JSON.stringify(e?.$d) === 'null' ? newValue : e?.$d, name: 'dateDeliveryProject' })}
                      renderInput={(params) =>
                        <TextField fullWidth {...params} error={budgetData.dateDeliveryProject.error} inputProps={{ sx: { color: budgetData.dateDeliveryProject.error && 'var(--red)' }, ...params.inputProps, paceholder: budgetData.dateDeliveryProject.error || 'DD/MM/YYYY' }}/>}
                    />
                  </Grid>
                  <Divider fullWidth sx={{ width: '100%', marginTop: 1, marginBottom: 1 }} />
                  {/* Street */}
                  <Grid container item sm={6} xs={12} p={1} >
                    <MyInput
                      onChange={(e) => onBudgetChange(e.target)}
                      label='Rua'
                      error={budgetData.streetAddress.error}
                      required={budgetData.streetAddress.required}
                      name='streetAddress'
                      paceholder='Escrever rua'
                      value={budgetData.streetAddress.value}
                      maxLength={50}

                    />
                  </Grid>
                  {/* Postal Code */}
                  <Grid container item sm={3} xs={12} p={1} >
                    <MyInput
                      label='Código Postal'
                      required={budgetData.postalCode.required}
                      error={budgetData.postalCode.error}
                      name='postalCode'
                      paceholder='Escrever Código Postal'
                      value={budgetData.postalCode.value}
                      onChange={(e) => onBudgetChange(e.target)}
                      maxLength={15}
                    />
                  </Grid>
                  {/* Locality */}
                  <Grid container item sm={3} xs={12} p={1} >
                    <MyInput
                      label='Localidade'
                      paceholder='Escrever Localidade'
                      required={budgetData.addressLocality.required}
                      error={budgetData.addressLocality.error}
                      name='addressLocality'
                      value={budgetData.addressLocality.value}
                      onChange={(e) => onBudgetChange(e.target)}
                      maxLength={25}

                    />
                  </Grid>
                  {/* Region */}
                  <Grid container item sm={6} xs={12} p={1}>
                    <MyInput
                      label='Região'
                      paceholder='Escrever Região'
                      required={budgetData.addressRegion?.required}
                      error={budgetData.addressRegion.error}
                      name='addressRegion'
                      value={budgetData.addressRegion.value}
                      onChange={(e) => onBudgetChange(e.target)}
                      maxLength={25}
                    />
                  </Grid>
                  {/* Country */}
                  <Grid container item sm={6} xs={12} p={1}>
                    <Box sx={{ width: '100%' }}>
                      <InputLabel htmlFor={budgetData.addressCountry.id} id={budgetData.addressCountry.id}>
                          País
                        {budgetData.addressCountry.required && (
                          <Tooltip title='Obrigatório'>
                            <span style={{ color: 'var(--red)' }}> *</span>
                          </Tooltip>
                        ) }
                      </InputLabel>
                      {!!budgetData.addressCountry.error && <InputLabel error={!!budgetData.addressCountry.error} id={budgetData.addressCountry.id}>{budgetData.addressCountry.error}</InputLabel>}
                      <Select
                        name='addressCountry'
                        paceholder={budgetData.addressCountry.error}
                        label={budgetData.addressCountry.error && budgetData.addressCountry.error}
                        error={!!budgetData.addressCountry.error}
                        required={budgetData.addressCountry.required}
                        select
                        id={budgetData.addressCountry.id}
                        fullWidth={budgetData.addressCountry.fullWidth || false}
                        value={budgetData.addressCountry.value}
                        onChange={(e) => onBudgetChange(e.target)}
                        sx={{ width: budgetData.addressCountry.width && budgetData.addressCountry.width }}
                        style={{ width: '100%' }}
                      >
                        <MenuItem value="" disabled>
            Escolha uma opcao
                        </MenuItem>
                        {portugal && portugal.cca2 === 'PT'
                          ? (
                            <MenuItem value={portugal.cca2}>
                              <Box sx={{ '& > img': { mr: 2, flexShrink: 0 } }}>
                                {!!portugal.cca2 && (
                                  <Image
                                    loading="lazy"
                                    width={20}
                                    height={16}
                                    src={`https://flagcdn.com/w20/${portugal.cca2.toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w40/${portugal.cca2.toLowerCase()}.png 2x`}
                                    alt=""
                                  />
                                )}
                                {portugal.cc2}
                                {portugal?.name?.common}
                              </Box>
                            </MenuItem>
                          )
                          : null}
                        {countries?.filter((item) => item.cca2 !== 'PT').map((opt, i) => (
                          !opt.hidden && <MenuItem key={i} value={opt.cca2}>
                            <Box sx={{ '& > img': { mr: 2, flexShrink: 0 } }} >
                              {!!opt.cca2 &&
                    <img
                      loading='lazy'
                      width='20'
                      src={`https://flagcdn.com/w20/${opt.cca2.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${opt.cca2.toLowerCase()}.png 2x`}
                      alt=''
                    />}
                              {opt.cc2}
                              {opt?.name?.common}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>

                    </Box>
                    {/* <MyInput
                  label='País'
                  required={budgetData.addressCountry?.required}
                  error={budgetData.addressCountry.error}
                  name='addressCountry'
                  value={budgetData.addressCountry.value}
                  onChange={(e) => onBudgetChange(e.target)}
                /> */}
                  </Grid>
                  <Divider fullWidth sx={{ width: '100%', marginTop: 1, marginBottom: 1 }} />
                  <Grid container item sm={12} xs={12} p={1} >
                    <MyInput
                      type='currency'
                      onChange={(e) => onBudgetChange(e.target)}
                      label='Valor'
                      error={budgetData.price.error}
                      required={budgetData.price.required}
                      disabled={true}
                      name='price'
                      value={budgetData.price.value}
                    />
                  </Grid>

                </Grid>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>

  );
};

RequestTab.propTypes = {
  pageProps: PropTypes.any,
  budgetData: PropTypes.any,
  onBudgetChange: PropTypes.any,
  countries: PropTypes.array,

};

export default RequestTab;
