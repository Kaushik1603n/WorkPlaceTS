import axios, { isAxiosError } from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestHeaders,
} from "axios";

type ApiResponse<T = unknown> = {
  data: T;
  message?: string;
  status?: number;
};

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  } as AxiosRequestHeaders,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        console.error("Refresh token failed - logging out");
        localStorage.removeItem("access_token");
        window.dispatchEvent(new CustomEvent("logout"));
        window.location.href = `/login?unauth=true&message=${encodeURIComponent(
          "Your session has expired."
        )}`;
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        console.log("Attempting token refresh...");

        const refreshResponse = await axiosClient.post<{ accessToken: string }>(
          "/auth/refresh"
        );

        if (refreshResponse.data.accessToken) {
          localStorage.setItem(
            "access_token",
            refreshResponse.data.accessToken
          );

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          }

          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        if (isAxiosError(refreshError) && refreshError.response?.data?.shouldLogout) {
          window.dispatchEvent(new CustomEvent("logout"));
          window.location.href = `/login?unauth=true&message=${encodeURIComponent(
            "Your session has expired."
          )}`;
        }
        localStorage.removeItem("access_token");
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      const errorMessage = "Your account has been blocked.";

      if (errorMessage.includes("blocked")) {
        localStorage.removeItem("access_token");

        window.dispatchEvent(
          new CustomEvent("auth-blocked", {
            detail: { message: errorMessage },
          })
        );

        window.location.href = `/login?blocked=true&message=${encodeURIComponent(
          errorMessage
        )}`;

        return Promise.reject(new Error("USER_BLOCKED"));
      }

      return Promise.reject(error);
    }

    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error("Forbidden access");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("Request error", error.response.status);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
