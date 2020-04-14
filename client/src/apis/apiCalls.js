import axios from 'axios';

const api = () => {

    //Setup axios instance
    let restApi = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
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

    //setup error interceptor on our instnace
    restApi.interceptors.response.use((response) => {
        return response //Let normal responses pass through
    }, (error) => {
            if (error.response.status === 401 || error.response.status === 403) {
                let instance = axios.create({
                    baseURL: process.env.REACT_APP_API_URL,
                    headers: { Authorization: "Bearer "+localStorage.getItem("jwt-access-token") }
                });
                console.log("Token expiry error intercepted. Sending request for new access token.")
                //Let's try to use our refresh token to get a new access token.
                return instance.post('/auth/refresh',
                    {"refresh_token": localStorage.getItem("jwt-refresh-token")})
                    .then(resp => {
                        if (resp && resp.status === 201) {
                            console.log("Success! Obtained new access token. Now repeating original request.")
                            // put new tokens in LocalStorage
                            localStorage.setItem("jwt-refresh-token",resp.data.refreshToken);
                            localStorage.setItem("jwt-access-token",resp.data.accessToken);
                            // 2) Change Authorization header
                            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("jwt-access-token");
                            // 3) return originalRequest object with Axios.
                            return restApi.get("/users").then(resp=>{
                              return resp
                            });
                        }
                    }).catch(err=>{
                        //Error, redirect to login
                        console.log("Error requesting new access token. Redirecting to /login.")
                        window.location.href = "/login";
                    })
            }
            else{
                //redirect to login
                window.location.href = "/login";
            }
        })
    return restApi;
}

export { api };