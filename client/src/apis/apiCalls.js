import axios from 'axios';

const api = () => {

    //Setup axios instance
    let baseUrl = new URL('/',location.href).href;
    baseUrl = baseUrl.substr(0,baseUrl.length-1)+process.env.REACT_APP_API_PORT
    let restApi = axios.create({
        baseURL: baseUrl,
        timeout: 10000
    });

    //If access-token is available in storage, setup request interceptor on our instance
    if(localStorage.getItem("jwt-access-token")){
        restApi.interceptors.request.use(config => {
            config.headers.Authorization = "Bearer "+localStorage.getItem("jwt-access-token");
            config.headers['Content-Type'] = 'application/json';
            return config
        })
    }

    restApi.interceptors.response.use((response) => {
        return response //Let normal responses pass through
    }, (error) => {
        if (error.response.status === 401 || error.response.status === 403) {
            localStorage.removeItem("jwt-refresh-token");
            localStorage.removeItem("jwt-access-token");
            window.location.href="/login";
    }});

    // //Setup automated refreshing of token upon expiry
    //
    // restApi.interceptors.response.use((response) => {
    //     return response //Let normal responses pass through
    // }, (error) => {
    //         if (error.response.status === 401 || error.response.status === 403) {
    //             let instance = axios.create({
    //                 baseURL: process.env.REACT_APP_API_URL,
    //                 headers: { Authorization: "Bearer "+localStorage.getItem("jwt-access-token") }
    //             });
    //             console.log("Token expiry error intercepted. Sending request for new access token.")
    //             //Let's try to use our refresh token to get a new access token.
    //             return instance.post('/auth/refresh',
    //                 {"refresh_token": localStorage.getItem("jwt-refresh-token")})
    //                 .then(resp => {
    //                     if (resp && resp.status === 201) {
    //                         console.log("Success! Obtained new access token. Now repeating original request.")
    //                         // put new tokens in LocalStorage
    //                         localStorage.setItem("jwt-refresh-token",resp.data.refreshToken);
    //                         localStorage.setItem("jwt-access-token",resp.data.accessToken);
    //                         // 2) Change Authorization header
    //                         axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("jwt-access-token");
    //                         // 3) return originalRequest object with Axios.
    //                         return restApi.get("/users").then(resp=>{
    //                           return resp
    //                         });
    //                     }
    //                 }).catch(err=>{
    //                     //Error, redirect to login
    //                     console.log("Error requesting new access token. Redirecting to /login.")
    //                     window.location.href = "/login";
    //                 })
    //         }
    //         else{
    //             //redirect to login
    //             window.location.href = "/login";
    //         }
    //     })
    return restApi;
}

export { api };