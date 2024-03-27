import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000 * 60,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupAxios = () => {
  axiosInstance.interceptors.request.use(
    (config) => {
      config.withCredentials = true;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.log(error);

      if (error.response.data === "login") {
        window.location.href = `${process.env.REACT_APP_HOST}/login`;
      }
    }
  );
};

export default axiosInstance;
