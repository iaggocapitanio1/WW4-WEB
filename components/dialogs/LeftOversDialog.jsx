import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid, TextField, Typography
} from '@mui/material';
import * as icons from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const LeftOversDialog = ({ open, handleClose, onConfirm, sizes, setSizes }) => {
  const [manually, setManualy] = useState(false);

  function onSizesChange (e) {
    e.preventDefault();

    const data = { ...sizes };

    data[e.target.name] = e.target.value;
    setSizes(data);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle color="link.main" id='alert-dialog-title' >
      Confirme os dados
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box mb={1} sx={{ display: 'flex', justifyContent: 'center' }}>
          <icons.Check size={80} strokeWidth={1.5} color='green' />
        </Box>
        <DialogContentText id='alert-dialog-description'>
          {!manually ? ' Estes tamanhos estão corretos?' : 'Preencha os dados em mm' }
        </DialogContentText>
        <Box mt={1}>
          <Grid container md={12}>
            {/* Header */}
            <Grid container md={12} sm={12} xs={12}>
              <Grid container md={4} sm={4} xs={4} sx={{ padding: 1, border: '1px solid', borderColor: 'divider' }}><Box sx={{ textAlign: 'center', width: '100%' }}><Typography variant='subtitle'> Comprimento</Typography></Box></Grid>
              <Grid container md={4} sm={4} xs={4} sx={{ padding: 1, border: '1px solid', borderColor: 'divider' }}><Box sx={{ textAlign: 'center', width: '100%' }}><Typography variant='subtitle'> Largura</Typography></Box></Grid>
              <Grid container md={4} sm={4} xs={4} sx={{ padding: 1, border: '1px solid', borderColor: 'divider' }}><Box sx={{ textAlign: 'center', width: '100%' }}><Typography variant='subtitle'> Espessura</Typography></Box></Grid>
            </Grid>
            <Grid container md={12} sm={12} xs={12}>
              <Grid container md={4} sm={4} xs={4} sx={{ padding: 1, border: '1px solid', borderColor: 'divider' }}><Box sx={{ textAlign: 'center', width: '100%' }}><Typography variant='subtitle'> <TextField variant={'standard'} disabled={!manually} onChange={(e) => onSizesChange(e)} type='number' value={sizes.comp} name="comp" /></Typography></Box></Grid>
              <Grid container md={4} sm={4} xs={4} sx={{ padding: 1, border: '1px solid', borderColor: 'divider' }}><Box sx={{ textAlign: 'center', width: '100%' }}><Typography variant='subtitle'> <TextField variant={'standard'} disabled={!manually} onChange={(e) => onSizesChange(e)} type='number' value={sizes.larg} name="larg" /></Typography></Box></Grid>
              <Grid container md={4} sm={4} xs={4} sx={{ padding: 1, border: '1px solid', borderColor: 'divider' }}><Box sx={{ textAlign: 'center', width: '100%' }}><Typography variant='subtitle'> <TextField variant={'standard'} disabled={!manually} onChange={(e) => onSizesChange(e)} type='number' value={sizes.esp} name="esp" /></Typography></Box></Grid>
            </Grid>
          </Grid>
        </Box>

      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          onConfirm(sizes);
          setManualy(false);
        }} autoFocus>
          <Typography color="link.main">Sim</Typography>
        </Button>
        <Button onClick={() => setManualy(true)} autoFocus sx={{ display: manually && 'none' }}>
          <Typography color="link.main">Não</Typography>
        </Button>
        <Button onClick={handleClose} sx={{ color: 'var(--gray)' }}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

LeftOversDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  onConfirm: PropTypes.func,
  sizes: PropTypes.object,
  setSizes: PropTypes.func,
  props: PropTypes.any,
};

export default LeftOversDialog;
