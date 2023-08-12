import PropTypes from 'prop-types';
import React from 'react';

import { Box, Grow } from '@mui/material';
import styles from '../../styles/components/content.module.css';

const Content = ({ children }) => (
  <Grow in={true} >
    <Box bgcolor={'default.main'} className={styles.main}>
      {children}
    </Box>
  </Grow>
);

Content.propTypes = {
  children: PropTypes.any
};

export default Content;
