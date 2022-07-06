import { toast } from 'react-toastify';

/* * * * * */
/* UI NOTIFICATIONS (TOASTS) */
/* * */

export default async function notify(identifier, type, title) {
  //

  const defaultOptions = {
    autoClose: 5000,
  };

  switch (type) {
    case 'loading':
      toast.loading(title, { toastId: identifier });
      break;

    case 'success':
      toast.update(identifier, { ...defaultOptions, render: title, type: 'success', isLoading: false });
      break;

    case 'error':
      toast.update(identifier, { ...defaultOptions, render: title, type: 'error', isLoading: false });
      break;

    default:
      break;
  }
}
