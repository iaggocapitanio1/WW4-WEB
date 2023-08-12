
import PropTypes from 'prop-types';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
  return (
    <ToastContainer
      position="bottom-left"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      bodyStyle={{ height: '10px' }}
    />
  );
};

Notification.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.any,
};

export default Notification;
