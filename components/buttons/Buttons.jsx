import { ButtonGroup, Divider, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVertical } from 'lucide-react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import PrimaryBtn from './primaryBtn';

const Buttons = (props) => {
  const { buttons, sx } = props;
  const [windowWidth, setWindowHeight] = useState();

  if (typeof window !== 'undefined') {
    useEffect(() => {
      setWindowHeight(window.innerWidth);
    }, [window.innerWidth]);
  }

  const listenToResize = () => {
    setWindowHeight(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', listenToResize);

    return () => window.removeEventListener('resize', listenToResize);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return <>
    {windowWidth > 800
      ? <ButtonGroup sx={{ boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)', height: 'fit-content', border: '1px solid', borderColor: 'divider', ...sx }}>
        {buttons.map((btn, index) => {
          return btn?.text && <>
            <PrimaryBtn key={index} {...btn} variant={btn.variant || 'outlined'} sx={{ ...btn.sx, borderColor: 'transparent' }} />
          </>;
        })}
      </ButtonGroup>
      : <>
        {buttons.find(ele => ele.text && !ele.hidden) && <IconButton onClick={handleClick}>
          <MoreVertical />
        </IconButton>}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
        >
          {buttons.map(btn => {
            return !btn.hidden &&
            <>
              {btn.divider && <Divider />}
              <MenuItem href={btn.href} onClick={() => {
                handleClose();
                !btn?.href ? btn?.onClick() : Router.push(btn?.href);
              }} sx={{ color: btn?.color + '.main' }} key={btn?.text} >
                <Grid container md={12} sm={12} xs={12}>
                  <Grid container md={2} sm={2} xs={2} justifyContent={'center'} alignItems={'center'}>
                    {btn?.icon}
                  </Grid>
                  <Grid sx={{ pl: 1 }} container md={10} sm={10} xs={10} alignItems={'center'}>
                    {btn?.text}
                  </Grid>
                </Grid>
              </MenuItem>
            </>;
          })}

        </Menu>
      </>
    }
  </>;
};

Buttons.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.object),
  sx: PropTypes.object
};

export default Buttons;
