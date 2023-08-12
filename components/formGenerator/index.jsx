/* eslint-disable sort-imports */
import { Box, Checkbox, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Popover, Select, styled, Tooltip } from '@mui/material';
import { HelpCircle, Verified } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import MyInput from '../inputs/myInput';
import PhoneInput from '../inputs/phoneInput/PhoneInput';
import MySelect from '../inputs/select';
//  Proptypes
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CurrencyInput from '../inputs/CurrencyInput';

/* HOW TO USE
 * to use this form generator, u need to provida a array of objects for the inputs.
 * for the minimum display of the input, only needs a blank obj.
 * the form is ready for this fields
 * id, label, value, error, required, type
 *
 * if u wish to use a phoneInput, use type : 'phone'
 *
 * for a select field, provide the options ->  options: countries (array)
 * to select the specifiq field to display in the options, u can use -> optLabel: 'id',
 * by default, is using the field label
 * to select the specifiq value field in the options, u can use -> optValue: 'id',
 *
 * for a area text field, use type: 'area'
 *
 *  for the password field, use type: 'password'
 *  if u wish for it to be randomized, provide the FormGenerator component,
 *  on the optionData property, with a generatePassword state (bool) and a setGeneratePassword
 *
 *  you can also provide the fields with a tooltip, which appear while hovering over the input label
*/

/*
 * You may think you know what the following code does.
 * But you dont. Trust me.
 * Fiddle with it, and youll spend many a sleepless
 * night cursing the moment you thought youd be clever
 * enough to "optimize" the code below.
 * Now close this file and go play with something else.
 */

const FormGenerator = ({ fields, onFormChange, perRow, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loaded, setLoaded] = useState(false);
  // const placeholderDefault = 'Escrever';
  const optData = props.optionalData || {};
  const reduxState = useSelector((state) => state);
  const countries = reduxState.countries.data;

  const {
    postalCodeInfo,
    ValidatePostalCode
  } = optData;

  useEffect(() => {
    const getData = async () => {
      // try { } catch (error) { }
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  const Item = styled(Paper)(() => ({
    padding: '.5rem',
  }));

  const ITEM_HEIGHT = 36;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      },
    },
  };

  return loaded && <>
    <Popover
      id={anchorEl ? 'simple-popover' : undefined}
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box sx={{ flexGrow: 1, p: 1 }}>
        <Grid container >
          <Grid container item >
            <Grid item xs={6} sx={{ padding: '.5rem' }}>
              <Item>Distrito</Item>
            </Grid>
            <Grid item xs={6} sx={{ padding: '.5rem' }}>
              <Item>{postalCodeInfo?.Distrito}</Item>
            </Grid>
          </Grid>
          <Grid container item >
            <Grid item xs={6} sx={{ padding: '.5rem' }}>
              <Item>Concelho</Item>
            </Grid>
            <Grid item xs={6} sx={{ padding: '.5rem' }}>
              <Item>{postalCodeInfo?.Concelho}</Item>
            </Grid>
          </Grid>
          <Grid container item >
            <Grid item xs={6} sx={{ padding: '.5rem' }}>
              <Item>{typeof postalCodeInfo?.Localidade === 'object' ? 'Localidades' : 'Localidade'}</Item>
            </Grid>
            <Grid item xs={6} sx={{ maxHeight: '300px', overflow: 'scroll', padding: '.5rem' }}>
              <Item> {typeof postalCodeInfo?.Localidade === 'object'
                ? <>
                  {postalCodeInfo.Localidade.map((x, i) => <a key={i}>{x}<Divider /></a>)}
                </>
                : postalCodeInfo?.Localidade}</Item>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Popover>
    <Grid container>
      {fields.map((field, index) => {
        if (field?.hidden) return null;

        if (field?.options) {
          return <><Grid key={index} md={ perRow ? (12 / perRow) : 3} sm={ 6 } xs={12} container sx={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}>
            <MySelect
              fullWidth
              name={field.id}
              label={field.label}
              required={field.required}
              value={field.value}
              error={field.error}
              type={field.type && field.type}
              onChange={(e) => onFormChange(index, e)}
              options={field.options}
              optionValue={field.optValue}
              optionLabel={field.optLabel}
              disabled={field.disabled}
              placeholder={field.placeholder }
              tooltip={field.tooltip}
            />
          </Grid>
          {field.lineBreak && <Grid container md={12} sm={12} xs={12}></Grid>}
          </>;
        }

        if (field?.type === 'phone') {
          return <Grid key={index}
            md={ perRow ? (12 / perRow) : 3}
            sm={ perRow !== 1 ? 6 : 12}
            xs={ perRow !== 1 ? 12 : 12}
            container sx={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}>
            <PhoneInput
              name={field.id}
              label={field.label}
              options={countries}
              required={field.required}
              value={field.value}
              placeholder={field.placeholder }
              error={field.error}
              onChange={(e) => onFormChange(index, e)}
              tooltip={field.tooltip}
              disabled={field.disabled}
            />
          </Grid>;
        }

        if (field?.type === 'currency') {
          return <><Grid key={index}
            md={ perRow ? (12 / perRow) : 3}
            sm={ perRow !== 1 ? 6 : 12}
            xs={ perRow !== 1 ? 12 : 12}
            container sx={{ paddingMySelectLeft: '.5rem', paddingRight: '.5rem' }}>
            <CurrencyInput
              name={field.id}
              label={field.label}
              options={countries}
              required={field.required}
              value={field.value}
              placeholder={field.placeholder }
              error={field.error}
              onChange={(e) => onFormChange(index, e)}
              tooltip={field.tooltip}
              disabled={field.disabled}
            />

          </Grid>
          {field.lineBreak && <Grid container md={12} sm={12} xs={12}></Grid>}
          </>;
        }

        if (field?.type === 'checkbox') {
          return <><Grid key={index}
            md={ perRow ? (12 / perRow) : 3}
            sm={ perRow !== 1 ? 6 : 12}
            xs={ perRow !== 1 ? 12 : 12}
            container sx={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}>
            <FormControlLabel
              control={<Checkbox />}
              name={field.id}
              label={field.label}
              // required={field.required}
              checked={field.value}
              placeholder={field.placeholder }
              error={field.error}
              onChange={(e) => onFormChange(index, e)}
              tooltip={field.tooltip}
              disabled={field.disabled}
            />

          </Grid>
          {field.lineBreak && <Grid container md={12} sm={12} xs={12}></Grid>}
          </>;
        }

        if (field?.type === 'country') {
          let portugal = {};

          portugal = countries?.find((option) => option.cca2 === 'PT');

          return <>
            <Grid key={index}
              md={ perRow ? (12 / perRow) : 3}
              sm={ perRow !== 1 ? 6 : 12}
              xs={ perRow !== 1 ? 12 : 12}
              container sx={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}>
              <Tooltip title={field.tooltip || ''} >
                <Box sx={{ width: '100%' }}>

                  <InputLabel htmlFor={field.label}>
                    {field.label}
                    {field.required &&
              <Tooltip title='Obrigatório' >
                <span style={{ color: 'var(--red)' }}> *</span>
              </Tooltip>}
                  </InputLabel>
                  <FormControl fullWidth>
                    {!!field.error && <InputLabel error={!!field.error} id={field.id}>{field.error}</InputLabel>}
                    <Select
                      placeholder={field.error}
                      label={field.error && field.error}
                      error={!!field.error}
                      required={field.required}
                      select
                      name={field.name}
                      disabled={field.disabled}
                      id={field.id}
                      fullWidth={field.fullWidth || false}
                      value={field.value}
                      onChange={(e) => onFormChange(index, e)}
                      sx={{ width: field.width && field.width }}
                      style={{ width: '100%' }}
                      MenuProps={MenuProps}

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
                            {opt.cc2}
                            {opt?.name?.common}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

              </Tooltip>
            </Grid>
            {field.lineBreak && <Grid container md={12} sm={12} xs={12}></Grid>}
          </>;
        }

        //  Default case regular text input
        return field.id && <><Grid key={index}
          md={ perRow ? (12 / perRow) : 3}
          sm={ perRow !== 1 ? 6 : 12}
          xs={ perRow !== 1 ? 12 : 12}
          container sx={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}>
          <MyInput
            name={field.id}
            label={field.label}
            required={field.required}
            value={field.value}
            error={field.error}
            tooltip={field.tooltip}
            disabled={field.disabled}
            type={field.type && field.type}
            onChange={(e) => {
              onFormChange(index, e);
              (field.id === 'postalCode2' || field.id === 'address.postalCode2') && ValidatePostalCode(null);
            }}
            maxLength={field.maxLength}
            placeholder={field.placeholder }
            adornmentIcon={(field.id === 'postalCode2' || field.id === 'address.postalCode2') &&
              <>
                {postalCodeInfo
                  ? <Tooltip title='Detalhes Código Postal' >
                    <Verified color="var(--green)" strokeWidth={1.5} onClick={(event) => setAnchorEl(event.currentTarget)} />
                  </Tooltip>
                  : <Tooltip title='Validar' >
                    <HelpCircle color="var(--primary)" strokeWidth={1.5} onClick={() => ValidatePostalCode({ index, value: field.value })} />
                  </Tooltip>
                }
              </>
            }
          />
        </Grid>
        {field.lineBreak && <Grid container md={12} sm={12} xs={12}></Grid>}
        </>;
      })}
    </Grid>
  </>;
};

FormGenerator.propTypes = {
  fields: PropTypes.array,
  onFormChange: PropTypes.func,
  ValidatePostalCode: PropTypes.func,
  generatePassword: PropTypes.bool,
  setGeneratePassword: PropTypes.any,
  perRow: PropTypes.number,
  postalCodeInfo: PropTypes.object,
  optionalData: PropTypes.object,
};

export default FormGenerator;
