import axiosClient from "../../../utils/axiosClient";

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
}
interface userData {
    _id?:string;
  fullName?: string;
  email?: string;
  createdAt?:string;
  status?:string,
}

interface ApiResponse {
  freelancer: userData;
  client: userData;
  users: userData;
}

export const userProfileApi = {
  getFreelancerProfile: (params?: PaginationParams) => 
    axiosClient.get<PaginatedResponse<ApiResponse>>('/admin/get-freelancer-profile', { params }),
  
  getClientProfile: (params?: PaginationParams) => 
    axiosClient.get<PaginatedResponse<ApiResponse>>('/admin/get-client-profile', { params }),
  
  getUserProfile: (params?: PaginationParams) => 
    axiosClient.get<PaginatedResponse<ApiResponse>>('/admin/get-user-profile', { params }),
};