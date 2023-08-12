/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';

import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tooltip
} from '@mui/material';
import React from 'react';
import { NumericFormat } from 'react-number-format';
export const NumberFormatCustom = React.forwardRef(function NumberFormatCustom (props, ref) {
  const { ...other } = props;

  return <NumericFormat
    {...other}
    getInputRef={ref}
    // style={{ textAlign: 'start' }}
    suffix={process.env.NEXT_PUBLIC_COUNTRY_SUFFIX || '€'}
    decimalScale={process.env.NEXT_PUBLIC_DECIMALS_SCALE }
    decimalSeparator={process.env.NEXT_PUBLIC_DECIMALS_SEPARATOR}
    thousandSeparator={process.env.NEXT_PUBLIC_THOUSANDS_SEPARATOR || ' '}
  />;
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const MyInput = ({
  disabled,
  value,
  label,
  onChange,
  fullWidth,
  variant,
  required,
  width,
  halfWidth,
  error,
  type = 'string',
  placeholder,
  adornmentIcon,
  adornmentOnClick,
  adornmentPos = 'end',
  style,
  iconTooltip,
  name,
  id = `ID-${label}`,
  tooltip,
  maxLength,
  rows
}) => {
  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    // If the type is "number" and the input value is less than 0, set it to 0
    if (type === 'number') {
      inputValue >= 0 && onChange && onChange(event, inputValue);
    } else { onChange && onChange(event, inputValue); }
  };

  function onUpDownClick (e, action) {
    if (e.target.value === '') {
      action === 'up' ? e.target.value = 1 : e.target.value = 0;
    } else {
      action === 'up' ? e.target.value++ : (e.target.value !== 0 && e.target.value--);
    }

    e.target.value >= 0 && onChange && onChange(e);
  }

  return <Box sx={{ width: '100%' }}>
    {variant !== 'standard' && (
      <Tooltip title={tooltip || ''}>
        <InputLabel htmlFor={id} id={id}>
          {label}
          {required
            ? (
              <Tooltip title='Obrigatório'>
                <span style={{ color: 'var(--red)' }}> *</span>
              </Tooltip>
            )
            : null}
        </InputLabel>
      </Tooltip>
    )}
    <FormControl fullWidth disabled={disabled}>
      {!!error && <InputLabel error={!!error} id={id}>{error}</InputLabel>}
      <OutlinedInput
        aria-labelledby={id}
        variant={variant || 'outlined' }
        name={name}
        type={type}
        multiline={type === 'area' ? true : undefined}
        id={id}
        error={error}
        value={value}
        onChange={handleInputChange}
        required
        label={error || (variant ? label : '')}
        fullWidth={fullWidth}
        inputProps={{
          maxLength: maxLength || (type === 'area' ? 2000 : 255),
        }}
        sx={{
          width: width || (halfWidth && '50%'),
        }}
        rows={rows || 4}
        style={style}
        placeholder={placeholder || ''}
        inputComponent={type === 'currency' ? NumberFormatCustom : undefined}
        endAdornment={ (<>
          {type === 'number' && <InputAdornment position={'end'}>
            <Grid container md={12} justifyContent={'end'}>
              <Grid container md={6}sm={6}xs={6} p={1}><IconButton name={name} action2='down' value={value} onClick={(e) => onUpDownClick(e, 'down')} sx={{ display: 'flex', alignItems: 'center', color: 'divider', height: '30px', width: '30px', border: '0.5px solid', borderColor: 'divider', fontSize: '22px' }} >-</IconButton></Grid>
              <Grid container md={6}sm={6}xs={6} p={1}><IconButton name={name} action2='up' value={value} onClick={(e) => onUpDownClick(e, 'up')} sx={{ display: 'flex', alignItems: 'center', color: 'divider', height: '30px', width: '30px', border: '0.5px solid', borderColor: 'divider' }} >+</IconButton> </Grid>
            </Grid>
          </InputAdornment>}
          {adornmentIcon &&
          <InputAdornment position={adornmentPos}>
            {iconTooltip
              ? (
                <Tooltip title={iconTooltip}>
                  <IconButton
                    component='label'
                    aria-label='toggle password visibility'
                    onClick={adornmentOnClick}
                    edge='end'
                  >
                    {adornmentIcon}
                  </IconButton>
                </Tooltip>
              )
              : (
                <IconButton
                  component='label'
                  aria-label='toggle password visibility'
                  onClick={adornmentOnClick}
                  edge='end'
                >
                  {adornmentIcon}
                </IconButton>
              )}
          </InputAdornment>}

        </>
        )}
      />
      {(maxLength || type === 'area') && <Tooltip title='Tamanho máximo'>
        <FormHelperText sx={{ display: 'flex', justifyContent: 'end' }} >
          {value?.length} / {maxLength || 2000} caracteres
        </FormHelperText>
      </Tooltip>
      }
    </FormControl>
  </Box>;
};

export default MyInput;
