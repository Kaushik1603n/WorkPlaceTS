import { useEffect, useState } from 'react';
import axiosClient from '../../../utils/axiosClient';
import { toast } from 'react-toastify';
import RatingFeedbackModal from './RatingFeedbackPage';

interface Deliverable {
    links: string[];
    comments: string;
    submittedAt?: string | Date;
}

interface Milestone {
    _id: string;
    title: string;
    description: string;
    amount: number;
    dueDate?: string | Date;
    status: string;
    deliverables?: Deliverable;
}

interface FeedbackFormData {
    ratings: {
        quality: number;
        deadlines: number;
        professionalism: number;
    };
    feedback: string;
    overallRating: number;
}

const MilestoneSubmissions = ({ jobId }: { jobId: string }) => {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [jobStatus, setJobStatus] = useState<string>("");
    const [freelancerId, setFreelancerId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmitFeedback = async (data: FeedbackFormData) => {
        try {
            const res = await axiosClient.post("/jobs/feedback", { ...data, jobId, receverId: freelancerId, user: "client" })
            return {
                success: "Feedback submitted successfully",
                error: "",
                data: res.data
            }
        } catch (error) {
            console.log(error);
            return {
                success: "",
                error: "Failed to submit feedback",
                data: {}
            };

        }
    };
    useEffect(() => {
        const fetchSubmittedMilestones = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get(`/proposal/${jobId}/milestones`);

                setMilestones(response.data.data.milestones)
                setJobStatus(response.data.data.jobStatus)
                setFreelancerId(response.data.data.freelancerId)
            } catch (err) {
                setError('Failed to load milestones');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmittedMilestones();
    }, [jobId]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'submitted':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'interviewing':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'approved':
            case 'accepted':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'active':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'paid':
                return 'bg-emerald-600 text-white border-emerald-600'; // Darker for better contrast
            case 'pending':
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }

    };

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return 'Not specified';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (date: string | Date | undefined) => {
        if (!date) return 'Not specified';
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleApprove = async (milestoneId: string) => {
        try {
            await axiosClient.patch(`/proposal/milestones/${milestoneId}/approve`);
            setMilestones(milestones.map(m =>
                m._id === milestoneId ? { ...m, status: 'approved' } : m
            ));
            toast.success("milestone approved")
        } catch (error) {
            console.error('Approval failed:', error);
        }
    };

    const handleRequestRevision = async (milestoneId: string) => {
        try {
            await axiosClient.patch(`/proposal/milestones/${milestoneId}/rejected`);
            toast.success("milestone rejected")
            setMilestones(milestones.map(m =>
                m._id === milestoneId ? { ...m, status: 'rejected' } : m
            ));
        } catch (error) {
            console.error('Revision request failed:', error);
        }
    };

    const formatLink = (url: string) => {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            return `https://${url}`;
        }
        return url;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading milestones...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center ">
                    <div className="text-red-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="ml-3 text-red-800">{error}</p>
                </div>
            </div>
        );
    }

    if (milestones.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submitted milestones yet</h3>
                <p className="text-gray-500">Milestones will appear here once they are submitted for review.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Milestone Submissions</h2>
                <p className="text-gray-600">Review and approve submitted project milestones</p>
            </div>

            <div className="space-y-6">
                {milestones.map((milestone) => (
                    <div key={milestone._id} className="bg-white border border-[#27AE60] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone.status)}`}>
                                            {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-3">{milestone.description}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Due: {formatDate(milestone.dueDate)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900">${milestone.amount.toLocaleString()}</div>
                                        <div className="text-sm text-gray-500">Milestone value</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Deliverables */}
                        {milestone.deliverables && (
                            <div className="p-6 bg-gray-50">
                                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Deliverables
                                </h4>

                                {/* Submission Info */}
                                <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-900">
                                            Submitted on {formatDateTime(milestone.deliverables.submittedAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Comments */}
                                <div className="mb-4">
                                    <h5 className="text-sm font-medium text-gray-900 mb-2">Comments:</h5>
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <p className="text-gray-700 leading-relaxed">{milestone.deliverables.comments}</p>
                                    </div>
                                </div>

                                {/* Links */}
                                {milestone.deliverables.links.length > 0 && (
                                    <div>
                                        <h5 className="text-sm font-medium  text-gray-900 mb-3">Submission Links:</h5>
                                        <div className="grid gap-2">
                                            {milestone.deliverables.links.map((link, index) => (
                                                <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                                    <a
                                                        href={formatLink(link)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                        <span className="truncate">{link}</span>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        {milestone.status === 'submitted' && (
                            <div className="p-6 bg-white border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => handleApprove(milestone._id)}
                                        className="flex-1 sm:flex-none px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Approve Milestone
                                    </button>
                                    <button
                                        onClick={() => handleRequestRevision(milestone._id)}
                                        className="flex-1 sm:flex-none px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Request Revision
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div>
                    {jobStatus === "completed" && (
                        <div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                Add Rating and Feedback
                            </button>
                            <RatingFeedbackModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onSubmit={handleSubmitFeedback}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MilestoneSubmissions;