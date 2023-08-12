//  Nodes
import PropTypes from 'prop-types';
import React from 'react';
import TermsScreen from '../components/pages/terms/terms';

const Terms = () => {
  const readOnly = true;

  const props = {
    readOnly
  };

  return <TermsScreen {...props} />;
};

Terms.propTypes = {
  readOnly: PropTypes.bool
};

export default Terms;
