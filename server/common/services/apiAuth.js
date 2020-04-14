import axios from 'axios';

const api = (token) => {

    //Setup axios instance
    let restApi = axios.create({
        baseURL: process.env.API_URL,
        timeout: 10000
    });

    restApi.interceptors.request.use(config => {
        config.headers.Authorization = "Bearer "+token;
        config.headers['Content-Type'] = 'application/json';
        return config
    });

    return restApi;
}

export { api };