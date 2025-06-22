import React, { useState } from 'react';
import {
    Eye,
    // Send,
    CheckCircle,
    DollarSign,
    TrendingUp,
    Clock,
    Star,
    Users,
    Target,
    // Calendar,
    // Award,
    BarChart3,
    // PieChart,
    ArrowUp,
    ArrowDown,
    Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

const FreelancerDashboardA = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('monthly');
    const [activeTab, setActiveTab] = useState('overview');

    // Sample data
    const earningsData = [
        { month: 'Jan', earnings: 2400, projects: 3 },
        { month: 'Feb', earnings: 3200, projects: 4 },
        { month: 'Mar', earnings: 2800, projects: 3 },
        { month: 'Apr', earnings: 4100, projects: 5 },
        { month: 'May', earnings: 3600, projects: 4 },
        { month: 'Jun', earnings: 4800, projects: 6 }
    ];

    const skillsData = [
        { skill: 'React', demand: 85, yourRate: 92 },
        { skill: 'Node.js', demand: 78, yourRate: 88 },
        { skill: 'Python', demand: 82, yourRate: 75 },
        { skill: 'UI/UX', demand: 71, yourRate: 95 },
        { skill: 'MongoDB', demand: 65, yourRate: 80 }
    ];

    const milestoneData = [
        { name: 'Pending', value: 1200, color: '#f59e0b' },
        { name: 'Approved', value: 3400, color: '#10b981' },
        { name: 'Released', value: 2800, color: '#3b82f6' }
    ];

    const projectHistory = [
        { id: 1, name: 'E-commerce Website', client: 'TechCorp', status: 'Completed', earnings: 2500, rating: 5, date: '2024-05-15' },
        { id: 2, name: 'Mobile App UI', client: 'StartupXYZ', status: 'Active', earnings: 1800, rating: null, date: '2024-06-01' },
        { id: 3, name: 'Dashboard Design', client: 'DataCorp', status: 'Completed', earnings: 1200, rating: 4.8, date: '2024-04-20' },
        { id: 4, name: 'API Integration', client: 'TechCorp', status: 'Completed', earnings: 900, rating: 5, date: '2024-03-10' }
    ];

    const profileViews = [
        { name: 'TechCorp', views: 12, date: '2024-06-20' },
        { name: 'StartupXYZ', views: 8, date: '2024-06-19' },
        { name: 'DataCorp', views: 15, date: '2024-06-18' },
        { name: 'WebSolutions', views: 6, date: '2024-06-17' }
    ];

    const MetricCard = ({ title, value, change, icon: Icon, color = "blue" }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {change && (
                        <div className={`flex items-center mt-2 text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                            {Math.abs(change)}%
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg bg-${color}-50`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    const TabButton = ({ id, label, isActive, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Freelancer Analytics Dashboard</h1>
                    <p className="text-gray-600">Track your performance, earnings, and growth insights</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-2 mb-8 bg-white p-1 rounded-lg shadow-sm w-fit">
                    <TabButton id="overview" label="Overview" isActive={activeTab === 'overview'} onClick={setActiveTab} />
                    <TabButton id="earnings" label="Earnings" isActive={activeTab === 'earnings'} onClick={setActiveTab} />
                    <TabButton id="skills" label="Skills" isActive={activeTab === 'skills'} onClick={setActiveTab} />
                    <TabButton id="projects" label="Projects" isActive={activeTab === 'projects'} onClick={setActiveTab} />
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Performance Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard
                                title="Profile Views"
                                value="156"
                                change={12}
                                icon={Eye}
                                color="blue"
                            />
                            <MetricCard
                                title="Proposal Success Rate"
                                value="68%"
                                change={5}
                                icon={Target}
                                color="green"
                            />
                            <MetricCard
                                title="Avg. Earnings/Project"
                                value="$1,650"
                                change={-3}
                                icon={DollarSign}
                                color="purple"
                            />
                            <MetricCard
                                title="Job Completion Rate"
                                value="96%"
                                change={2}
                                icon={CheckCircle}
                                color="emerald"
                            />
                        </div>

                        {/* Recent Profile Views */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                                Recent Profile Views
                            </h3>
                            <div className="space-y-3">
                                {profileViews.map((view, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Users className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="font-medium text-gray-900">{view.name}</p>
                                                <p className="text-sm text-gray-500">{view.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Eye className="w-4 h-4 mr-1" />
                                            {view.views} views
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Proposals This Month</h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">24</p>
                                        <p className="text-sm text-gray-500">Sent</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">8</p>
                                        <p className="text-sm text-gray-500">Accepted</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Active Projects</h4>
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <p className="text-2xl font-bold text-purple-600">3</p>
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
                )}

                {activeTab === 'earnings' && (
                    <div className="space-y-8">
                        {/* Earnings Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <MetricCard
                                title="Total Earnings"
                                value="$18,400"
                                change={15}
                                icon={DollarSign}
                                color="green"
                            />
                            <MetricCard
                                title="This Month"
                                value="$4,800"
                                change={8}
                                icon={TrendingUp}
                                color="blue"
                            />
                            <MetricCard
                                title="Pending Payments"
                                value="$1,200"
                                change={null}
                                icon={Clock}
                                color="yellow"
                            />
                        </div>

                        {/* Earnings Chart */}
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
                )}

                {activeTab === 'skills' && (
                    <div className="space-y-8">
                        {/* Skills Analysis */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Skill Demand vs Your Rate</h3>
                            <div className="space-y-6">
                                {skillsData.map((skill, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-900">{skill.skill}</span>
                                            <div className="flex space-x-4 text-sm">
                                                <span className="text-blue-600">Market: {skill.demand}%</span>
                                                <span className="text-green-600">Your Rate: {skill.yourRate}%</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: `${skill.demand}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: `${skill.yourRate}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bid Competitiveness & Feedback */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bid Competitiveness</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                        <span className="text-green-800 font-medium">Highly Competitive</span>
                                        <span className="text-green-600 font-bold">65%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <span className="text-yellow-800 font-medium">Moderately Competitive</span>
                                        <span className="text-yellow-600 font-bold">25%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                        <span className="text-red-800 font-medium">Less Competitive</span>
                                        <span className="text-red-600 font-bold">10%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Feedback Trends</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Communication</span>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                            <span className="ml-2 text-sm font-medium">4.9</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Quality</span>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                            <span className="ml-2 text-sm font-medium">4.8</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Timeliness</span>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                            <span className="ml-2 text-sm font-medium">4.7</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div className="space-y-8">
                        {/* Project Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <MetricCard
                                title="Total Projects"
                                value="47"
                                change={null}
                                icon={BarChart3}
                                color="blue"
                            />
                            <MetricCard
                                title="Completed"
                                value="44"
                                change={null}
                                icon={CheckCircle}
                                color="green"
                            />
                            <MetricCard
                                title="Active"
                                value="3"
                                change={null}
                                icon={Clock}
                                color="yellow"
                            />
                            <MetricCard
                                title="Repeat Clients"
                                value="12"
                                change={null}
                                icon={Users}
                                color="purple"
                            />
                        </div>

                        {/* Project History */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Project History</h3>
                                <button className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Project</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Client</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Earnings</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectHistory.map((project) => (
                                            <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <p className="font-medium text-gray-900">{project.name}</p>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">{project.client}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'Completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-green-600">${project.earnings}</td>
                                                <td className="py-3 px-4">
                                                    {project.rating ? (
                                                        <div className="flex items-center">
                                                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                            <span className="text-sm">{project.rating}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">Pending</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-gray-500 text-sm">{project.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Timeline Visualization */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Timeline</h3>
                            <div className="space-y-4">
                                {projectHistory.slice(0, 3).map((project, index) => (
                                    <div key={project.id} className="flex items-center">
                                        <div className="flex flex-col items-center mr-4">
                                            <div className={`w-3 h-3 rounded-full ${project.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                                                }`}></div>
                                            {index < 2 && <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">{project.name}</p>
                                                    <p className="text-sm text-gray-500">{project.client} • {project.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-green-600">${project.earnings}</p>
                                                    <p className="text-sm text-gray-500">{project.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreelancerDashboardA;