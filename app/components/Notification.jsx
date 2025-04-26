import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const createNotification = ({ type, message, title }) => {
    const fullMessage = title ? `${title}: ${message}` : message;

    switch (type) {
        case 'info':
            toast.info(fullMessage || 'Info message');
            break;
        case 'success':
            toast.success(fullMessage || 'Success message');
            break;
        case 'warning':
            toast.warning(fullMessage || 'Warning message');
            break;
        case 'error':
            toast.error(fullMessage || 'Error message');
            break;
        default:
            break;
    }
};

const Notification = () => {
    return <ToastContainer />;
};

export { createNotification, Notification };
