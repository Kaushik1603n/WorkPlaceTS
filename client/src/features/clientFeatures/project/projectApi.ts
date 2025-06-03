import axiosClient from "../../../utils/axiosClient";
import type { ProjectDataI } from "./projectSlice";

export const createProjectApi = {
  createJob: (clientData: ProjectDataI) =>
    axiosClient.post<{
      success: boolean;
      message: string;
    }>("/client/project/new-project", clientData),

  getProject: () =>
    axiosClient.get<{
      projects: ProjectDataI[];
    }>("/client/project/get-project"),
};
