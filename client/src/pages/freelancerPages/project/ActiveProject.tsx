import { useEffect, useState } from "react";
import ProjectCard from "../../../components/project/ProjectCard";
import axiosClient from "../../../utils/axiosClient";
import { AxiosError } from "axios";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useNavigate } from "react-router-dom";
import { Plus, TrendingUp, CheckCircle, Clock } from "lucide-react";

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

    const navigate = useNavigate();

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
                setError("Failed to load projects. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleViewContract = async (projectId: string) => {
        try {
            navigate(`project-details/${projectId}`);
        } catch (err) {
            console.error("Failed to view project:", err);
        }
    };

    const inProgressProjects = allProjects.filter(project => project.status === "in-progress");
    const completedProjects = allProjects.filter(project => project.status === "completed");

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
                <div className="bg-white h-full rounded-xl shadow-sm border border-[#2ECC71] text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Projects</h3>
                    <p className="text-gray-500 mb-6">Get started by creating your first project</p>
                    <button 
                        onClick={() => navigate("/market-place")}
                        className="inline-flex items-center px-6 py-3 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Find New Project
                    </button>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* In Progress Projects Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">In Progress</h2>
                                    <p className="text-gray-500">Projects you're currently working on</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                {inProgressProjects.length} Active
                            </span>
                        </div>

                        {inProgressProjects.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {inProgressProjects.map((project) => (
                                    <ProjectCard
                                        key={project._id}
                                        project={project}
                                        onViewContract={handleViewContract}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Projects</h3>
                                <p className="text-gray-500 mb-6">You don't have any projects in progress</p>
                                <button 
                                    onClick={() => navigate("/market-place")}
                                    className="inline-flex items-center px-6 py-3 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Find New Project
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Completed Projects Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Completed</h2>
                                    <p className="text-gray-500">Projects you've successfully delivered</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                                {completedProjects.length} Done
                            </span>
                        </div>

                        {completedProjects.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {completedProjects.map((project) => (
                                    <ProjectCard
                                        key={project._id}
                                        project={project}
                                        onViewContract={handleViewContract}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Projects</h3>
                                <p className="text-gray-500">Your completed projects will appear here</p>
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}

export default ActiveProject;