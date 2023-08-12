import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { ChevronUp } from 'lucide-react';
import React from 'react';
import styles from '../../styles/404.module.css';
//  PropTypes
import PropTypes from 'prop-types';

const FloatingButton = ({ isVisible }) => {
  return (
    <Box className={styles.floatingBtnContainer} style={{ display: !isVisible && 'none', position: 'fixed', bottom: '6%', right: '3%' }}>
      <Fab
        aria-label="like"
        size={'small'}
        color={'primary'}
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
      >
        <ChevronUp color="white" />
      </Fab>
    </Box>
  );
};

FloatingButton.propTypes = {
  isVisible: PropTypes.bool
};

export default FloatingButton;
