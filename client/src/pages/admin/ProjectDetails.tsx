import { JobDetailsCard } from "../../components/client/project/JobDetailsCard";
import { useParams } from "react-router-dom";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useAdminProjectDetails } from "../../features/apis/admin/useAdminProjectDetails";

function AdminProjectDetails() {
    const { jobId } = useParams<{ jobId: string }>();
    const { job, loading, error } = useAdminProjectDetails(jobId);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading job details...</p>
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
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-8" >
            <div className="xl:col-span-1">
                {job && <JobDetailsCard job={job} />}
            </div>
        </div >
    )
}

export default AdminProjectDetails
