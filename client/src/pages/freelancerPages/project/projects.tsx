import { useEffect, useState } from "react";
import ProjectCard from "../../../components/project/ProjectCard";
import axiosClient from "../../../utils/axiosClient";
import { AxiosError } from "axios";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useNavigate } from "react-router-dom";
import { Plus, TrendingUp } from "lucide-react";
import FreelancerDashboardA from "../../../components/freelancer/dashboard/FreelancerDashboard";

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

export default function FreelancerDashboard() {
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
            // console.log("Viewing project for:", projectId);
            // const project = await axiosClient.get(`jobs/project-details/${projectId}`);
            // console.log(project.data.data);

            navigate(`project/project-details/${projectId}`)
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
            {/* <div className="bg-white rounded-lg border-green-100 mb-6 border border-color">
                <div className="flex">
                    <div className="p-6 flex-1">
                        <h2 className="text-xl font-medium text-gray-800">Hello, John!</h2>
                        <p className="text-gray-600 mt-2">
                            You have {allProjects.length} active projects and 34 completed projects
                        </p>
                    </div>
                    <div className="p-6 bg-color-light border-l rounded-br-lg rounded-tr-lg border-color">
                        <div className="space-y-2">
                            <p className="text-gray-700">Total Spent: $8,400</p>
                            <p className="text-gray-700">Total Pending: $8,400</p>
                            <p className="text-gray-700">Total Earnings: $16,800</p>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="bg-color-light rounded-lg border border-color p-6">
                {allProjects.length === 0 ? (
                    <div className="bg-white h-full  rounded-xl shadow-sm border border-[#2ECC71] text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects</h3>
                        <p className="text-gray-500 mb-6">Get started by find your first project</p>
                        <button
                            onClick={() => navigate("/market-place")}
                            className="inline-flex items-center px-6 py-3 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors">
                            <Plus className="w-4 h-4 mr-2" />
                            Find New Project
                        </button>
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
                                                {allProjects.length} Projects
                                            </span>
                                            <button onClick={() => navigate("/market-place")} className="inline-flex items-center px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors shadow-sm">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Find New Project
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
                    </div>
                )}
            </div>
            <FreelancerDashboardA/>
        </main>
    );
}