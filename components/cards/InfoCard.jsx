//  Nodes
import React from 'react';

//  PropTypes
import PropTypes from 'prop-types';
//  Material Ui
import { Grid, Grow, Tooltip, Typography } from '@mui/material';

//  Styles
import styles from '../../styles/components/infoCard.module.css';

const InfoCard = ({ title, icon, amount, color }) => {
  const style = {
    color: `${color}`,
  };

  return (
    <Grow in={true}>
      <Tooltip title={`Ver ${title}`}>
        <Grid container bgcolor={'default.main'} md={12} sm={12} xs={12} className={styles.card} style={style}>
          <Grid container md={3} sm={3} xs={12} justifyContent={'center'} alignItems={'center'} sx={{ height: '100%', maxHeight: '75px' }}>{icon}</Grid>
          <Grid container md={9} sm={9} xs={12} justifyContent={'center'} alignItems={'center'}>

            <Grid container justifyContent={'center'} alignItems={'center'} md={12} sm={12} xs={12} ><Typography variant='md' className={styles.cardTitle}>{title}</Typography></Grid>
            <Grid container justifyContent={'center'} alignItems={'center'} md={12} sm={12} xs={12} ><Typography variant='xxl'>{amount} {'Projeto(s)'}</Typography></Grid>
          </Grid>
        </Grid>
      </Tooltip>
    </Grow>
  );
};

InfoCard.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.any,
  amount: PropTypes.number,
  color: PropTypes.string
};

export default InfoCard;
