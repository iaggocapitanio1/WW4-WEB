import { AppBar, Box, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import Carousel from 'react-material-ui-carousel';
//  PropTypes
import PropTypes from 'prop-types';

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ImageViewer = ({ images, open, handleClose }) => {
  const [currentPanel, setCurrentPanel] = useState(0);

  // const images2 = [
  //     "http://placeimg.com/1200/800/nature",
  //     "http://placeimg.com/800/1200/nature",
  //     "http://placeimg.com/1920/1080/nature",
  //     "http://placeimg.com/1500/500/nature"
  // ];

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative', backgroundColor: localStorage.getItem('theme') === 'light' && 'var(--primary-dark)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <X />
          </IconButton>
          <Typography >
            {images ? currentPanel + 1 : 0} / {images?.length || 0}
          </Typography>
          <IconButton></IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ height: '80%', padding: '2% 10% 2% 10%' }}>
        <Carousel
          next={(next) => setCurrentPanel(next)}
          prev={(prev) => setCurrentPanel(prev)}
          active={currentPanel}
          autoPlay
          navButtonsAlwaysVisible
          indicators
          animation="slide"
          height={'80vh'}
        >
          {images?.map((imga, i) => <img key={i} src={imga} style={{ width: '100%' }} />)}
        </Carousel>

      </Box>

    </Dialog >
  );
};

ImageViewer.propTypes = {
  images: PropTypes.any,
  open: PropTypes.bool,
  handleClose: PropTypes.any
};

export default ImageViewer;
