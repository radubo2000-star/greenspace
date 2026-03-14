import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

let toastListeners: ((toast: ToastMessage) => void)[] = [];

export const toast = {
  success: (title: string, description?: string) => {
    const id = Math.random().toString(36).substring(7);
    const toastMessage: ToastMessage = { id, type: 'success', title, description };
    toastListeners.forEach(listener => listener(toastMessage));
  },
  error: (title: string, description?: string) => {
    const id = Math.random().toString(36).substring(7);
    const toastMessage: ToastMessage = { id, type: 'error', title, description };
    toastListeners.forEach(listener => listener(toastMessage));
  },
  info: (title: string, description?: string) => {
    const id = Math.random().toString(36).substring(7);
    const toastMessage: ToastMessage = { id, type: 'info', title, description };
    toastListeners.forEach(listener => listener(toastMessage));
  },
};

export const Toaster = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (toast: ToastMessage) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 5000);
    };

    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${getStyles(toast.type)} border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-in`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">
              {toast.title}
            </p>
            {toast.description && (
              <p className="text-gray-600 text-sm mt-1">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
