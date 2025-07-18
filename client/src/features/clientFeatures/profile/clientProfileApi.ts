import axiosClient from "../../../utils/axiosClient";

interface ClientProfile {
  fullName?: string;
  email?: string;
  coverPic?:string |null;
  profilePic?:string| null;
  companyName?:string;
  location?:string;
}

interface ApiResponse {
  client: ClientProfile;
}

export const clientProgileApi = {
  updateProfile: (clientData: ClientProfile) => 
    axiosClient.put<ApiResponse>('/client/profile', clientData),
  getProfile: () => 
    axiosClient.get<ApiResponse>('/client/profile'),
};