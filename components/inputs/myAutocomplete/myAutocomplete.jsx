/* eslint-disable react/prop-types */
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  TextField,
  Tooltip
} from '@mui/material';
import React from 'react';

const MyAutocomplete = ({
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
  id = `ID-${label}`,
  tooltip,
  options,
  optionLabel,
  optionValue
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {variant !== 'standard' && (
        <Tooltip title={tooltip || ''}>
          <InputLabel htmlFor={id} id={id}>
            {label}
            {required
              ? (
                <Tooltip title="Obrigatório">
                  <span style={{ color: 'var(--red)' }}> *</span>
                </Tooltip>
              )
              : null}
          </InputLabel>
        </Tooltip>
      )}
      <FormControl fullWidth disabled={disabled}>
        {!!error && (
          <InputLabel error={!!error} id={id}>
            {error}
          </InputLabel>
        )}
        <Autocomplete
          freeSolo
          variant={variant}
          error={!!error}
          label={error}
          required={required}
          name={name}
          disabled={disabled}
          value={value}
          id={id}
          fullWidth={fullWidth || false}
          onChange={(e, value) => {
            onChange(value ? (value[optionValue] || value.id) : '');
          }}
          sx={{ width: width && width }}
          style={{ width: halfWidth && '50%' }}
          getOptionLabel={(option) => option[optionLabel] || option.id }
          getOptionValue={(option) => option[optionValue]?.value || option.id }
          options={options}
          renderInput={(params) =>
            <TextField {...params} />
          }
        >
        </Autocomplete>
      </FormControl>
    </Box>
  );
};

export default MyAutocomplete;
