/**
 * Toast Component
 * Notification toast messages
 */

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { TOAST_TYPES } from '../../../config/constants';

const Toast = ({ id, message, type, duration, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);
  
  const icons = {
    [TOAST_TYPES.SUCCESS]: CheckCircle,
    [TOAST_TYPES.ERROR]: AlertCircle,
    [TOAST_TYPES.WARNING]: AlertTriangle,
    [TOAST_TYPES.INFO]: Info,
  };
  
  const styles = {
    [TOAST_TYPES.SUCCESS]: 'bg-success-50 border-success-500 text-success-900',
    [TOAST_TYPES.ERROR]: 'bg-danger-50 border-danger-500 text-danger-900',
    [TOAST_TYPES.WARNING]: 'bg-warning-50 border-warning-500 text-warning-900',
    [TOAST_TYPES.INFO]: 'bg-primary-50 border-primary-500 text-primary-900',
  };
  
  const iconColors = {
    [TOAST_TYPES.SUCCESS]: 'text-success-600',
    [TOAST_TYPES.ERROR]: 'text-danger-600',
    [TOAST_TYPES.WARNING]: 'text-warning-600',
    [TOAST_TYPES.INFO]: 'text-primary-600',
  };
  
  const Icon = icons[type];
  
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-medium animate-slide-down ${styles[type]}`}>
      <Icon className={`flex-shrink-0 ${iconColors[type]}`} size={20} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default Toast;
