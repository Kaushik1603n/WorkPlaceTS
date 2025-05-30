import axiosClient from "../../../utils/axiosClient";

interface ClientProfile {
  fullName?: string;
  email?: string;
  CoverPic?:string |null;
  profilePic?:string| null;
  companyName?:string;
  location?:string;
}

interface ApiResponse {
  client: ClientProfile;
}

export const clientProgileApi = {
  updateProfile: (clientData: ClientProfile) => 
    axiosClient.post<ApiResponse>('/client/edit-profile', clientData),
  getProfile: () => 
    axiosClient.get<ApiResponse>('/client/get-profile'),
};