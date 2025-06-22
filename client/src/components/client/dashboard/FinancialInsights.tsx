import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Line, LineChart } from 'recharts';
import {
    TrendingUp, Target, DollarSign,
} from 'lucide-react';
import MetricCard from './MetricCard';
import { useEffect, useState } from 'react';
import axiosClient from '../../../utils/axiosClient';
import type { AxiosError } from 'axios';

interface WeeklyFinancialData {
    week: string;
    spent: number;
    avgCost: number;
}

function FinancialInsights() {
    const [financialData, setFinancialData] = useState<WeeklyFinancialData[]>([])
    const [totalSpent, setTotalSpend] = useState(0)
    const [CostPerProject, setCostPerProject] = useState({
        avgCostPerProject: 0, totalProjects: 0
    })

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // setLoading(true);
                // setError(null);
                const res = await axiosClient.get("client/financialdata");
                setFinancialData(res.data.weeklySpending);
                setTotalSpend(res.data.totalSpent)
                setCostPerProject(res.data.avgCostPerProject)
                console.log(res.data.weeklySpending)
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



    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Spent"
                    value={(totalSpent * 80).toString()}
                    icon={DollarSign}
                    trend="up"
                />
                <MetricCard
                    title="Avg Cost per Project"
                    value={(CostPerProject.avgCostPerProject * 80).toFixed(2).toString()}
                    icon={TrendingUp}
                    trend="down"
                />
                <MetricCard
                    title="Completed Projects"
                    value={(CostPerProject.totalProjects).toString()}
                    icon={Target}
                    trend="up"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Spending Trend</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={financialData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis
                                dataKey="week"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => value.split(',')[1]} // Shows just "Week 24"
                            />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [`$${value}`, value === 'spent' ? 'Total Spent' : 'Avg Cost']}
                                labelFormatter={(value) => value}
                            />
                            <Area
                                type="monotone"
                                dataKey="spent"
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.1}
                                name="Total Spent"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Project Cost</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={financialData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis
                                dataKey="week"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => value.split(',')[1]}
                            />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [`$${value}`, 'Average Cost']}
                                labelFormatter={(value) => value}
                            />
                            <Line
                                type="monotone"
                                dataKey="avgCost"
                                stroke="#10B981"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Average Cost"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default FinancialInsights
