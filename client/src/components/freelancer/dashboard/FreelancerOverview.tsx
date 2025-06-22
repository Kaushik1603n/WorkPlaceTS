import {
    CheckCircle,
    DollarSign,
    Clock,
    Star,
    Target,

} from 'lucide-react';
import MetricCard from './MetricCard';
import { useEffect, useState } from 'react';
import axiosClient from '../../../utils/axiosClient';
import type { AxiosError } from 'axios';
import LoadingSpinner from '../../ui/LoadingSpinner';

function FreelancerOverview() {
    const [count, setCount] = useState({ totalJob: 0, completedJob: 0, activeJob: 0, avgEarnings: 0, totalProposal: 0 })
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get("freelancer/totalCount");
                setCount(res.data.result)
            } catch (err) {
                const error = err as AxiosError;
                console.error("Failed to fetch projects:", error);

            } finally {
                setLoading(false);

            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <main className="flex-1 p-4 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </main>
        );
    }
    return (
        <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Job"
                    value={count.totalJob.toString()}
                    icon={Target}
                />


                <MetricCard
                    title="Avg. Earnings/Project"
                    value={(count.avgEarnings * 80).toString()}
                    icon={DollarSign}
                />
                <MetricCard
                    title="Job Completed"
                    value={count.completedJob.toString()}
                    icon={CheckCircle}
                />
            </div>


            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Proposals </h4>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-blue-600">{count.totalProposal}</p>
                            <p className="text-sm text-gray-500">Sent</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{count.totalJob}</p>
                            <p className="text-sm text-gray-500">Accepted</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Active Projects</h4>
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-2xl font-bold text-purple-600">{count.activeJob}</p>
                            <p className="text-sm text-gray-500">In Progress</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Client Rating</h4>
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-2xl font-bold text-yellow-500">4.9</p>
                            <p className="text-sm text-gray-500">Average</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Star className="w-6 h-6 text-yellow-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FreelancerOverview
