import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_BASE_URL}`,
  withCredentials: true,
});

const AUTH_WHITELIST = ["/auth/login", "/auth/signup", "/auth/refresh"];

let isRefreshing = false;
let queue: ((value?: unknown) => void)[] = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    // 🚫 Never run refresh logic on auth pages
    if (window.location.pathname.startsWith("/auth")) {
      return Promise.reject(error);
    }

    // 🚫 Never intercept auth endpoints
    if (AUTH_WHITELIST.some((p) => originalRequest.url?.includes(p))) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => queue.push(resolve)).then(() =>
        api(originalRequest)
      );
    }

    isRefreshing = true;

    try {
      await api.post("/auth/refresh");

      queue.forEach((resolve) => resolve());
      queue = [];

      return api(originalRequest);
    } catch (e) {
      queue = [];
      isRefreshing = false;

      window.location.href = "/auth/signin";
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);
