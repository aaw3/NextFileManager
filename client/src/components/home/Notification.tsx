import React, { useEffect } from "react";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 text-grey-900 dark:text-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 cursor-pointer transition-opacity duration-300 opacity-90 hover:opacity-100"
         onClick={onClose}>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white font-bold hover:text-gray-200 focus:outline-none">
        &times;
      </button>
    </div>
  );
};

export default Notification;
