import React from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const createNotification = ({ type, message, title }) => {
    switch (type) {
        case 'info':
            NotificationManager.info(message || 'Info message', title || 'Info');
            break;
        case 'success':
            NotificationManager.success(message || 'Success message', title || 'Success');
            break;
        case 'warning':
            NotificationManager.warning(message || 'Warning message', title || 'Warning', 3000);
            break;
        case 'error':
            NotificationManager.error(message || 'Error message', title || 'Error', 5000, () => {
                alert('callback');
            });
            break;
        default:
            break;
    }
};

const Notification = () => {
    return (
        <div>
            <NotificationContainer />
        </div>
    );
};

export { createNotification, Notification };
