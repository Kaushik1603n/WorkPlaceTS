import axiosClient from "../../../utils/axiosClient";

interface FreelancerProfile {
  coverPic?: string | null;
  profilePic?: string | null;
  fullName?: string;
  email?: string;
  address?: string;
  availability?: string;
  experienceLevel?: string;
  education?: string;
  hourlyRate?: string;
  skills?: string[];
  location?: string;
  reference?: string;
  bio?: string;
}

interface ApiResponse {
  freelancer: FreelancerProfile;
}

export const freelancerProgileApi = {
  updateProfile: (clientData: FreelancerProfile) =>
    axiosClient.put<ApiResponse>("/freelancer/profile", clientData),
  getProfile: () => axiosClient.get<ApiResponse>("/freelancer/profile"),
};
