import toast from 'react-hot-toast';

interface ToastOptions {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const useToast = () => {
  const showToast = ({ title, message, type }: ToastOptions) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      default:
        toast(message);
    }
  };

  return { showToast };
}; 