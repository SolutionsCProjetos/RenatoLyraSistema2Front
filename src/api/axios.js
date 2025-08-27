import axios from "axios";

const instance1 = axios.create({
    
    // baseURL: 'http://63.142.255.87:3001/',
    baseURL: 'https://renato-lyra-sistema2-back.vercel.app/api/',
    headers: {
        'Content-type': 'application/json'
    },
});

instance1.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const instance2 = axios.create({
    baseURL: 'https://viacep.com.br/ws'
});

export { instance1, instance2 };
