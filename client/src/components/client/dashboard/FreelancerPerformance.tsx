import MetricCard from "./MetricCard"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Users, Clock,
    Star,
    AlertTriangle,
} from 'lucide-react';

function FreelancerPerformance() {
      const deliveryData = [
    { week: 'W1', onTime: 85, late: 15 },
    { week: 'W2', onTime: 92, late: 8 },
    { week: 'W3', onTime: 78, late: 22 },
    { week: 'W4', onTime: 88, late: 12 }
  ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Average Rating"
                    value="4.7/5"
                    change="+0.2 vs last month"
                    icon={Star}
                    trend="up"
                />
                <MetricCard
                    title="On-Time Delivery"
                    value="86%"
                    change="+4% vs last month"
                    icon={Clock}
                    trend="up"
                />
                <MetricCard
                    title="Dispute Rate"
                    value="2.3%"
                    change="-0.8% vs last month"
                    icon={AlertTriangle}
                    trend="up"
                />
                <MetricCard
                    title="Repeat Freelancers"
                    value="68%"
                    change="+12% vs last month"
                    icon={Users}
                    trend="up"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={deliveryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="onTime" fill="#10B981" name="On Time %" />
                            <Bar dataKey="late" fill="#EF4444" name="Late %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Freelancers</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Sarah Johnson', rating: 4.9, projects: 12, specialty: 'React Developer' },
                            { name: 'Mike Chen', rating: 4.8, projects: 8, specialty: 'UI/UX Designer' },
                            { name: 'Emma Davis', rating: 4.7, projects: 15, specialty: 'Content Writer' },
                            { name: 'Alex Rodriguez', rating: 4.8, projects: 6, specialty: 'Python Developer' }
                        ].map((freelancer, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-medium text-gray-900">{freelancer.name}</div>
                                    <div className="text-sm text-gray-600">{freelancer.specialty}</div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                        <span className="font-medium">{freelancer.rating}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">{freelancer.projects} projects</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FreelancerPerformance
