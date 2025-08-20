import {
    DollarSign,
    TrendingUp,
    Clock,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from './MetricCard';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { useFreelancerEarnings } from '../../../features/apis/freelancer/useFreelancerEarnings';
import ErrorMessage from '../../ui/ErrorMessage';

function FreelancerEarnings() {
    const { paymentData, allPayments, loading, error } = useFreelancerEarnings();
    if (error) {
        return (
            <main className="flex-1 p-4">
                <ErrorMessage message={error} onRetry={() => window.location.reload()} />
            </main>
        );
    }

    if (loading) {
        return (
            <main className="flex-1 p-4 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </main>
        );
    }

    return (
        <div className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Earnings"
                    value={(paymentData.totalPayments * 80).toString()}
                    icon={DollarSign}
                />
                <MetricCard
                    title="This Month"
                    value={(paymentData.monthlyStats * 80).toString()}
                    icon={TrendingUp}
                />
                <MetricCard
                    title="Pending Payments"
                    value={(paymentData.pendingPayments * 80).toString()}
                    icon={Clock}

                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">weekly Earnings</h3>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={allPayments}
                            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="week"
                                stroke="#666"
                                tickFormatter={(week) => `Week ${week}`}
                            />
                            <YAxis
                                stroke="#666"
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                                labelFormatter={(week) => `Week ${week}`}
                            />
                            {/* <Legend /> */}
                            <Line
                                type="monotone"
                                dataKey="earnings"
                                name="Earnings"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    )
}

export default FreelancerEarnings
