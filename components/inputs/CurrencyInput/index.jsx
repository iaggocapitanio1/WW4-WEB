/* eslint-disable react/prop-types */
// Node modules
import { Box, FormControl, InputLabel, OutlinedInput, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
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

const CurrencyInput = ({
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
  name,
  id,
  style,
  tooltip,
  type,
  placeholder,
}) => {
  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    // If the type is "number" and the input value is less than 0, set it to 0
    if (type === 'number') {
      inputValue >= 0 && onChange && onChange(event, inputValue);
    } else { onChange && onChange(event, inputValue); }
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
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
            multiline={type === 'area'}
            id={id}
            error={error}
            value={value}
            onChange={handleInputChange}
            required
            label={error || (variant ? label : '')}
            fullWidth={fullWidth}
            sx={{
              width: width || (halfWidth && '50%'),
            }}
            style={style}
            inputComponent= {NumberFormatCustom}
            placeholder={placeholder || ''}
          />
        </FormControl>
      </Box>

    </>
  );
};

export default CurrencyInput;
