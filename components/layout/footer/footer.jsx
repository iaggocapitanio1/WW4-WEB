/* eslint-disable react/prop-types */
// Node modules
import { Box, Grid, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';
import React from 'react';
import logosFooter from '../../../public/Fundos-Europeus.png';

// Pages without layout (sidebar + navbar + footer)
function Copyright () {
  return (<>

    <Typography variant='sm' >
      <Box component={'a'}>Desenvolvido por {' '}</Box>
      <Box component={'a'} color='primary.main' sx={{ cursor: 'pointer' }}><Tooltip title='Visite New Knowledge Advice'>
        <a href='https://nka.pt/' target='#' >NKA - New Knowledge Advice, Lda.</a>
      </Tooltip>
      </Box>
    </Typography>
  </>

  );
}

const Footer = (props) => {
  const isPublicPage = !!props.isPublicPage;

  function Confinanced () {
    return <Box component='a'
      target='#'
      href={'http://mofreita.com/wp-content/uploads/2022/08/72593_ww4.0_modelo_pag_web_0_norte2020_v2.pdf'} style={{ display: !isPublicPage && 'none' }}>
      <Image
        alt='Footer Logo'
        placeholder='blur'
        priority
        src={ logosFooter }
      />
    </Box>;
  }

  const width = 12;

  return typeof window !== 'undefined' && (
    <Grid
      container
      bgcolor={'default.main'}
      md={12}
      sm={12}
      xs={12}
      sx={{ borderTop: '1px solid var(--grayEdges)', overflow: 'hidden', position: !isPublicPage && 'fixed', bottom: !isPublicPage && '0', backgroundColor: 'white' }}
      p={1}
    >
      <Grid container xl={width} lg={width} md={width} sm={12} xs={12} sx={{ justifyContent: isPublicPage && 'center' }} ><Copyright /></Grid>
      {isPublicPage && <Grid container xl={width} lg={width} md={width} sm={12} xs={12} sx={{ justifyContent: isPublicPage && 'center' }} display={{ xl: 'flex', mg: 'flex', md: 'flex', sm: !isPublicPage ? 'none' : 'flex', xs: !isPublicPage ? 'none' : 'flex' }} ><Confinanced /></Grid>}
    </Grid >
  );
};

export default Footer;
