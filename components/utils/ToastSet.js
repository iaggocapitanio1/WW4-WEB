import { toast } from 'react-toastify';

function ToastSet (id, message, type) {
  return toast.update(id, {
    render: message,
    type,
    isLoading: false,
    autoClose: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
  });
}

export default ToastSet;
