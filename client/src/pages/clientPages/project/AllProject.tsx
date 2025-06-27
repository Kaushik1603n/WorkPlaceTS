import { useEffect, useState } from "react";
import ProjectCard from "../../../components/project/ProjectCard";
import axiosClient from "../../../utils/axiosClient";
import { AxiosError } from "axios";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useNavigate } from "react-router-dom";
import { Plus, TrendingUp } from "lucide-react";
import Pagination from "../../../components/Pagination";

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
function AllClientProject() {
    const [allProjects, setAllProjects] = useState<FreelancerProject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);



    const navigate = useNavigate()

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axiosClient.get("client/project/get-project", {
                    params: { page: currentPage, limit: 6 }
                });
                setAllProjects(res.data.data);
                setTotalPage(res.data.totalPage);
                setTotalCount(res.data.totalCount);
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
    }, [currentPage]);

    const handleViewContract = async (projectId: string) => {
        try {


            navigate(`${projectId}`)
        } catch (err) {
            const error = err as AxiosError;
            console.error("Failed to view project:", error);
            alert(
                error.response?.data ||
                error.message ||
                "Failed to view project. Please try again."
            );
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
        <main className="flex-1 p-4">


            <div className="rounded-lg p-6">

                {allProjects.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No active projects found</p>
                    </div>
                ) : (
                    <div>
                        <div className="bg-white shadow-sm border-b border-gray-200 mb-5">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="py-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                                            <div className="w-10 h-10 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-xl flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
                                                <p className="text-gray-600 mt-1">Manage and track your projects</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="px-3 py-2 bg-[#e3ffef] text-[#2ECC71] rounded-lg text-sm font-medium">
                                                {totalCount} Projects
                                            </span>
                                            <button onClick={() => navigate("posting")} className="inline-flex items-center px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors shadow-sm">
                                                <Plus className="w-4 h-4 mr-2" />
                                                New Project
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {allProjects.map((project) => (
                                <ProjectCard
                                    key={project._id}
                                    project={project}
                                    onViewContract={handleViewContract}
                                />
                            ))}


                        </div>
                        <div className="flex justify-center mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPage}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default AllClientProject
