/* eslint-disable react/prop-types */
// Node modules
import { FormControl, IconButton, InputAdornment, InputLabel, TextField, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { PatternFormat } from 'react-number-format';

export const NumberFormatCustom = React.forwardRef(function NumberFormatCustom (props, ref) {
  const { ...other } = props;

  return <PatternFormat
    {...other}
    format="####-###"
    getInputRef={ref}
  />;
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const PostalCodeInput = ({
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
  adornmentIcon,
  adornmentOnClick,
  adornmentPos,
  iconTooltip,
  placeholder,
}) => {
  return (
    <>
      {variant !== 'standard' && (
        <InputLabel htmlFor={label}>
          {label}
          {required &&
            <Tooltip title='Obrigatório' >
              <span style={{ color: 'var(--red)' }}> *</span>
            </Tooltip>
          }
        </InputLabel>
      )}
      <FormControl fullWidth disabled={disabled}>
        {!!error && <InputLabel error={!!error} id="demo-simple-select-label">{error}</InputLabel>}
        <TextField
          placeholder={placeholder}
          disabled={disabled}
          id={id}
          variant={variant || 'outlined'}
          error={error}
          label={error}
          value={value}
          fullWidth={fullWidth}
          sx={{ width: width || (halfWidth && '50%') }}
          onChange={onChange}
          style={style}
          name={name}
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
          endAdornment={!!adornmentIcon &&
            <InputAdornment position={adornmentPos || 'end'}>
              <Tooltip title={iconTooltip || ''}>
                <IconButton component='label'
                  onClick={adornmentOnClick || null}
                  edge="end">
                  {adornmentIcon}
                </IconButton>
              </Tooltip>
            </InputAdornment>
          }
        />
      </FormControl>

    </>
  );
};

export default PostalCodeInput;
