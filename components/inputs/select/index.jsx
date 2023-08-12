/* eslint-disable react/prop-types */
// Node modules
import { Box, FormControl, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const MySelect = ({
  disabled,
  value,
  label,
  onChange,
  options,
  optionLabel,
  optionValue,
  fullWidth,
  variant,
  required,
  width,
  halfWidth,
  error,
  name,
  id,
  tooltip,
}) => {
  let portugal = {};

  if (label === 'Country' || label === 'Code') portugal = options.find((option) => option.cca2 === 'PT');

  const ITEM_HEIGHT = 36;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      },
    },
  };

  return (
    <Box sx={{ width: '100%' }}>
      {variant !== 'standard' && label
        ? (
          <Tooltip title={tooltip || ''} >
            <InputLabel htmlFor={label}>
              {label}
              {required &&
              <Tooltip title='Obrigatório' >
                <span style={{ color: 'var(--red)' }}> *</span>
              </Tooltip>}
            </InputLabel>
          </Tooltip>
        )
        : null}
      <FormControl fullWidth>
        {!!error && <InputLabel error={!!error} id={id}>{error}</InputLabel>}
        <Select
          variant={variant}
          error={!!error}
          label={error}
          required={required}
          select
          name={name}
          disabled={disabled}
          id={id}
          fullWidth={fullWidth || false}
          value={value}
          onChange={onChange}
          sx={{ width: width && width }}
          style={{ width: halfWidth && '50%', maxHeight: '200px' }}
          MenuProps={MenuProps}
        >
          <MenuItem value="" disabled>
            Escolha uma opcao
          </MenuItem>
          {portugal && portugal.cca2 === 'PT'
            ? (
              <MenuItem value={portugal[optionValue]}>
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
                  {portugal[optionLabel]}
                </Box>
              </MenuItem>
            )
            : null}
          {options && options
            .map((opt, i) => (
              !opt.hidden && <MenuItem disabled={opt.subheader} key={i} value={opt[optionValue]?.value ? opt[optionValue].value : opt[optionValue] || opt.id}>
                <Box sx={{ '& > img': { mr: 2, flexShrink: 0 } }} >
                  {!!opt.cca2 &&
                    <img
                      loading='lazy'
                      width='20'
                      src={`https://flagcdn.com/w20/${opt.cca2.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${opt.cca2.toLowerCase()}.png 2x`}
                      alt=''
                    />}
                  {opt[optionLabel]?.value ? opt[optionLabel].value : opt[optionLabel] || opt.label || 'Empty'}
                </Box>
              </MenuItem>

            ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MySelect;
