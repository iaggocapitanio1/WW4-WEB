/* eslint-disable no-unused-vars */
import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

const HeaderGrid = (props) => {
  const commonProps = {
    sx: {
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid',
      borderColor: 'divider',
      padding: '.5rem',
      textAlign: 'center',
      height: 'fit-content'
    },
  };

  const upperCells = {
    ...commonProps,
    sx: {
      ...commonProps.sx,
      backgroundColor: '#F9F9F9',
      textAlign: 'center',
    },
  };

  const [windowWidth, setWindowWidth] = useState(1000);

  function countColls (data) {
    return data?.reduce((count, obj) => count + obj.colls.length, 0);
  }

  const collCount = countColls(props.grids);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return props.grids.map((grid) => {
    return (<Grid key={grid.title} container md={12 / collCount * grid.colls.length} pt={2} sx={{ pl: 0.5, pr: 0.5, height: '100%' }}>
      <Grid item md={12} {...upperCells} style={{}}>
        <Typography variant='subtitle1' fontWeight='bold'>
          {grid.title}
        </Typography>
      </Grid>
      {windowWidth > 600
        ? (
          <>
            <Grid container md={12} sm={12} xs={12} sx={{ }}>
              {grid.colls.map((headCell) => (
                <Grid key={headCell.label} {...upperCells} md={12 / grid.colls.length} sm={12 / grid.colls.length} xs={12} style={{ height: '100%' }}>
                  <Typography variant='sm'>{headCell.label}</Typography>
                </Grid>
              ))}
            </Grid>
            <Grid container md={12}>
              {grid.colls.map((headCell, index) => (
                <Grid key={index} {...commonProps} md={12 / grid.colls.length} sm={12 / grid.colls.length} xs={12}>
                  <Typography variant='sm'> {headCell.value || '\u00A0'}</Typography>
                </Grid>
              ))}
            </Grid>
          </>
        )
        : (
          <>
            {grid.colls.map(item => (
              <Grid key={item.label} container md={12}>
                <Grid {...commonProps} md={6} sm={6} xs={6} sx={{ ...commonProps.sx, justifyContent: 'start', backgroundColor: '#F9F9F9' }}>
                  {item.label}
                </Grid>
                <Grid {...commonProps} md={6} sm={6} xs={6} sx={{ ...commonProps.sx, backgroundColor: 'white', height: '100%' }}>
                  <Typography variant='sm'>{item.value || '\u00A0'}</Typography>
                </Grid>
              </Grid>
            ))}
          </>
        )}
    </Grid>

    );
  });
};

export default HeaderGrid;
