import { useEffect } from "react";
import { privateApi } from "./clients";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = privateApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (
            originalRequest.url?.includes("/auth/sign-in") ||
            originalRequest.url?.includes("/auth/sign-up")
          ) {
            return Promise.reject(error);
          }

          if (originalRequest.url.includes("/auth/refresh")) {
            isRefreshing = false;
            toast.error("Session expired. Please log in again");
            navigate("/register-login", { replace: true });
            return Promise.reject(error);
          }

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return privateApi(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const { data } = await refreshClient.post("/auth/refresh", {
              refreshToken: localStorage.getItem("refreshToken"),
            });
            const newAccessToken = data.accessToken;
            const newRefreshToken = data.refreshToken;
            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            processQueue(null, newAccessToken);

            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return privateApi(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            toast.error("Session expired. Please log in again");
            navigate("/register-login", { replace: true });
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );

    return () => privateApi.interceptors.response.eject(responseInterceptor);
  }, [navigate]);

  return children;
};

export default AxiosInterceptor;
