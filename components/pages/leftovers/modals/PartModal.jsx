import { AppBar, Box, Dialog, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import { X } from 'lucide-react';
import React from 'react';
import PartCard from '../../../cards/PartCard';
import { Transition } from '../../factoryGround/factoryGround';
//  PropTypes
import PropTypes from 'prop-types';

const PartModal = (props) => {
  const { open, onClose, parts, onSubmit } = props;

  return <Dialog
    fullScreen
    open={open}
    onClose={onClose}
    TransitionComponent={Transition}
  >
    <AppBar position='sticky' component="nav" sx={{ backgroundColor: localStorage.getItem('theme') === 'light' && 'var(--primary-dark)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <X />
          </IconButton>
        </Box>
        <Box></Box>
        <Box></Box>
      </Toolbar>
    </AppBar>
    <Box>
      <Grid container md={12} p={2}>
        <Grid container md={12} p={2}>
          <Typography variant='title'>Escolher peça</Typography>
        </Grid>
        {parts?.map((part, i) =>
          <Grid key={i} container md={3} sm={6} xs={12} p={1} onClick={() => onSubmit(part)} >
            <PartCard part={part} />
          </Grid>
        )}

      </Grid>
    </Box>
  </Dialog>;
};

PartModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  parts: PropTypes.array,
  onSubmit: PropTypes.func
};

export default PartModal;
