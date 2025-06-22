import {
    DollarSign,
    TrendingUp,
    Clock,

} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from './MetricCard';
import { useEffect, useState } from 'react';
import axiosClient from '../../../utils/axiosClient';
import type { AxiosError } from 'axios';
import LoadingSpinner from '../../ui/LoadingSpinner';


interface WeeklyPayment {
    earnings: number,
    projects: number,
    week: string
}

interface PaymentData {
    totalPayments: number;
    pendingPayments: number;
    monthlyStats: number;
}
function FreelancerEarnings() {
    // const [selectedPeriod, setSelectedPeriod] = useState('monthly');
    const [paymentData, setPaymentData] = useState<PaymentData>({
        totalPayments: 0,
        pendingPayments: 0,
        monthlyStats: 0,
    });
    const [allPayments, setAllPayments] = useState<WeeklyPayment[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get("freelancer/totalearnings");
                setPaymentData({
                    totalPayments: res.data.result.totalPayments,
                    pendingPayments: res.data.result.pendingPayments,
                    monthlyStats: res.data.result.monthlyStats.totalMonthlyEarnings
                });

                setAllPayments(
                    res.data.result.weeklyPayments
                );

            } catch (err) {
                const error = err as AxiosError;
                console.error("Failed to fetch projects:", error);
                // setError(
                //     "Failed to load projects. Please try again later."
                // );
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Earnings"
                    value={(paymentData.totalPayments*80).toString()}
                    icon={DollarSign}
                />
                <MetricCard
                    title="This Month"
                    value={(paymentData.monthlyStats*80).toString()}
                    icon={TrendingUp}
                />
                <MetricCard
                    title="Pending Payments"
                    value={(paymentData.pendingPayments*80).toString()}
                    icon={Clock}

                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">weekly Earnings</h3>
                    {/* <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="yearly">Yearly</option>
                    </select> */}
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

            {/* Milestone Payments */}

        </div>
    )
}

export default FreelancerEarnings
