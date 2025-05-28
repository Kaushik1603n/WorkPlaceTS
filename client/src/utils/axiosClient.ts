import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestHeaders,
} from "axios";

// Define your API response type
type ApiResponse<T = unknown> = {
  data: T;
  message?: string;
  status?: number;
};

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  } as AxiosRequestHeaders,
  withCredentials: true,
});

// Request interceptor
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
    // Return the full AxiosResponse object
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
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
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
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
