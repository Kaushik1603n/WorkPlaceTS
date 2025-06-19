import { useEffect, useState } from "react";
import ProjectCard from "../../../components/project/ProjectCard";
import axiosClient from "../../../utils/axiosClient";
import { AxiosError } from "axios";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useNavigate } from "react-router-dom";

interface FreelancerProject {
    _id: string;
    contractId: string;
    budget: number;
    budgetType: string;
    time: string;
    status: string;
    title: string;
    description: string;
}

function ActiveProject() {
    const [allProjects, setAllProjects] = useState<FreelancerProject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axiosClient.get("jobs/get-all-freelancer-jobs");
                setAllProjects(res.data.data);
            } catch (err) {
                const error = err as AxiosError;
                console.error("Failed to fetch projects:", error);
                setError(
                    "Failed to load projects. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleViewContract = async (projectId: string) => {
        try {
            navigate(`project-details/${projectId}`)
        } catch (err) {
            console.error("Failed to view project:", err);  
        }
    };

    if (loading) {
        return (
            <main className="flex-1 p-4 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </main>
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
            {allProjects.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No active projects found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {allProjects.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            onViewContract={handleViewContract}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ActiveProject
