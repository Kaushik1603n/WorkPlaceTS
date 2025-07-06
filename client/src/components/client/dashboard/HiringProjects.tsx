import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from './MetricCard';
import {
    Users, Target, 
    // Award, Clock,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosClient from '../../../utils/axiosClient';
import type { AxiosError } from 'axios';

function HiringProjects() {
    const [hiringData,setHiringData]=useState([])
    const [jobCount,setJobCount]=useState({
        posted: "0", hired: "0"
    })

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // setLoading(true);
                // setError(null);
                const res = await axiosClient.get("client/hiringprojects");
                setHiringData(res.data.result);
                setJobCount(res.data.jobCount)
            } catch (err) {
                const error = err as AxiosError;
                console.error("Failed to fetch projects:", error);
                // setError(
                //     "Failed to load projects. Please try again later."
                // );
            } finally {
                // setLoading(false);
            }
        };

        fetchProjects();
    }, []);
    // const hiringData = [
    //     { month: 'Jan', jobsPosted: 15, hiresMade: 12 },
    //     { month: 'Feb', jobsPosted: 22, hiresMade: 18 },
    //     { month: 'Mar', jobsPosted: 28, hiresMade: 24 },
    //     { month: 'Apr', jobsPosted: 19, hiresMade: 16 },
    //     { month: 'May', jobsPosted: 31, hiresMade: 28 },
    //     { month: 'Jun', jobsPosted: 25, hiresMade: 22 }
    // ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <MetricCard
                    title="Jobs Posted"
                    value={jobCount?.posted}
                    icon={Target}
                    trend="up"
                />
                <MetricCard
                    title="Successful Hires"
                    value={jobCount?.hired}
                    icon={Users}
                    trend="up"
                />
                {/* <MetricCard
                    title="Freelancer Retention"
                    value="68%"
                    change="+5%"
                    icon={Award}
                    trend="up"
                />
                <MetricCard
                    title="Avg Completion Time"
                    value="7.2 days"
                    change="-1.3 days"
                    icon={Clock}
                    trend="up"
                /> */}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Jobs Posted vs Hires Made</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={hiringData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="jobsPosted" fill="#3B82F6" name="Jobs Posted" />
                        <Bar dataKey="hiresMade" fill="#10B981" name="Hires Made" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default HiringProjects
