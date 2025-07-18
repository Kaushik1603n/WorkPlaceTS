import { useEffect, useState } from "react";
import MetricCard from "./MetricCard"
import {
    CheckCircle,
    Clock,
    // Star,
    Users,
    BarChart3,
    Calendar,
} from 'lucide-react';
import axiosClient from "../../../utils/axiosClient";
import type { AxiosError } from "axios";
import LoadingSpinner from "../../ui/LoadingSpinner";

interface AllProjectDetails {
    _id: string,
    title: string,
    clientId: string,
    budget: number
    status: string
    createdAt: string
}

interface ProjectData {
    totalProject: number;
    completedProject: number;
    activeProject: number;
}

function FreelancerProjects() {
    const [projectData, setProjectData] = useState<ProjectData>({
        totalProject: 0,
        completedProject: 0,
        activeProject: 0,
    });
    const [allProject, setAllProject] = useState<AllProjectDetails[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
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
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <main className="flex-1 p-4 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </main>
        );
    }

    return (
        <div className="space-y-8 p-6 bg-gray-50 min-h-screen">


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Projects"
                    value={projectData.totalProject.toString()}
                    icon={BarChart3}
                />
                <MetricCard
                    title="Completed Projects"
                    value={projectData.completedProject.toString()}
                    icon={CheckCircle}
                />
                <MetricCard
                    title="Active Projects"
                    value={projectData.activeProject.toString()}
                    icon={Clock}
                />

            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Project History</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                Showing {allProject.length} projects
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {allProject.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <BarChart3 className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                            <p className="text-gray-500">
                                You haven't started any projects yet
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">ProjectId</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Title</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Client</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Budget</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allProject.map((project, index) => (
                                    <tr key={project._id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="py-4 px-6">
                                            <div>

                                                <p className="text-sm text-gray-500">ID: {project._id.slice(-8)}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="max-w-[200px]">
                                                <p className="font-semibold text-gray-900 line-clamp-2">
                                                    {project.title || `Project #${index + 1}`}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <Users className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="text-gray-900">
                                                    {project.clientId.slice(-8)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize min-w-[80px] justify-center ${project.status === 'completed'
                                                ? 'bg-green-100 text-green-800 border border-green-200'
                                                : project.status === 'active' || project.status === 'in-progress'
                                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                }`}>
                                                {project.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {(project.status === 'active' || project.status === 'in-progress') && <Clock className="w-3 h-3 mr-1" />}
                                                {project.status.replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-semibold text-green-600 text-lg">
                                                {formatCurrency(project.budget)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center text-gray-500">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span className="text-sm">{formatDate(project.createdAt)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FreelancerProjects