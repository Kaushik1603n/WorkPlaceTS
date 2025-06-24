import { useEffect, useState } from "react";
import { JobDetailsCard } from "../../components/client/project/JobDetailsCard";
import axiosClient from "../../utils/axiosClient";
import { useParams } from "react-router-dom";
import ErrorMessage from "../../components/ui/ErrorMessage";

interface JobDetails {
    title: string;
    description: string;
    stack: string;
    time: string;
    reference: string;
    requiredFeatures: string[];
    budgetType: string;
    budget: string;
    experienceLevel: string;
    clientId: {
        fullName: string;
        email: string;
    };
}
function AdminProjectDetails() {
    const { jobId } = useParams<{ jobId: string }>();
    const [job, setJob] = useState<JobDetails | null>(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchProjectsDetails = async () => {
            try {
                setLoading(true)
                setError(null);
                const res = await axiosClient.get(`admin/project/project-details/${jobId}`);
                setJob(res.data.data);
            } catch (err) {
                setError("Failed to load project Details. Please try again later.");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjectsDetails()
    }, [jobId])

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
