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
      const ultiAuth = JSON.parse(localStorage.getItem("ulti_auth"));
      if (!ultiAuth) {
        window.location.href = "/";
        return;
      }
      config.headers.Authorization = `${
        JSON.parse(localStorage.getItem("ulti_auth")).accessToken
      }`;
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
      if (error.response.status === 401) {
        localStorage.removeItem("ulti_auth");
        localStorage.removeItem("ulti_user");
        window.location.reload();
      }
      console.log(error);
    }
  );
};

export default axiosInstance;
