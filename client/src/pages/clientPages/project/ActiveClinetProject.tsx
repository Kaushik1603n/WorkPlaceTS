import ProjectCard from "../../../components/project/ProjectCard";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useNavigate } from "react-router-dom";
import { TrendingUp, CheckCircle, Clock } from "lucide-react";
import { useActiveClinetProject } from "../../../features/apis/client/useActiveClinetProject";

function ActiveClinetProject() {
   const {
    allActiveProject,
    allPendingProject,
    allCompletedProject,
    loading,
    error,
  } = useActiveClinetProject();
    const navigate = useNavigate();


    const handleViewContract = async (projectId: string) => {
        try {
            navigate(`${projectId}`);
        } catch (err) {
            console.error("Failed to view project:", err);
        }
    };

    if (loading) {
        return (
            <main className="flex-1 p-4 flex items-center justify-center min-h-[300px]">
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
        <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto space-y-12">
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Active Projects</h2>
                            <p className="text-gray-500">Manage and track your ongoing projects</p>
                        </div>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {allActiveProject.length} {allActiveProject.length === 1 ? "Project" : "Projects"}
                    </span>
                </div>

                {allActiveProject.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p className="text-gray-500">No active projects found</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {allActiveProject.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                onViewContract={handleViewContract}
                            />
                        ))}
                    </div>
                )}
            </section>
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Pending Projects</h2>
                            <p className="text-gray-500">Projects awaiting your approval</p>
                        </div>
                    </div>
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        {allPendingProject.length} {allPendingProject.length === 1 ? "Project" : "Projects"}
                    </span>
                </div>

                {allPendingProject.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p className="text-gray-500">No pending projects found</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {allPendingProject.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                onViewContract={handleViewContract}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Completed Projects</h2>
                            <p className="text-gray-500">Review your successfully delivered projects</p>
                        </div>
                    </div>
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {allCompletedProject.length} {allCompletedProject.length === 1 ? "Project" : "Projects"}
                    </span>
                </div>

                {allCompletedProject.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p className="text-gray-500">No completed projects found</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {allCompletedProject.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                onViewContract={handleViewContract}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ActiveClinetProject;