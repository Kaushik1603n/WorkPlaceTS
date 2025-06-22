import {
    DollarSign,
    TrendingUp,
    Clock,
   
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  PieChart as RechartsPieChart, Cell } from 'recharts';
import MetricCard from './MetricCard';
import { useState } from 'react';

function FreelancerEarnings() {
        const [selectedPeriod, setSelectedPeriod] = useState('monthly');
    
        const earningsData = [
        { month: 'Jan', earnings: 2400, projects: 3 },
        { month: 'Feb', earnings: 3200, projects: 4 },
        { month: 'Mar', earnings: 2800, projects: 3 },
        { month: 'Apr', earnings: 4100, projects: 5 },
        { month: 'May', earnings: 3600, projects: 4 },
        { month: 'Jun', earnings: 4800, projects: 6 }
    ];
    
    const milestoneData = [
        { name: 'Pending', value: 1200, color: '#f59e0b' },
        { name: 'Approved', value: 3400, color: '#10b981' },
        { name: 'Released', value: 2800, color: '#3b82f6' }
    ];
  return (
            <div className="space-y-8">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <MetricCard
                                title="Total Earnings"
                                value="$18,400"
                                change={"15"}
                                icon={DollarSign}
                            />
                            <MetricCard
                                title="This Month"
                                value="$4,800"
                                change={"8"}
                                icon={TrendingUp}
                            />
                            <MetricCard
                                title="Pending Payments"
                                value="$1,200"
                                change={""}
                                icon={Clock}

                            />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Monthly Earnings</h3>
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={earningsData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="earnings"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Milestone Payments */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestone Payments</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Tooltip />
                                            <RechartsPieChart data={milestoneData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                                                {milestoneData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </RechartsPieChart>
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-2 mt-4">
                                    {milestoneData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                                                <span className="text-sm text-gray-600">{item.name}</span>
                                            </div>
                                            <span className="font-medium">${item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top-Paying Clients</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'TechCorp', amount: 5400, projects: 3 },
                                        { name: 'StartupXYZ', amount: 3200, projects: 2 },
                                        { name: 'DataCorp', amount: 2800, projects: 2 },
                                        { name: 'WebSolutions', amount: 1900, projects: 1 }
                                    ].map((client, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{client.name}</p>
                                                <p className="text-sm text-gray-500">{client.projects} projects</p>
                                            </div>
                                            <p className="font-bold text-green-600">${client.amount}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
  )
}

export default FreelancerEarnings
