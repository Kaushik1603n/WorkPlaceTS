import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import type { AxiosError } from "axios";

interface AllProjectDetails {
  _id: string;
  title: string;
  clientId: string;
  budget: number;
  status: string;
  createdAt: string;
}

interface ProjectData {
  totalProject: number;
  completedProject: number;
  activeProject: number;
}

interface FetchProjectsResult {
  projectData: ProjectData;
  allProject: AllProjectDetails[];
  loading: boolean;
  error: string | null;
}

export function useFetchFreelancerProjects(): FetchProjectsResult {
  const [projectData, setProjectData] = useState<ProjectData>({
    totalProject: 0,
    completedProject: 0,
    activeProject: 0,
  });
  const [allProject, setAllProject] = useState<AllProjectDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.get("freelancer/dashboardproject");

        if (res.data && res.data.result) {
          setProjectData({
            totalProject: res.data.result.totalProject || 0,
            completedProject: res.data.result.completedProject || 0,
            activeProject: res.data.result.activeProject || 0,
          });
          setAllProject(res.data.result.allProject || []);
        }
      } catch (err) {
        const error = err as AxiosError;
        setError(error.message || "Failed to fetch projects");
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projectData, allProject, loading, error };
}
