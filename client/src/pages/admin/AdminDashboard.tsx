import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Users, Briefcase, DollarSign, AlertTriangle, TrendingUp, TrendingDown, Clock, Star, CreditCard, Globe } from 'lucide-react';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const overviewMetrics = {
    totalUsers: 15847,
    totalProjects: 3421,
    totalRevenue: 284750,
    disputeRate: 2.3,
    activeProjects: 458,
    completedProjects: 2963
  };

  const userGrowthData = [
    { month: 'Jan', freelancers: 1200, clients: 800, activeFreelancers: 950, repeatClients: 320 },
    { month: 'Feb', freelancers: 1450, clients: 920, activeFreelancers: 1150, repeatClients: 380 },
    { month: 'Mar', freelancers: 1680, clients: 1100, activeFreelancers: 1320, repeatClients: 450 },
    { month: 'Apr', freelancers: 1920, clients: 1280, activeFreelancers: 1520, repeatClients: 520 },
    { month: 'May', freelancers: 2150, clients: 1450, activeFreelancers: 1720, repeatClients: 590 },
    { month: 'Jun', freelancers: 2400, clients: 1620, activeFreelancers: 1950, repeatClients: 650 }
  ];

  const jobCategoryData = [
    { name: 'Web Development', value: 1250, color: '#8884d8' },
    { name: 'Graphic Design', value: 890, color: '#82ca9d' },
    { name: 'Content Writing', value: 620, color: '#ffc658' },
    { name: 'Digital Marketing', value: 480, color: '#ff7300' },
    { name: 'Mobile Apps', value: 350, color: '#00ff88' },
    { name: 'Data Entry', value: 280, color: '#ff8042' }
  ];

  const revenueData = [
    { month: 'Jan', commission: 18500, subscription: 4200, disputes: -800 },
    { month: 'Feb', commission: 22300, subscription: 4800, disputes: -650 },
    { month: 'Mar', commission: 25800, subscription: 5200, disputes: -920 },
    { month: 'Apr', commission: 28900, subscription: 5600, disputes: -750 },
    { month: 'May', commission: 31200, subscription: 6100, disputes: -680 },
    { month: 'Jun', commission: 34500, subscription: 6400, disputes: -590 }
  ];

  const trafficData = [
    { source: 'Direct', visitors: 12450, conversions: 890 },
    { source: 'SEO', visitors: 8930, conversions: 1250 },
    { source: 'Paid Ads', visitors: 6780, conversions: 780 },
    { source: 'Social Media', visitors: 4520, conversions: 320 },
    { source: 'Referrals', visitors: 3210, conversions: 280 }
  ];

  const topFreelancers = [
    { name: 'Sarah Chen', earnings: 12500, rating: 4.9, projects: 34 },
    { name: 'Mike Rodriguez', earnings: 11200, rating: 4.8, projects: 28 },
    { name: 'Emily Johnson', earnings: 9800, rating: 4.9, projects: 31 },
    { name: 'David Kim', earnings: 8750, rating: 4.7, projects: 25 },
    { name: 'Lisa Wong', earnings: 8200, rating: 4.8, projects: 29 }
  ];

  const MetricCard = ({ title, value, change, icon: Icon, format = 'number' }) => {
    const isPositive = change > 0;
    const formatValue = (val) => {
      if (format === 'currency') return `$${val.toLocaleString()}`;
      if (format === 'percentage') return `${val}%`;
      return val.toLocaleString();
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatValue(value)}</p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}% from last month
              </span>
            </div>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    );
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive platform insights and metrics</p>
            </div>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'users', label: 'Users' },
              { id: 'projects', label: 'Projects' },
              { id: 'finance', label: 'Finance' },
              { id: 'performance', label: 'Performance' }
            ].map(tab => (
              <TabButton
                key={tab.id}
                id={tab.id}
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={setActiveTab}
              />
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Total Users" 
                value={overviewMetrics.totalUsers} 
                change={12.5} 
                icon={Users} 
              />
              <MetricCard 
                title="Active Projects" 
                value={overviewMetrics.activeProjects} 
                change={8.3} 
                icon={Briefcase} 
              />
              <MetricCard 
                title="Total Revenue" 
                value={overviewMetrics.totalRevenue} 
                change={15.7} 
                icon={DollarSign} 
                format="currency"
              />
              <MetricCard 
                title="Dispute Rate" 
                value={overviewMetrics.disputeRate} 
                change={-2.1} 
                icon={AlertTriangle} 
                format="percentage"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="freelancers" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="clients" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Job Categories</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={jobCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {jobCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Analytics</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="freelancers" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="clients" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="activeFreelancers" stroke="#ffc658" strokeWidth={2} />
                    <Line type="monotone" dataKey="repeatClients" stroke="#ff7300" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Freelancers</h3>
                <div className="space-y-4">
                  {topFreelancers.map((freelancer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{freelancer.name}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{freelancer.rating}</span>
                            <span>•</span>
                            <span>{freelancer.projects} projects</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${freelancer.earnings.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">earnings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard 
                title="Success Rate" 
                value={86.6} 
                change={4.2} 
                icon={Briefcase} 
                format="percentage"
              />
              <MetricCard 
                title="Avg. Project Duration" 
                value={14} 
                change={-8.5} 
                icon={Clock} 
              />
              <MetricCard 
                title="Avg. Bid vs Budget" 
                value={92.3} 
                change={2.1} 
                icon={DollarSign} 
                format="percentage"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects Posted vs Completed</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userGrowthData.map(d => ({ 
                    month: d.month, 
                    posted: Math.floor(d.freelancers * 0.8), 
                    completed: Math.floor(d.freelancers * 0.65) 
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="posted" fill="#8884d8" />
                    <Bar dataKey="completed" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
                <div className="space-y-3">
                  {jobCategoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">{category.name}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(category.value / Math.max(...jobCategoryData.map(c => c.value))) * 100}%`,
                              backgroundColor: category.color 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{category.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Finance Tab */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard 
                title="Monthly Revenue" 
                value={34500} 
                change={12.3} 
                icon={DollarSign} 
                format="currency"
              />
              <MetricCard 
                title="Commission Rate" 
                value={8.5} 
                change={0} 
                icon={TrendingUp} 
                format="percentage"
              />
              <MetricCard 
                title="Pending Withdrawals" 
                value={28} 
                change={-15.2} 
                icon={Clock} 
              />
              <MetricCard 
                title="Dispute Costs" 
                value={590} 
                change={-18.5} 
                icon={AlertTriangle} 
                format="currency"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="commission" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="subscription" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  {[
                    { method: 'PayPal', percentage: 45, amount: 125000 },
                    { method: 'Bank Transfer', percentage: 35, amount: 97000 },
                    { method: 'Crypto', percentage: 12, amount: 33000 },
                    { method: 'Credit Card', percentage: 8, amount: 22000 }
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{payment.method}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{payment.percentage}%</p>
                        <p className="text-sm text-gray-500">${payment.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard 
                title="Conversion Rate" 
                value={12.8} 
                change={5.2} 
                icon={TrendingUp} 
                format="percentage"
              />
              <MetricCard 
                title="User Churn Rate" 
                value={3.2} 
                change={-8.7} 
                icon={Users} 
                format="percentage"
              />
              <MetricCard 
                title="Avg. Session Duration" 
                value={24} 
                change={18.3} 
                icon={Clock} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visitors" fill="#8884d8" />
                    <Bar dataKey="conversions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
                <div className="space-y-4">
                  {[
                    { stage: 'Website Visitors', count: 35890, percentage: 100 },
                    { stage: 'Account Signups', count: 4587, percentage: 12.8 },
                    { stage: 'Profile Completed', count: 3251, percentage: 70.9 },
                    { stage: 'First Job Posted/Bid', count: 1876, percentage: 57.7 },
                    { stage: 'First Transaction', count: 892, percentage: 47.5 }
                  ].map((stage, index) => (
                    <div key={index} className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{stage.stage}</span>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900">{stage.count.toLocaleString()}</span>
                          <span className="text-sm text-gray-500 ml-2">({stage.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${stage.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;