import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Typography } from '@mui/material';
import React from 'react';
//  PropTypes
import { QuestionMark } from '@mui/icons-material';
import PropTypes from 'prop-types';

const AdjudicateBudgetModal = (props) => {
  const { open, onConfirm, handleClose } = props;

  return <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby='alert-dialog-title'
    aria-describedby='alert-dialog-description'
  >
    <DialogTitle color="link.main" id='alert-dialog-title' >
     Adjudicação de projeto
    </DialogTitle>
    <Divider />
    <DialogContent>
      <Box mb={1} sx={{ display: 'flex', justifyContent: 'center' }} color='primary.main'>
        <QuestionMark sx={{ fontSize: '80px' }} fontSize={'80px'} strokeWidth={1.5} />
      </Box>

      <DialogContentText id='alert-dialog-description'>
        <Typography variant='md'>
          Está prestes a adjudicar este projeto. Quer continuar?
        </Typography>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onConfirm} autoFocus>
        <Typography color="link.main" >Confirmar</Typography>
      </Button>
      <Button onClick={handleClose} sx={{ color: 'var(--gray)' }}> Cancelar</Button>
    </DialogActions>
  </Dialog>;
};

AdjudicateBudgetModal.propTypes = {
  open: PropTypes.bool,
  onConfirm: PropTypes.func,
  handleClose: PropTypes.func,
  budget: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.object),
};

export default AdjudicateBudgetModal;
