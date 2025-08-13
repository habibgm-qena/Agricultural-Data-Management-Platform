'use client';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './style.module.scss'

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error';
    duration?: number;
}

interface ToastContextType {
    addToast: (message: string, type: 'success' | 'error', duration?: number) => void;
}



// extend the window object to include the custom toast function
declare global {
    interface Window {
        _addCustomToast?: (message: string, type: 'success' | 'error', duration?: number) => void;
    }
}



const ToastContext = createContext<ToastContextType | null>(null);

const ToastItem = ({ id, message, type, duration, onClose }: Toast & { onClose: (id: string) => void }) => {

    const [isVisible, setIsVisible] = useState(false);

    const bgColor = type === 'success' ?  '--colorColorsAccentAccent12' : '--colorColorsRed9';
    const iconColor = type === 'success' ?  '--colorColorsGreen8' : '--colorColorsRed12' ;
    const textColor = 'text-white';
    const icon = type === 'success' ? <TickIcon /> : <CrossIcon />;

    const hideToast = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
    }, [id, onClose]);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            hideToast();
        }, duration || 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [duration, hideToast]);

    return (
        <div
            className={`
                fixed top-0 left-0 w-full p-1 py-2 mb-2 flex items-center justify-between
                ${bgColor} ${textColor} text-lg font-inter rounded-b-lg shadow-lg
                transform transition-all duration-300 ease-in-out z-50
                 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 text-center'}
                `}
            style={{ fontFamily: 'Inter, sans-serif', backgroundColor: `var(${bgColor})`, color: `var(${textColor})` }} >
            <div className="flex items-center w-full justify-center">
                <span className={`${styles.iconSize} mr-2`} 
                    style={{ color: `var(${iconColor})`}}>
                    {icon}
                   </span> 
                 <span className={styles.text}>{message}</span>
            </div>
            <button
                onClick={hideToast}
                className={`${styles.iconSize} mr-4 pr-4 text-white hover:text-gray-200 focus:outling-none text-2xl`}
                aria-label='Close'
            >
                {/* &times; */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <rect width="17.6" height="17.6" transform="translate(0.400391 0.429077)" fill="white" fillOpacity="0.01" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.2245 5.15947C14.488 4.896 14.488 4.46883 14.2245 4.20536C13.9611 3.94188 13.5339 3.94188 13.2705 4.20536L9.20083 8.27497L5.13123 4.20536C4.86774 3.94188 4.44057 3.94188 4.1771 4.20536C3.91362 4.46883 3.91362 4.896 4.1771 5.15947L8.24671 9.22909L4.1771 13.2987C3.91362 13.5622 3.91362 13.9893 4.1771 14.2528C4.44057 14.5163 4.86774 14.5163 5.13123 14.2528L9.20083 10.1832L13.2705 14.2528C13.5339 14.5163 13.9611 14.5163 14.2245 14.2528C14.488 13.9893 14.488 13.5622 14.2245 13.2987L10.1549 9.22909L14.2245 5.15947Z" fill="white" />
                </svg>
            </button>
        </div>
    );
}


const ToastContainer = () => {
    const [toasts, setToasts] = useState<any[]>([]);

    const addToast = useCallback((message: string, type: 'success' | 'error', duration?: number) => {
        const id = Date.now() + Math.random().toString(36).substring(2, 9);
        setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id: any) => {
        setToasts((prevToasts: any) => prevToasts.filter((toast: any) => toast.id !== id));
    }, []);


    useEffect(() => {
        window._addCustomToast = addToast;
        return () => {
            delete window._addCustomToast;
        };
    }, [addToast]);

    return ReactDOM.createPortal(
        <div className="toast-portal-container">
            {
                toasts.map((toast: any) => (
                    <ToastItem
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={removeToast}
                    />
                ))}
        </div>
        , document.body
    );
};


const customToast = {
    success: (message: string, duration?: number) => {

        if (window._addCustomToast) {
            window._addCustomToast(message, 'success', duration);
        } else {
            console.warn("ToastContainer not mounted. Please ensure ToastContainer is rendered in your app.");
        }
    },
    error: (message: any, duration = 5000) => {
        if (window._addCustomToast) {
            console.log("Adding custom error toast:", message, duration);
            window._addCustomToast(message, 'error', duration);
        } else {
            console.warn("ToastContainer not mounted. Please ensure ToastContainer is rendered in your app.");
        }
    }
}


export { ToastContext, ToastContainer, customToast };



const CrossIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
<rect width="17.6" height="17.6" transform="translate(0.200195 0.400024)" fill="white" fillOpacity="0.01"/>
<path fillRule="evenodd" clipRule="evenodd" d="M1.22949 9.19987C1.22949 4.90818 4.7086 1.42908 9.00028 1.42908C13.292 1.42908 16.771 4.90818 16.771 9.19987C16.771 13.4915 13.292 16.9706 9.00028 16.9706C4.7086 16.9706 1.22949 13.4915 1.22949 9.19987ZM9.00028 2.54374C5.32421 2.54374 2.34416 5.52379 2.34416 9.19987C2.34416 12.8759 5.32421 15.856 9.00028 15.856C12.6763 15.856 15.6564 12.8759 15.6564 9.19987C15.6564 5.52379 12.6763 2.54374 9.00028 2.54374ZM11.7619 6.4385C11.991 6.66761 11.991 7.03907 11.7619 7.26818L9.83009 9.2L11.7619 11.1318C11.991 11.3609 11.991 11.7324 11.7619 11.9615C11.5328 12.1906 11.1614 12.1906 10.9322 11.9615L9.00041 10.0297L7.06859 11.9615C6.83949 12.1906 6.46802 12.1906 6.23892 11.9615C6.00981 11.7324 6.00981 11.3609 6.23892 11.1318L8.17075 9.2L6.23892 7.26818C6.00981 7.03907 6.00981 6.66761 6.23892 6.4385C6.46802 6.2094 6.83949 6.2094 7.06859 6.4385L9.00041 8.37034L10.9322 6.4385C11.1614 6.2094 11.5328 6.2094 11.7619 6.4385Z" fill="#641723"/>
</svg>
);

const TickIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
  <rect width="17.6" height="17.6" transform="translate(0.700195 0.200012)" fill="white" fillOpacity="0.01"/>
  <path fillRule="evenodd" clipRule="evenodd" d="M9.50028 1.22906C5.2086 1.22906 1.72949 4.70817 1.72949 8.99986C1.72949 13.2915 5.2086 16.7706 9.50028 16.7706C13.792 16.7706 17.271 13.2915 17.271 8.99986C17.271 4.70817 13.792 1.22906 9.50028 1.22906ZM2.84416 8.99986C2.84416 5.32378 5.82421 2.34373 9.50028 2.34373C13.1763 2.34373 16.1564 5.32378 16.1564 8.99986C16.1564 12.6759 13.1763 15.656 9.50028 15.656C5.82421 15.656 2.84416 12.6759 2.84416 8.99986ZM12.6202 6.69761C12.8066 6.43264 12.743 6.06668 12.4781 5.88021C12.2131 5.69375 11.8471 5.7574 11.6606 6.02237L8.35025 10.7266L6.98571 9.33681C6.75871 9.10562 6.38727 9.10221 6.15607 9.32921C5.92487 9.55621 5.92147 9.92765 6.14847 10.1588L8.00624 12.051C8.12822 12.1753 8.2991 12.2389 8.47263 12.2247C8.64617 12.2106 8.80444 12.12 8.90464 11.9776L12.6202 6.69761Z" fill="#5BB98B"/>
</svg>
);

export default ToastContainer;