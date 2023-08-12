/* eslint-disable react/prop-types */
import { AppBar, Box, ButtonGroup, Dialog, DialogTitle, FormControl, Grid, Grow, IconButton, InputAdornment, InputLabel, MenuItem, Paper, TextField, Toolbar, Typography } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { X, XCircle } from 'lucide-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import PrimaryBtn from '../../buttons/primaryBtn';

/* eslint-disable consistent-return */
// Nodes
export const MyFilterInput = ({
  disabled,
  value,
  label,
  onChange,
  fullWidth,
  width,
  halfWidth,
  error,
  type = 'string',
  placeholder,
  style,
  name,
  id = `ID-${label}`,
  maxLength,
  options,
  optionValue,
  optionLabel,

}) => {
  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    // If the type is "number" and the input value is less than 0, set it to 0
    if (type === 'number') {
      inputValue >= 0 && onChange && onChange(event, inputValue);
    } else { onChange && onChange(event, inputValue); }
  };

  return <Box sx={{ width: '100%' }}>
    <FormControl fullWidth disabled={disabled}>
      {!!error && <InputLabel error={!!error} id={id}>{error}</InputLabel>}
      <TextField
        select={!!options}
        aria-labelledby={id}
        variant={'standard' }
        name={name}
        type={type}
        id={id}
        value={value}
        onChange={handleInputChange}
        label={label}
        fullWidth={fullWidth}
        inputProps={{
          maxLength: maxLength || type === 'area' ? 2000 : 255,
        }}
        sx={{
          width: width || (halfWidth && '50%'),
        }}
        style={style}
        placeholder={placeholder || ''}
        InputProps={{
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => handleInputChange({ target: { value: '' } })}
              >
                <XCircle size={'14px'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      >
        <MenuItem value="" disabled>
            Escolha uma opcao
        </MenuItem>
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

      </TextField>
    </FormControl>
  </Box>;
};

function PaperComponent (props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const FilterPopUp = ({ open, onClose, clients, setAppliedFilters, fullScreen }) => {
  const [filters, setFilters] = useState({
    Cliente: '',
    Nome: '',
    Número: '',
    Previsto: '',
    Realizado: '',
    Quantidade: '',
    Início: '',
    Fim: '',
  });

  function onFilterChange ({ field, newValue }) {
    setFilters({ ...filters, [field]: newValue });
  }

  function ClearFilters () {
    setFilters({
      Cliente: '',
      Nome: '',
      Número: '',
      Previsto: '',
      Realizado: '',
      Quantidade: '',
      Início: '',
      Fim: '',
    });

    setAppliedFilters();
  }

  return (
    <Dialog open={open} fullScreen={fullScreen} PaperComponent={PaperComponent} >
      {fullScreen && <AppBar sx={{ position: 'relative', backgroundColor: 'default.sides' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <X />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Filtros
          </Typography>

        </Toolbar>
      </AppBar>}
      <Grow in={true}>
        <Grid container sx={{
          borderRadius: '8px',
        }}>

          <Grow in={true}>
            <Grid container sx={{
              borderRadius: '8px',
              p: '1rem',
              bgcolor: 'background.paper',
              boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.2)'
            }}>
              <DialogTitle style={{ cursor: 'move', borderBottom: '1px solid', borderColor: 'divider', width: '100%', padding: 0 }} id="draggable-dialog-title">
                <Grid container lg={12} md={12} sm={12} xs={12} justifyContent={'space-between'} display={fullScreen && 'none'}>
                  <Typography variant='title'>Filtros</Typography>
                  <IconButton sx={{ float: 'right' }} onClick={onClose}>
                    <X />
                  </IconButton>
                </Grid>
              </DialogTitle>
              <Grid container lg={12} md={12} sm={12} xs={12} >
                <Grid container lg={6} md={6} sm={6} xs={12} p={1}><MyFilterInput onChange={(e) => onFilterChange({ field: 'Cliente', newValue: e.target.value })} value={filters.Cliente} label='Cliente' variant={'standard'} options={clients} optionLabel={'Nome'} /></Grid>
                <Grid container lg={6} md={6} sm={6} xs={12} p={1}><MyFilterInput onChange={(e) => onFilterChange({ field: 'Nome', newValue: e.target.value })} value={filters.Nome} label='Nome' variant={'standard'} /></Grid>
              </Grid>
              <Grid container lg={12} md={12} sm={12} xs={12} >
                <Grid container lg={6} md={6} sm={6} xs={12} p={1}><MyFilterInput onChange={(e) => onFilterChange({ field: 'Número', newValue: e.target.value })} value={filters.Número} label='Número' variant={'standard'} /></Grid>
                <Grid container lg={6} md={6} sm={6} xs={12} p={1}>
                  <MyFilterInput onChange={(e) => onFilterChange({ field: 'Previsto', newValue: e.target.value })} value={filters.Previsto} label='Previsto' variant={'standard'} />
                </Grid>
              </Grid>
              <Grid container lg={12} md={12} sm={12} xs={12} >
                <Grid container lg={6} md={6} sm={6} xs={12} p={1}>
                  <MyFilterInput onChange={(e) => onFilterChange({ field: 'Realizado', newValue: e.target.value })} value={filters.Realizado} label='Realizado' variant={'standard'} />
                </Grid>
                <Grid container lg={6} md={6} sm={6} xs={12} p={1}><MyFilterInput onChange={(e) => onFilterChange({ field: 'Quantidade', newValue: e.target.value })} value={filters.Quantidade} label='Quantidade' variant={'standard'} type="number" /></Grid>

              </Grid>
              <Grid container lg={12} md={12} sm={12} xs={12} >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container lg={6} md={6} sm={6} xs={12} p={1}>
                    <DesktopDatePicker
                      label="Início"
                      inputFormat="DD/MM/YYYY"
                      value={moment(filters.Início?.value, 'DD/MM/YYYY')}
                      onChange={(newValue) => {
                        onFilterChange({
                          field: 'Início',
                          newValue: {
                            value: moment(newValue?.$d).format('DD/MM/YYYY'),
                            operator: 'bigger'
                          }
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          variant="standard"
                          fullWidth
                          {...params}
                          inputProps={{ ...params.inputProps, placeholder: 'DD/MM/YYYY' }}
                        />
                      )}
                    />

                  </Grid>
                  <Grid container lg={6} md={6} sm={6} xs={12} p={1}>
                    <DesktopDatePicker
                      label="Fim"
                      inputFormat="DD/MM/YYYY"
                      value={moment(filters.Fim?.value, 'DD/MM/YYYY')}
                      onChange={(newValue) => {
                        onFilterChange({
                          field: 'Fim',
                          newValue: {
                            value: moment(newValue?.$d).format('DD/MM/YYYY'),
                            operator: 'smaller'
                          }
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          variant="standard"
                          fullWidth
                          {...params}
                          inputProps={{ ...params.inputProps, placeholder: 'DD/MM/YYYY' }}
                        />
                      )}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>
              <Grid container lg={12} md={12} sm={12} xs={12} p={1} justifyContent={'end'}>
                <ButtonGroup>
                  <PrimaryBtn onClick={() => {
                    setAppliedFilters(filters);
                    fullScreen && onClose();
                  }} text={'Aplicar'} />
                  <PrimaryBtn onClick={ClearFilters} text={'Limpar'} light/>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Grow>

        </Grid>
      </Grow>
    </Dialog>
  );
  // return (
  //   <Dialog open={open} fullScreen={fullScreen} anchorEl={open} sx={{ width: '40%', paddingRight: '5%' }}>
  //     <Grow in={true}>
  //       <Grid container sx={{
  //         borderRadius: '8px',
  //         p: '1rem',
  //         bgcolor: 'background.paper',
  //         boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.2)'
  //       }}>
  //         <Grid container lg={12} md={12} sm={12} xs={12} justifyContent={'space-between'}>
  //           <Typography variant='title'>Filtros</Typography>
  //           <IconButton sx={{ float: 'right' }} onClick={onClose}>
  //             <X />
  //           </IconButton>
  //         </Grid>
  //         <Grid container lg={12} md={12} sm={12} xs={12} >
  //           <Grid container lg={6} md={6} sm={6} xs={12} p={1}><MyFilterInput onChange={(e) => onFilterChange({ field: 'Cliente', newValue: e.target.value })} value={filters.Cliente} label='Cliente' variant={'standard'} options={clients} optionLabel={'Nome'} /></Grid>
  //           <Grid container lg={6} md={6} sm={6} xs={12} p={1}><MyFilterInput onChange={(e) => onFilterChange({ field: 'Nome', newValue: e.target.value })} value={filters.Nome} label='Nome' variant={'standard'} /></Grid>
  //         </Grid>
  //         <Grid container lg={12} md={12} sm={12} xs={12} >
  //           <Grid container lg={6} md={6} sm={6} xs={12} p={1}><MyFilterInput onChange={(e) => onFilterChange({ field: 'Número', newValue: e.target.value })} value={filters.Número} label='Número' variant={'standard'} /></Grid>
  //           <Grid container lg={6} md={6} sm={6} xs={12} p={1}>
  //             <MyFilterInput onChange={(e) => onFilterChange({ field: 'Previsto', newValue: e.target.value })} value={filters.Previsto} label='Previsto' variant={'standard'} />
  //           </Grid>
  //         </Grid>
  //         <Grid container lg={12} md={12} sm={12} xs={12} >
  //           <Grid container lg={6} md={6} sm={6} xs={12} p={1}>
  //             <MyFilterInput onChange={(e) => onFilterChange({ field: 'Realizado', newValue: e.target.value })} value={filters.Realizado} label='Realizado' variant={'standard'} />
  //           </Grid>
  //           <Grid container lg={6} md={6} sm={6} xs={12} p={1}><MyFilterInput onChange={(e) => onFilterChange({ field: 'Quantidade', newValue: e.target.value })} value={filters.Quantidade} label='Quantidade' variant={'standard'} type="number" /></Grid>

  //         </Grid>
  //         <Grid container lg={12} md={12} sm={12} xs={12} >
  //           <LocalizationProvider dateAdapter={AdapterDayjs}>
  //             <Grid container lg={6} md={6} sm={6} xs={12} p={1}>
  //               <DesktopDatePicker
  //                 label="Início"
  //                 inputFormat="DD/MM/YYYY"
  //                 value={moment(filters.Início?.value, 'DD/MM/YYYY')}
  //                 onChange={(newValue) => {
  //                   onFilterChange({
  //                     field: 'Início',
  //                     newValue: {
  //                       value: moment(newValue.$d).format('DD/MM/YYYY'),
  //                       operator: 'bigger'
  //                     }
  //                   });
  //                 }}
  //                 renderInput={(params) => (
  //                   <TextField
  //                     variant="standard"
  //                     fullWidth
  //                     {...params}
  //                     inputProps={{ ...params.inputProps, placeholder: 'DD/MM/YYYY' }}
  //                   />
  //                 )}
  //               />

  //             </Grid>
  //             <Grid container lg={6} md={6} sm={6} xs={12} p={1}>
  //               <DesktopDatePicker
  //                 label="Fim"
  //                 inputFormat="DD/MM/YYYY"
  //                 value={moment(filters.Fim?.value, 'DD/MM/YYYY')}
  //                 onChange={(newValue) => {
  //                   onFilterChange({
  //                     field: 'Fim',
  //                     newValue: {
  //                       value: moment(newValue.$d).format('DD/MM/YYYY'),
  //                       operator: 'smaller'
  //                     }
  //                   });
  //                 }}
  //                 renderInput={(params) => (
  //                   <TextField
  //                     variant="standard"
  //                     fullWidth
  //                     {...params}
  //                     inputProps={{ ...params.inputProps, placeholder: 'DD/MM/YYYY' }}
  //                   />
  //                 )}
  //               />
  //             </Grid>
  //           </LocalizationProvider>
  //         </Grid>
  //         <Grid container lg={12} md={12} sm={12} xs={12} p={1}>
  //           <ButtonGroup>
  //             <PrimaryBtn onClick={() => setAppliedFilters(filters)} text={'Aplicar'} />
  //             <PrimaryBtn onClick={ClearFilters} text={'Limpar'} light/>
  //           </ButtonGroup>
  //         </Grid>
  //       </Grid>
  //     </Grow>
  //   </Dialog>
  // );
};

FilterPopUp.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.any
};

export default FilterPopUp;
