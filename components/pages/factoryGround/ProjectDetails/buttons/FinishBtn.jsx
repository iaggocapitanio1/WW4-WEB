import { Box, IconButton, Tooltip } from '@mui/material';
import { CheckCircle, Loader } from 'lucide-react';
import React from 'react';
//  Proptypes
import PropTypes from 'prop-types';

export const FinishBtn = (props) => {
  return !props.detailOnly
    ? (
      <IconButton onClick={() => props.onFinish(props)} >
        <Tooltip title={'Terminar'} >
          <CheckCircle color='green' />
        </Tooltip>
      </IconButton>
    )
    : <Tooltip title='Em produção'>
      <Box
        className="rotating fullCenter"
      >
        <Loader color='var(--primary)' />
      </Box>
    </Tooltip>;
};

FinishBtn.propTypes = {
  onFinish: PropTypes.func.isRequired,
  detailOnly: PropTypes.bool
};
