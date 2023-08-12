/* eslint-disable react/prop-types */
// Node modules
import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useSelector } from 'react-redux';

export const NumberFormatCustom = React.forwardRef(function NumberFormatCustom (props, ref) {
  const { ...other } = props;

  return <NumericFormat
    {...other}
    getInputRef={ref}
    // style={{ textAlign: 'start' }}
    thousandSeparator={process.env.NEXT_PUBLIC_THOUSANDS_SEPARATOR || ' '}
  />;
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const PhoneInput = ({
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
  placeholder,
  tooltip,
}) => {
  const reduxState = useSelector((state) => state);
  const countries = reduxState.countries.data;
  const [selected, setSelected] = useState('PT');

  useEffect(() => {
    const test = async () => {
    };

    test();
  }, []);

  return countries && (
    <Box sx={{ width: '100%' }}>
      {variant !== 'standard' && (
        <Tooltip title={tooltip || ''} >
          <InputLabel htmlFor={label}>
            {label}
            {required &&
              <Tooltip title='Obrigatório' >
                <span style={{ color: 'var(--red)' }}> *</span>
              </Tooltip>
            }
          </InputLabel>
        </Tooltip>
      )}
      <FormControl fullWidth disabled={disabled} >
        {!!error && <InputLabel error={!!error} id="demo-simple-select-label">{error}</InputLabel>}
        <TextField
          sx={{ padding: 0, width: width || (halfWidth && '50%') }}
          placeholder={placeholder}
          disabled={disabled}
          id={id}
          variant={variant || 'outlined'}
          error={error}
          label={error}
          value={value}
          fullWidth={fullWidth}
          onChange={onChange}
          style={style}
          name={name}
          InputProps={{
            inputComponent: NumberFormatCustom,
            startAdornment: (
              <InputAdornment position={'start'}>
                <Select aria-selected={selected} value={selected} onChange={(e) => setSelected(e.target.value)}
                  sx={{ width: 'fit-content', left: '-14px' }}>
                  {countries
                    .filter(ele => ele.cca2 !== 'US')
                    .map((opt, i) => (
                      <MenuItem key={i} value={opt.cca2} >
                        <Box
                          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                        >
                          {!!opt.cca2 &&
                            <img
                              loading='lazy'
                              width='20'
                              src={opt.flags.png}
                              srcSet={opt.flags.png}
                              // src={`https://flagcdn.com/w20/${opt.cca2.toLowerCase()}.png`}
                              // srcSet={`https://flagcdn.com/w40/${opt.cca2.toLowerCase()}.png 2x`}
                              alt='Country flag'
                            />}
                          {opt.idd.root}{opt.idd.suffixes}
                        </Box>
                      </MenuItem>
                    ))}
                </Select>
              </InputAdornment>
            )
          }}
          helperText={`${value?.length}/20`}
        >
        </TextField>
      </FormControl>

    </Box>
  );
};

export default PhoneInput;
