import axiosClient from "../../../utils/axiosClient";

interface userData {
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
 
  getFreelancerProfile: () => 
    axiosClient.get<ApiResponse>('/admin/get-freelancer-profile'),
  getClientProfile: () => 
    axiosClient.get<ApiResponse>('/admin/get-client-profile'),
  getUserProfile: () => 
    axiosClient.get<ApiResponse>('/admin/get-user-profile'),
};