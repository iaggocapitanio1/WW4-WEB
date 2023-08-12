import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const TabPanel = ({ children, value, index, id, ...other }) => {
  return (
    <Box style={{ width: '100%' }} role="tabpanel" hidden={value !== index} id={id} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ width: '100%' }}><Typography>{children}</Typography></Box>}
    </Box>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired
};

export default TabPanel;
