import { QuestionMark } from '@mui/icons-material';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import PrimaryBtn from '../buttons/primaryBtn';

const ConfirmDialog = ({ open, handleClose, onConfirm, message, title, iconType, confirmText, cancelText, inputs }) => {
  const colors = {
    error: 'error.main',
    success: 'success.main',
    default: 'primary.main',
  };

  const iconColor = colors[iconType || 'default'];
  const ref = useRef(null);
  const isMobile = ref.current && ref.current?.offsetWidth < 500;

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

  return (
    <Box ref={ref} sx={{ width: '100%', position: 'absolute' }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullScreen={isMobile}
        PaperComponent={PaperComponent}
      >
        <DialogTitle id="draggable-dialog-title" sx={{ cursor: 'move', backgroundColor: isMobile && 'default.sides', color: isMobile && 'white' }}>
          <Typography variant='h6' color={!isMobile && 'primary'}>
            {title || 'Confirmar Ação'}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ display: 'flex', alignItems: 'center' }} >
          <Box sx={{ minHeight: isMobile && '450px' }}>
            <Box mb={1} sx={{ display: 'flex', justifyContent: 'center' }} color={iconColor} >
              <QuestionMark sx={{ fontSize: isMobile ? '150px' : '80px' }}strokeWidth={1.5} />
            </Box>
            <DialogContentText id='alert-dialog-description' variant='body1' sx={{ position: 'sticky', marginTop: isMobile && '30%' }}>
              {message || 'A ação que está a fazer é irreversível. Tem certeza que quer continuar?'}
            </DialogContentText>
            {inputs}

          </Box>
        </DialogContent>
        <DialogActions>
          <PrimaryBtn text={confirmText || 'Sim'} onClick={onConfirm} color={'primary'} />
          <PrimaryBtn text={cancelText || 'Não'} onClick={handleClose} light />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.any,
  handleClose: PropTypes.any,
  onConfirm: PropTypes.any,
  message: PropTypes.any,
  title: PropTypes.any,
  icon: PropTypes.any,
  iconType: PropTypes.any,
  confirmText: PropTypes.any,
  cancelText: PropTypes.any,
  inputs: PropTypes.any,
};

export default ConfirmDialog;
