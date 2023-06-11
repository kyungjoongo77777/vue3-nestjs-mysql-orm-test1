import axios from "axios";

export const axiosInstance = axios.create({
    //baseURL: END_POINT_PREFIX,
    //timeout: 1000 * 20,
});

axiosInstance.interceptors.request.use(
    config => {
        config.headers["Authorization"] = "bearer " + localStorage.getItem('accessToken');
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);