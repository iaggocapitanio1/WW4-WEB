import { IconButton, Tooltip } from '@mui/material';
import { Check } from 'lucide-react';
import React from 'react';
//  Proptypes
import PropTypes from 'prop-types';

export const DoneBtn = (props) => {
  return !props.detailOnly
    ? (
      <IconButton>
        <Tooltip title={'Feito'} >
          <Check color='green' />
        </Tooltip>
      </IconButton>
    )
    : <Tooltip title='Completo'><Check color='green' /></Tooltip>;
};

DoneBtn.propTypes = {
  onFinish: PropTypes.func.isRequired,
  detailOnly: PropTypes.bool
};
