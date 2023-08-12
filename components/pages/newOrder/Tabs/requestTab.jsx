import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Divider, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';

//  PropTypes
import { ChevronDown, UserPlus } from 'lucide-react';
import PropTypes from 'prop-types';
//  Page Component Styles
import styles from '../../../../styles/NewOrder.module.css';

//  Actions
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import moment from 'moment';
import Image from 'next/image';
import routes from '../../../../navigation/routes';
import MyInput from '../../../inputs/myInput';

const RequestTab = (props) => {
  const {
    pageProps,
    budgetData,
    onBudgetChange,
    countries,
    clients,
    onClientChange,
  } = props;

  const [expanded, setExpanded] = useState(true);
  let portugal = {};

  portugal = countries?.find((option) => option.cca2 === 'PT');

  const keys = Object.keys(budgetData);
  const errors = keys.map((key) => budgetData[key].error);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} sx={{ width: '100%', boxShadow: errors.find(ele => ele) && '0px 0px 4px 1px #d32f2f' }}>
      <AccordionSummary sx={{ background: 'lightGray.main' }} bgcolor={'lightGray.main'} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
        <Typography id='align' variant='title' color={errors.find(ele => ele) && 'error'}>
          Projeto
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid container md={12} sm={12} >
            <Grid bgcolor={'lightGray.main'} className={styles.clientContainer} spacing={1} p={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container>
                  <Grid container md={4} sm={4} xs={12} p={1} sx={{
                    position: 'relative',
                    display: 'block'
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: '-20px',
                      right: '95%'
                    }}>
                      <Tooltip title='Novo Cliente'>
                        <IconButton href={routes.private.internal.newClient} target='#'>
                          <UserPlus size={pageProps?.globalVars?.iconSize || 20} strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <InputLabel htmlFor='email'>Cliente
                      {budgetData.client.required && <Tooltip title='Obrigatório'>
                        <span style={{ color: 'var(--red)' }}> *</span>
                      </Tooltip>}
                    </InputLabel>
                    <Autocomplete
                      name='client'
                      id='client'
                      fullWidth
                      label='aa'
                      error={true}
                      disablePortal
                      options={clients || []}
                      getOptionLabel={(option) => option.Nome}
                      getOptionValue={(option) => option.user.id}
                      onChange={(e, value) => {
                        onClientChange({ value: value?.id || '', name: 'client' });
                      }}
                      renderOption={(props, option) => {
                        return (
                          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {option.Nome }
                          </Box>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          label={budgetData.client?.error}
                          error={budgetData.client?.error}
                          value={budgetData.client?.value}
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid container md={4} sm={4} xs={12} p={1}>
                    <MyInput
                      onChange={(e) => onBudgetChange(e.target)}
                      label='Nome'
                      error={budgetData.name.error}
                      required={budgetData.name.required }
                      name='name'
                      value={budgetData.name.value}
                    />
                  </Grid>
                  <Grid container md={4} sm={4} xs={12} p={1}>
                    <MyInput
                      onChange={(e) => onBudgetChange(e.target)}
                      label='Número'
                      type='number'
                      error={budgetData.num.error}
                      required={budgetData.num.required }
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
                      renderInput={(params) =>
                        <TextField fullWidth {...params} error={budgetData.dateRequest.error} inputProps={{ sx: { color: budgetData.dateRequest.error && 'var(--red)' }, ...params.inputProps, placeholder: budgetData.dateRequest.error || 'DD/MM/YYYY' }}/>}
                    />
                  </Grid>
                  {/* Date agreed delivery */}
                  <Grid container md={6} sm={6} xs={12} p={1}>
                    <InputLabel >
                      Entrega acordada do orçamento
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
                        <TextField fullWidth {...params} error={budgetData.dateAgreedDelivery.error} inputProps={{ sx: { color: budgetData.dateAgreedDelivery.error && 'var(--red)' }, ...params.inputProps, placeholder: budgetData.dateAgreedDelivery.error || 'DD/MM/YYYY' }}/>}
                    />
                  </Grid>
                  {/* Date agree delivery Project */}
                  <Grid container item sm={6} xs={12} p={1}>
                    <InputLabel >
                      Entrega acordada do projeto
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
                        <TextField fullWidth {...params} error={budgetData.dateDeliveryProject.error} inputProps={{ sx: { color: budgetData.dateDeliveryProject.error && 'var(--red)' }, ...params.inputProps, placeholder: budgetData.dateDeliveryProject.error || 'DD/MM/YYYY' }}/>}
                    />
                  </Grid>
                  {/* Date budget Delivery */}
                  <Grid container item sm={6} xs={12} p={1}>
                    <InputLabel >
                      Entrega do orçamento
                      {budgetData.dateDelivery.required && <Tooltip title='Obrigatório' >
                        <span style={{ color: 'var(--red)' }}> *</span>
                      </Tooltip>}
                    </InputLabel>
                    <DesktopDatePicker
                      inputFormat={'DD/MM/YYYY'}
                      disabled
                      value={budgetData.dateDelivery.value}
                      minDate={dayjs(budgetData.dateRequest.value).endOf('day')}

                      onChange={(e, newValue) => onBudgetChange({ value: JSON.stringify(e?.$d) === 'null' ? newValue : e?.$d, name: 'dateDelivery' })}
                      renderInput={(params) =>
                        <TextField fullWidth {...params} error={budgetData.dateDelivery.error} inputProps={{ sx: { color: budgetData.dateDelivery.error && 'var(--red)' }, ...params.inputProps, placeholder: budgetData.dateDelivery.error || 'DD/MM/YYYY' }}/>}
                    />
                  </Grid>
                  <Divider fullWidth sx={{ width: '100%', marginTop: 1, marginBottom: 1 }} />
                  {/* Street */}
                  <Grid container item sm={6} xs={12} p={1} >
                    <MyInput
                      onChange={(e) => onBudgetChange(e.target)}
                      label='Rua'
                      error={budgetData.streetAddress.error}
                      required={budgetData.streetAddress.required }
                      name='streetAddress'
                      value={budgetData.streetAddress.value}
                      maxLength={50}

                    />
                  </Grid>
                  {/* Postal Code */}
                  <Grid container item sm={3} xs={12} p={1} >
                    <MyInput
                      label='Código Postal'
                      required={budgetData.postalCode.required }
                      error={budgetData.postalCode.error}
                      name='postalCode'
                      value={budgetData.postalCode.value}
                      onChange={(e) => onBudgetChange(e.target)}
                      maxLength={15}
                    />
                  </Grid>
                  {/* Locality */}
                  <Grid container item sm={3} xs={12} p={1} >
                    <MyInput
                      label='Localidade'
                      required={budgetData.addressLocality.required }
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
                        labelId={budgetData.addressCountry.id}
                        name='addressCountry'
                        placeholder={budgetData.addressCountry.error}
                        label={budgetData.addressCountry.error}
                        error={!!budgetData.addressCountry.error}
                        required={budgetData.addressCountry.required }
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
                        {countries?.filter((item) => item.cca2 !== 'PT').sort((a, b) => (a.name?.common > b.name?.common) ? 1 : -1).map((opt, i) => (
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
                              {opt?.name?.common}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>

                    </Box>
                  </Grid>
                  <Divider fullWidth sx={{ width: '100%', marginTop: 1, marginBottom: 1 }} />
                  <Grid container item sm={12} xs={12} p={1} >
                    <MyInput
                      label='Valor'
                      name='price'
                      onChange={(e) => onBudgetChange(e.target)}
                      {...budgetData.price}
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
  clients: PropTypes.array,
  onClientChange: PropTypes.func,
  client: PropTypes.object,
};

export default RequestTab;
