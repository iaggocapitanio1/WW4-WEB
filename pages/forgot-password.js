//  Nodes
import React from 'react';
import ForgotPasswordScreen from '../components/pages/forgotpassword/forgot-password';
import routes from '../navigation/routes';

//  Navigation

//  PropTypes

//  Styling

const ForgotPassword = () => {
  const signinRoute = routes.public.signIn;

  const props = {
    client: true,
    signinRoute
  };

  return <ForgotPasswordScreen {...props} />;
};

ForgotPassword.propTypes = {

};

export default ForgotPassword;
