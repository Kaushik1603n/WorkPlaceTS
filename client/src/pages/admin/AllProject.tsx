import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Clock, CheckCircle } from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import { AxiosError } from "axios";
import ProjectCard from "../../components/project/ProjectCard";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Pagination from "../../components/Pagination";
import { ProjectCardSkeletonRow } from "../../components/admin/ProjectCardSkeleton";

interface ClientProject {
  _id: string;
  contractId: string;
  budget: number;
  budgetType: string;
  time: string;
  status: string;
  title: string;
  description: string;
}

interface ProjectResponse {
  data: ClientProject[];
  totalPage: number;
}

interface LoadingState {
  active: boolean;
  posted: boolean;
  completed: boolean;
}

interface ProjectSectionProps {
  title: string;
  description: string;
  projects: ClientProject[];
  isLoading: boolean;
  icon: React.ComponentType<{ className?: string }>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  emptyMessage: string;
}

function AllProjectListing() {
  const [allActiveProject, setAllActiveProject] = useState<ClientProject[]>([]);
  const [allPostedProject, setAllPostedProject] = useState<ClientProject[]>([]);
  const [allCompletedProject, setAllCompletedProject] = useState<ClientProject[]>([]);
  
  const [loading, setLoading] = useState<LoadingState>({
    active: true,
    posted: true,
    completed: true
  });
  
  const [error, setError] = useState<string | null>(null);
  const [activeCurrentPage, setActiveCurrentPage] = useState(1);
  const [activeTotalPage, setActiveTotalPage] = useState(1);
  const [postedCurrentPage, setPostedCurrentPage] = useState(1);
  const [postedTotalPage, setPostedTotalPage] = useState(1);
  const [completedCurrentPage, setCompletedCurrentPage] = useState(1);
  const [completedTotalPage, setCompletedTotalPage] = useState(1);

  const navigate = useNavigate();

  // Fetch Active Projects
  useEffect(() => {
    const fetchActiveProjects = async () => {
      try {
        setLoading(prev => ({ ...prev, active: true }));
        setError(null);
        const res = await axiosClient.get<ProjectResponse>("admin/project/active-projects", {
          params: { page: activeCurrentPage, limit: 3 },
        });
        setAllActiveProject(res.data.data);
        setActiveTotalPage(res.data.totalPage);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Failed to fetch active projects:", error);
        setError("Failed to load active projects. Please try again later.");
      } finally {
        setLoading(prev => ({ ...prev, active: false }));
      }
    };

    fetchActiveProjects();
  }, [activeCurrentPage]);

  // Fetch Posted Projects
  useEffect(() => {
    const fetchPostedProjects = async () => {
      try {
        setLoading(prev => ({ ...prev, posted: true }));
        setError(null);
        const res = await axiosClient.get<ProjectResponse>("admin/project/posted-projects", {
          params: { page: postedCurrentPage, limit: 3 },
        });
        setAllPostedProject(res.data.data);
        setPostedTotalPage(res.data.totalPage);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Failed to fetch posted projects:", error);
        setError("Failed to load posted projects. Please try again later.");
      } finally {
        setLoading(prev => ({ ...prev, posted: false }));
      }
    };

    fetchPostedProjects();
  }, [postedCurrentPage]);

  // Fetch Completed Projects
  useEffect(() => {
    const fetchCompletedProjects = async () => {
      try {
        setLoading(prev => ({ ...prev, completed: true }));
        setError(null);
        const res = await axiosClient.get<ProjectResponse>("admin/project/completed-projects", {
          params: { page: completedCurrentPage, limit: 3 },
        });
        setAllCompletedProject(res.data.data);
        setCompletedTotalPage(res.data.totalPage);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Failed to fetch completed projects:", error);
        setError("Failed to load completed projects. Please try again later.");
      } finally {
        setLoading(prev => ({ ...prev, completed: false }));
      }
    };

    fetchCompletedProjects();
  }, [completedCurrentPage]);

  const handleViewContract = (projectId: string) => {
    navigate(projectId);
  };

  const ProjectSection = ({
    title, 
    description, 
    projects, 
    isLoading, 
    icon: Icon,
    currentPage, 
    totalPages, 
    onPageChange,
    emptyMessage 
  }: ProjectSectionProps) => (
    <div className="mb-12">
      <div className="bg-[#EFFFF6] shadow-sm border-b border-[#27AE60] mb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <div className="w-10 h-10 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                  <p className="text-gray-600 mt-1">{description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-2 bg-[#e3ffef] text-[#2ECC71] rounded-lg text-sm font-medium">
                  {projects.length} Projects
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <ProjectCardSkeletonRow/>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onViewContract={handleViewContract}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );

  const isInitialLoading = loading.active && loading.posted && loading.completed;

  if (isInitialLoading) {
    return (
       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-4">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </main>
    );
  }

  return (
    <div className="flex-1 p-4">
      <ProjectSection
        title="Active Projects"
        description="Manage and track your ongoing projects"
        projects={allActiveProject}
        isLoading={loading.active}
        icon={TrendingUp}
        currentPage={activeCurrentPage}
        totalPages={activeTotalPage}
        onPageChange={setActiveCurrentPage}
        emptyMessage="No active projects found"
      />

      <ProjectSection
        title="Posted Projects"
        description="Projects that are posted and awaiting assignment"
        projects={allPostedProject}
        isLoading={loading.posted}
        icon={Clock}
        currentPage={postedCurrentPage}
        totalPages={postedTotalPage}
        onPageChange={setPostedCurrentPage}
        emptyMessage="No posted projects found"
      />

      <ProjectSection
        title="Completed Projects"
        description="Successfully finished projects"
        projects={allCompletedProject}
        isLoading={loading.completed}
        icon={CheckCircle}
        currentPage={completedCurrentPage}
        totalPages={completedTotalPage}
        onPageChange={setCompletedCurrentPage}
        emptyMessage="No completed projects found"
      />
    </div>
  );
}

export default AllProjectListing;