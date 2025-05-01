import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// interceptores de request
instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

// interceptores de response
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('Error en la respuesta:', error);
        
        const { status } = error.response;
        if (status === 401) {
            console.error('Unauthorized access - redirecting to login');
            // redirigir a la página de inicio de sesión
        } else if (status === 403) {
            console.error('Forbidden access - redirecting to home');
            // redirigir a la página de inicio
        } else if (status === 500) {
            console.error('Internal server error - please try again later');
        }
        return Promise.reject(error);
    }

)

export default instance;