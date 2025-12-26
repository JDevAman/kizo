import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_BASE_URL}`,
  withCredentials: true,
});

let isRefreshing = false;
let queue: ((value?: unknown) => void)[] = [];

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    // 🔒 HARD STOP: if refresh endpoint itself failed
    if (originalRequest?.url?.includes("/auth/refresh")) {
      queue = [];
      isRefreshing = false;

      // optional: clear frontend state here if you want
      window.location.replace("/auth/signin");

      return Promise.reject(error);
    }

    // 🔁 Access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If refresh already in progress, wait
      if (isRefreshing) {
        return new Promise(resolve => queue.push(resolve)).then(() =>
          api(originalRequest)
        );
      }

      isRefreshing = true;

      try {
        await api.post("/auth/refresh"); // may succeed or fail

        queue.forEach(resolve => resolve());
        queue = [];

        return api(originalRequest);
      } catch (e) {
        // 🔒 refresh failed → STOP EVERYTHING
        queue = [];
        window.location.replace("/auth/signin");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
