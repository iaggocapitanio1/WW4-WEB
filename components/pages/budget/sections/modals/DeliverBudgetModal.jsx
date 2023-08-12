import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, InputLabel, TextField, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
//  PropTypes
import { QuestionMark } from '@mui/icons-material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Notification from '../../../../dialogs/Notification';
import MyInput from '../../../../inputs/myInput';

const DeliverBudgetModal = (props) => {
  const { open, onConfirm, handleClose, budget } = props;
  const [dateAgreedDelivery, setDateAgreedDelivery] = useState({ value: moment(budget.dateAgreedDelivery?.value, 'DD/MM/YYYY'), error: '' });
  const [dateDeliveryProject, setDateDeliveryProject] = useState({ value: budget.dateDeliveryProject?.value ? moment(budget.dateDeliveryProject?.value, 'DD/MM/YYYY') : budget.dateDeliveryProject?.value, error: '' });
  const [price, setPrice] = useState({ value: budget.price?.value, error: '' });
  const [obs, setObs] = useState({ value: budget.obs?.value, error: '' });

  const colors = {
    error: 'error.main',
    success: 'success.main',
    default: 'primary.main',
  };

  const iconColor = colors.default;

  function validateData () {
    let errors = false;

    if (!price.value) {
      setPrice({ ...price, error: 'Campo Obrigatório' });
      errors = true;
    }

    if (!dateDeliveryProject.value || !dateDeliveryProject.value) {
      setDateDeliveryProject({ ...dateDeliveryProject, error: 'Campo Obrigatório' });
      errors = true;
    }

    if (!dateAgreedDelivery.value) {
      setDateAgreedDelivery({ ...dateAgreedDelivery, error: 'Campo Obrigatório' });
      errors = true;
    }

    !errors
      ? onConfirm({
        price,
        dateAgreedDelivery,
        dateDeliveryProject
      })
      : toast.error('Erros no formulário');
  }

  return <>
    <Notification />
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle color="link.main" id='alert-dialog-title' >
     Entrega do Orçamento
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box mb={1} sx={{ display: 'flex', justifyContent: 'center' }} color={iconColor}>
          <QuestionMark sx={{ fontSize: '80px' }} fontSize={'80px'} strokeWidth={1.5} />
        </Box>

        <DialogContentText id='alert-dialog-description'>
          <Typography variant='md'>
           Para finalizar a entrega do orçamento, por favor preencha a seguinte informação.
          </Typography>
        </DialogContentText>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container md={12} sm={12} xs={12}>
            <Grid container md={6} sm={6} xs={6} p={1}><MyInput type='currency' required value={price.value} error={price.error} label={'Valor total do projeto'} onChange={(e) => { setPrice({ value: e.target.value, error: '' }); }} /></Grid>
            <Grid container md={6} sm={6} xs={6} p={1}>
              <Box sx={{ width: '100%' }}>
                <InputLabel>
            Entrega do orçamento
                  <Tooltip title='Obrigatório' >
                    <span style={{ color: 'var(--red)' }}> *</span>
                  </Tooltip>

                </InputLabel>
                <DesktopDatePicker
                  sx={{ width: '100%' }}
                  inputFormat={'DD/MM/YYYY'}

                  value={dateAgreedDelivery.value}
                  onChange={(e, newValue) => setDateAgreedDelivery({ value: JSON.stringify(e?.$d) === 'null' ? newValue : e?.$d, name: 'dateRequest' })}
                  renderInput={(params) =>
                    <TextField fullWidth sx={{ width: '100%' }} {...params} error={dateAgreedDelivery.error} inputProps={{ sx: { color: dateAgreedDelivery.error && 'var(--red)' }, ...params.inputProps, placeholder: dateAgreedDelivery.error || 'DD/MM/YYYY' }}/>}
                />

              </Box>
            </Grid>
            <Grid container md={6} sm={6} xs={6} p={1}>
              <InputLabel>
              Entrega do projeto
                <Tooltip title='Obrigatório' >
                  <span style={{ color: 'var(--red)' }}> *</span>
                </Tooltip>
              </InputLabel>
              <DesktopDatePicker
                inputFormat={'DD/MM/YYYY'}
                value={dateDeliveryProject.value}
                onChange={(e, newValue) => setDateDeliveryProject({ value: JSON.stringify(e?.$d) === 'null' ? newValue : e?.$d, name: 'dateRequest' })}
                // onChange={(newValue) => onBudgetChange(newValue)}
                renderInput={(params) =>
                  <TextField fullWidth {...params} error={dateDeliveryProject.error} inputProps={{ sx: { color: dateDeliveryProject.error && 'var(--red)' }, ...params.inputProps, placeholder: dateDeliveryProject.error || 'DD/MM/YYYY' }}/>}
              />
            </Grid>
            { false && <Grid container md={6} sm={6} xs={6} p={1}><MyInput value={obs.value} error={obs.error} label={'Observações'} type='area' onChange={(e) => { setObs({ value: e.target.value, error: '' }); }} /></Grid>}
          </Grid>

        </LocalizationProvider>

      </DialogContent>
      <DialogActions>
        <Button onClick={validateData} autoFocus>
          <Typography color="link.main" >Confirmar</Typography>
        </Button>
        <Button onClick={handleClose} sx={{ color: 'var(--gray)' }}> Cancelar</Button>
      </DialogActions>
    </Dialog>
  </>;
};

DeliverBudgetModal.propTypes = {
  open: PropTypes.bool,
  onConfirm: PropTypes.func,
  handleClose: PropTypes.func,
  budget: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.object),
};

export default DeliverBudgetModal;
