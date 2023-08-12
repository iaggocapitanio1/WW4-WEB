//  Nodes
import React from 'react';

import PropTypes from 'prop-types';

import { Box, Button, Grow, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';

const PrimaryBtn = ({ text, icon, light, onClick, disabled, noBorder, children, title, hidden, fullWidth, type, id, sx, breathing, otherProps, color, href, variant }) => {
  const style = {
    color: light ? (color ? (color + '.main') : 'black') : (color || 'var(--white)'),
    pointerEvents: disabled ? 'none' : 'all',
    border: noBorder && 'none',
    borderColor: light ? (color ? (color + '.main') : 'lightGray.edges') : 'inherit',
    borderRadius: '4px',
    maxHeight: '30px',
    backgroundColor: light && 'transparent',
    overflow: 'hidden',
  };

  return !hidden && (
    <>
      <Grow in={true}>
        <Tooltip title={title || ''}>
          <Button
            {...otherProps}
            color={color}
            disabled={disabled}
            className={breathing && 'breathingBackgroundWarning'}
            id={id}
            fullWidth={fullWidth}
            variant={light ? 'outlined' : (variant || 'contained')}
            type={type}
            onClick={onClick}
            component={'label'}
            sx={{
              ...style,
              ...sx,
            }}
            href={href}
            startIcon={icon}
          >
            {href && <Box component={Link} href={href}
              sx={{
                ...style,
                ...sx,
                background: 'transparent',
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}></Box>}
            <Typography sx={{ whiteSpace: 'nowrap' }} variant="sm">
              {text}
            </Typography>
            {/* Children are for file Inputs */}
            {children}

          </Button>
        </Tooltip>
      </Grow>

    </>
  );
};

PrimaryBtn.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.any,
  light: PropTypes.bool,
  breathing: PropTypes.bool,
  fullWidth: PropTypes.bool,
  hidden: PropTypes.bool,
  color: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any,
  disabled: PropTypes.bool,
  noBorder: PropTypes.bool,
  type: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.string,
  variant: PropTypes.string,
  sx: PropTypes.object,
  otherProps: PropTypes.object,
};

export default PrimaryBtn;
