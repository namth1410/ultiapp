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
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        error.response.data.errors[0]?.message === "ExpiredSignature"
      ) {
        try {
          const response = await handleRefreshToken(
            JSON.parse(localStorage.getItem("vtg_auth")).refresh_token
          );

          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.access_token}`;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export const handleRefreshToken = async (refreshToken) => {
  try {
    const response = await axiosInstance.post(
      "/api/openid-connect/token",
      {
        refresh_token: refreshToken,
      },
      { headers: { "content-type": "application/x-www-form-urlencoded" } }
    );

    localStorage.setItem("vtg_auth", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    window.location.href = "/class";
    localStorage.clear();
    throw error;
  }
};

export default axiosInstance;
