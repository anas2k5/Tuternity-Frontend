import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

// Attach correct token for NEW users (accessToken)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Refresh token logic
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If token expired → refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const res = await axios.post("http://localhost:8081/api/auth/refresh-token", {
            refreshToken,
          });

          const newToken = res.data.accessToken;
          localStorage.setItem("accessToken", newToken);

          // retry previous call
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return api(originalRequest);

        } catch (err) {
          console.log("Refresh token expired. Logging out...");
          localStorage.clear();
          window.location.href = "/login";
        }
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
