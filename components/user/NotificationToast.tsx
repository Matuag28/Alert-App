
import React, { useEffect } from 'react';
import { Icon } from '../common/Icon';

interface NotificationToastProps {
  title: string;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ title, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Toast disappears after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 w-full max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon name="bell" className="h-6 w-6 text-indigo-500" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Reminder</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">{title}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
