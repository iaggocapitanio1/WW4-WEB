//  Nodes
import React from 'react';
import ForgotPasswordScreen from '../components/pages/forgotpassword/forgot-password';
import routes from '../navigation/routes';

const ForgotPassword = () => {
  const signinRoute = routes.public.signInInternal;

  const props = {
    signinRoute
  };

  return <ForgotPasswordScreen {...props} />;
};

ForgotPassword.propTypes = {

};

export default ForgotPassword;
