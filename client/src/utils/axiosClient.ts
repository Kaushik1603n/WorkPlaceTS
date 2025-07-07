import axios, { isAxiosError } from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestHeaders,
} from "axios";
import { toast } from "react-toastify";

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
        localStorage.removeItem("accessToken");
        window.dispatchEvent(new CustomEvent("logout"));
        // toast.error("Your session has expired");
        // window.location.href = `/login`;

        // window.location.href = `/login?unauth=true&message=${encodeURIComponent(
        //   "Your session has expired."
        // )}`;
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        console.log("Attempting token refresh...");

        const refreshResponse = await axiosClient.post<{ accessToken: string }>(
          "/auth/refresh"
        );

        if (refreshResponse.data.accessToken) {
          localStorage.setItem("accessToken", refreshResponse.data.accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          }

          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        if (
          isAxiosError(refreshError) &&
          refreshError.response?.data?.shouldLogout
        ) {
          window.dispatchEvent(new CustomEvent("logout"));
          // toast.error(
          //   refreshError.response?.data?.message || "Your session has expired"
          // );
          // window.location.href = `/login`;

          // window.location.href = `/login?unauth=true&message=${encodeURIComponent(
          //   "Your session has expired."
          // )}`;
        }
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      const errorMessage = "Your account has been blocked.";

      if (errorMessage.includes("blocked")) {
        localStorage.removeItem("accessToken");

        window.dispatchEvent(new CustomEvent("logout"));
        toast.error("Your account has been blocked.");

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
