import { AppBar, Box, Dialog, Grid, IconButton, Toolbar } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import companyLogo from '../../../../public/Logotipo_Vetorizado.png';

// import companyLogo from '../../../../public/Logotipo_Vetorizado.png';
import woodWorkyLogo from '../../../../public/logo_bw_ww40_inv-big.png';
import PrimaryBtn from '../../../buttons/primaryBtn';

const FinishProjectModal = (props) => {
  // eslint-disable-next-line react/prop-types
  const { open, handleClose, onConfirm } = props;
  const [openScanner, setOpenScanner] = useState(false);
  const detailOnly = true;

  function InitiateScanner () {
    setOpenScanner(true);

    const scanner = new Html5QrcodeScanner('reader', {
      // Scanner will be initialized in DOM inside element with id of 'reader'
      qrbox: {
        width: 250,
        height: 250,
      }, // Sets dimensions of scanning box (set relative to reader element width)
      fps: 60, // Frames per second to attempt a scan
    });

    scanner.render(success);
    // Starts scanner

    function success () {
      // Prints result as a link inside result element
      scanner.clear();
      // Clears scanning instance
      // document.getElementById('reader').remove();
      onConfirm();
      // Removes reader element from DOM since no longer needed
    }
  }

  return <Dialog
    fullScreen
    open={open}
    onClose={() => handleClose()}
    sx={{ display: !open && 'none' }}
  >

    <AppBar position='sticky' component="nav" sx={{ backgroundColor: localStorage.getItem('theme') === 'light' && 'var(--primary-dark)' }}>
      <Toolbar>
        <Grid container>
          <Grid container md={6} sm={6} xs={6} p={1} >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => handleClose()}
                aria-label="close"
              >
                <X />
              </IconButton>
              <Box p={detailOnly && 1}>
                <Image
                  src={companyLogo}
                  alt={'companyLogo'}
                  placeholder='blur'
                  height={!detailOnly ? 50 : 40}
                  width={!detailOnly ? 100 : 80}
                  loading='lazy'
                />
              </Box>
            </Box>
          </Grid>
          <Grid container md={6} sm={6} xs={6} p={1} justifyContent='end'>
            <Box className='fullCenter'>
              <Box p={detailOnly && 1}>
                <Image
                  src={woodWorkyLogo}
                  alt={'woodWork Logo'}
                  placeholder='blur'
                  height={!detailOnly ? 50 : 40}
                  width={!detailOnly ? 50 : 40}
                  loading='lazy'
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
    <Box sx={{ width: '50%', heihgt: '50%' }}>

    </Box>
    {/* <Box justifyContent={'center'} sx={{ width: '100%', height: '50%', border: '10px solid black' }}>
      <Box justifyContent={'center'} sx={{ height: '50%', border: '1px solid red' }}>
        <Box className='fullCenter' sx={{ height: '50%', width: '50%', border: '1px solid red' }}>
          <QrReaderComp onScanned={onConfirm} />
        </Box>
      </Box>
    </Box> */}
    <Box className='fullCenter' sx={{ width: '100%', height: '100%' }}>
      {!openScanner &&
        <PrimaryBtn text='Scan' onClick={InitiateScanner} />
      }
      <div id="reader"></div>
      <div id="result"></div>

    </Box>
  </Dialog>;
};

export default FinishProjectModal;
