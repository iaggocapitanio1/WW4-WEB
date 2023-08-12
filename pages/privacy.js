//  Nodes
import PropTypes from 'prop-types';
import React from 'react';
import PrivacyScreen from '../components/pages/privacy/privacy';

const Privacy = () => {
  const readOnly = true;

  const props = {
    readOnly
  };

  return <PrivacyScreen {...props} />;
};

Privacy.propTypes = {
  readOnly: PropTypes.bool
};

export default Privacy;
