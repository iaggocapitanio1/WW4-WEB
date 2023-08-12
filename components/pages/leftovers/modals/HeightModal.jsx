import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import PrimaryBtn from '../../../buttons/primaryBtn';
import MyInput from '../../../inputs/myInput';

const HeightModal = (props) => {
  const { open, onClose, onConfirm } = props;
  const [height, setHeight] = useState(props.height);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className='fullCenter'

    >
      <DialogTitle color="link.main">
        <Typography variant='md'>Escolha a espessura</Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ minWidth: '400px' }}>
        <Box sx={{ background: 'white', width: '100%' }}>
          <MyInput fullWidth onChange={(e) => setHeight(e.target.value)} type='number' value={height} label='Espessura' />
        </Box>
      </DialogContent>
      <DialogActions>
        <PrimaryBtn onClick={() => onConfirm(height)} autoFocus>
          <Typography>Concordo</Typography>
        </PrimaryBtn>
        <PrimaryBtn onClick={onClose} light >Cancelar</PrimaryBtn>
      </DialogActions>
    </Dialog>
  );
};

HeightModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  height: PropTypes.any,
  setHeight: PropTypes.func,
};

export default HeightModal;
