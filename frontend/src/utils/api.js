import axios from 'axios';
import { toast } from 'react-toastify';

// 1. Create the connection to your Backend
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. Request Interceptor (Outgoing)
// Before sending any request, check if we have a token in local storage.
// If yes, attach it to the header so the backend knows who we are.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// 3. Response Interceptor (Incoming) -> THIS IS THE NEW PART
// This watches every response coming BACK from the backend.
api.interceptors.response.use(
    (response) => response, // If the response is good (200 OK), just pass it through.
    (error) => {
        // If the response is an error...

        // Check if the error code is 401 (Unauthorized)
        // This code  means the token is bad/expired.
        if (error.response && error.response.status === 401) {

            const currentPath = window.location.pathname;

            // We don't want to kick them out if they are already on the Login or Register page
            if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {

                // 1. Delete the bad token from storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // 2. Tell the user what happened
                toast.error("Session expired. Please login again.");

                // 3. Redirect them to Login page after 1.5 seconds
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            }
        }
        return Promise.reject(error);
    }
);

export default api;