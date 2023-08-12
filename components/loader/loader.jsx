import React from 'react';

//  PropTypes
import PropTypes from 'prop-types';

import { Backdrop } from '@mui/material';
import { useSelector } from 'react-redux';
import styles from '../../styles/components/loader.module.css';
import { themes } from '../themes/themes';

const Loader = ({ center, backdrop, noPos }) => {
  let style = {};
  const appStates = useSelector((state) => state.appStates);

  if (center) {
    style = {
      display: 'block',
      position: 'absolute',
      top: '50%',
      left: '50%',
      height: '50px',
      width: '50px',
      margin: '-25px 0 0 -25px'
    };
  }

  return backdrop
    ? <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme?.zIndex.drawer + 1 }}
        open={true}
      >
        <div className={styles.bars5}>
          <span style={{ background: themes[appStates.themeColor].primary.main }}></span>
          <span style={{ background: themes[appStates.themeColor].primary.main, opacity: '0.7' }}></span>
          <span style={{ background: themes[appStates.themeColor].primary.main, opacity: '0.5' }}></span>
          <span style={{ background: themes[appStates.themeColor].primary.main, opacity: '0.3' }}></span>
          <span style={{ background: themes[appStates.themeColor].primary.main, opacity: '0.1' }}></span>
        </div>

      </Backdrop>
    </>
    : <div style={style}>
      <div className={styles.bars5}>
        <span style={{ background: themes[appStates.themeColor].primary.main, position: noPos && 'relative' }}></span>
        <span style={{ background: themes[appStates.themeColor].primary.main, opacity: '0.7' }}></span>
        <span style={{ background: themes[appStates.themeColor].primary.main, opacity: '0.5' }}></span>
        <span style={{ background: themes[appStates.themeColor].primary.main, opacity: '0.3' }}></span>
        <span style={{ background: themes[appStates.themeColor].primary.main, opacity: '0.1' }}></span>
      </div>
    </div>;
};

Loader.propTypes = {
  center: PropTypes.any,
  backdrop: PropTypes.bool,
  noPos: PropTypes.bool,
};

export default Loader;
