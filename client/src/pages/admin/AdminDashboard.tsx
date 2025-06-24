import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import {
  Users, Briefcase, DollarSign, AlertTriangle, TrendingUp,
  Clock, Star,
} from 'lucide-react';

import MetricCard from '../../components/admin/dashboard/MetricCard';
import DashboardHeader from '../../components/admin/dashboard/DashboardHeader';
import TabNavigation from '../../components/admin/dashboard/TabNavigation';
import type {
  UserGrowthData, RevenueData, 
  TopFreelancer, OverviewMetrics,  JobData
} from '../../components/admin/dashboard/types';
import axiosClient from '../../utils/axiosClient';

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [topFreelancers, setTopFreelancer] = useState<TopFreelancer[]>([]);
  const [jobData, setJobData] = useState<JobData[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [jobDetails, setJobDetails] = useState({
    successRate: 100,
    avgBudget: 0,
    completedJob: 0,
    totalJob: 0,
    activeJob: 0
  });

  // Mock data for demonstration
  const overviewMetrics: OverviewMetrics = {
    totalUsers: 15847,
    totalProjects: 3421,
    totalRevenue: 284750,
    disputeRate: 2.3,
    activeProjects: 458,
    completedProjects: 2963
  };

  // const userGrowthDatas: UserGrowthData[] = [
  //   { month: 'Jan', freelancers: 1200, clients: 800 },
  //   { month: 'Feb', freelancers: 1450, clients: 920, },
  //   { month: 'Mar', freelancers: 1680, clients: 1100, },
  //   { month: 'Apr', freelancers: 1920, clients: 1280, },
  //   { month: 'May', freelancers: 2150, clients: 1450, },
  //   { month: 'Jun', freelancers: 2400, clients: 1620, }
  // ];

  const fetchUserGrowthData = async () => {
    const res = await axiosClient.get("/admin/usergrothdata")
    setUserGrowthData(res.data.data);
    setTotalUsers(res.data.totalUsers)

  }
  const fetchTopFreelancer = async () => {
    const res = await axiosClient.get("/admin/topfreelancer")
    setTopFreelancer(res.data.data);

  }
  const fetchJobGrowth = async () => {
    const res = await axiosClient.get("/admin/alljobcount")
    setJobData(res.data.data);
    console.log(res.data.data);

  }
  const fetchJobDetails = async () => {
    const res = await axiosClient.get("/admin/alljobdetails")
    setJobDetails(res.data.data);
    console.log(res.data.data);

  }

  // const jobCategoryData: JobCategoryData[] = [
  //   { name: 'Web Development', value: 1250, color: '#8884d8' },
  //   { name: 'Graphic Design', value: 890, color: '#82ca9d' },
  //   { name: 'Content Writing', value: 620, color: '#ffc658' },
  //   { name: 'Digital Marketing', value: 480, color: '#ff7300' },
  //   { name: 'Mobile Apps', value: 350, color: '#00ff88' },
  //   { name: 'Data Entry', value: 280, color: '#ff8042' }
  // ];

  const revenueData: RevenueData[] = [
    { month: 'Jan', commission: 18500, subscription: 4200, disputes: -800 },
    { month: 'Feb', commission: 22300, subscription: 4800, disputes: -650 },
    { month: 'Mar', commission: 25800, subscription: 5200, disputes: -920 },
    { month: 'Apr', commission: 28900, subscription: 5600, disputes: -750 },
    { month: 'May', commission: 31200, subscription: 6100, disputes: -680 },
    { month: 'Jun', commission: 34500, subscription: 6400, disputes: -590 }
  ];

  // const trafficData: TrafficData[] = [
  //   { source: 'Direct', visitors: 12450, conversions: 890 },
  //   { source: 'SEO', visitors: 8930, conversions: 1250 },
  //   { source: 'Paid Ads', visitors: 6780, conversions: 780 },
  //   { source: 'Social Media', visitors: 4520, conversions: 320 },
  //   { source: 'Referrals', visitors: 3210, conversions: 280 }
  // ];

  // const topFreelancers: TopFreelancer[] = [
  //   { name: 'Sarah Chen', earnings: 12500, rating: 4.9, projects: 34 },
  //   { name: 'Mike Rodriguez', earnings: 11200, rating: 4.8, projects: 28 },
  //   { name: 'Emily Johnson', earnings: 9800, rating: 4.9, projects: 31 },
  //   { name: 'David Kim', earnings: 8750, rating: 4.7, projects: 25 },
  //   { name: 'Lisa Wong', earnings: 8200, rating: 4.8, projects: 29 }
  // ];

  // const paymentMethods: PaymentMethod[] = [
  //   { method: 'PayPal', percentage: 45, amount: 125000 },
  //   { method: 'Bank Transfer', percentage: 35, amount: 97000 },
  //   { method: 'Crypto', percentage: 12, amount: 33000 },
  //   { method: 'Credit Card', percentage: 8, amount: 22000 }
  // ];

  // const conversionFunnel: ConversionFunnelStage[] = [
  //   { stage: 'Website Visitors', count: 35890, percentage: 100 },
  //   { stage: 'Account Signups', count: 4587, percentage: 12.8 },
  //   { stage: 'Profile Completed', count: 3251, percentage: 70.9 },
  //   { stage: 'First Job Posted/Bid', count: 1876, percentage: 57.7 },
  //   { stage: 'First Transaction', count: 892, percentage: 47.5 }
  // ];

  useEffect(() => {
    fetchUserGrowthData();
    fetchTopFreelancer();
    fetchJobGrowth()
    fetchJobDetails()
  }, [])
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader timeRange={timeRange} setTimeRange={setTimeRange} />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Total Users"
                value={totalUsers}
                icon={Users}
              />
              <MetricCard
                title="Active Projects"
                value={jobDetails.activeJob}
                icon={Briefcase}
              />
    
              <MetricCard
                title="Dispute Rate"
                value={overviewMetrics.disputeRate}
                icon={AlertTriangle}
                format="percentage"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="clients" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="freelancers" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* <div className="bg-white rounded-xl shadow-lg p-6">
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
              </div> */}
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
                          <span className="text-blue-600 font-semibold">{freelancer.fullName[0]}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{freelancer.fullName}</span><span>{" "}</span>
                          <span className="font-normal text-gray-900">({freelancer.email})</span>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{freelancer.averageRating.toFixed(2)}</span>
                            <span>({freelancer.feedbackCount})</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {/* <p className="font-semibold text-green-600">${freelancer.earnings.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">earnings</p> */}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Success Rate"
                value={jobDetails.successRate}
                icon={Briefcase}
                format="percentage"
              />
              <MetricCard
                title="Completed Project"
                value={jobDetails.completedJob}
                icon={Briefcase}
              />
              <MetricCard
                title="Total Project"
                value={jobDetails.totalJob}
                icon={Clock}
              />
              <MetricCard
                title="Avg Budget"
                value={jobDetails.avgBudget}
                icon={DollarSign}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects Posted vs Completed</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={jobData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="jobsPosted" fill="#8884d8" />
                    <Bar dataKey="hiresMade" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* <div className="bg-white rounded-xl shadow-lg p-6">
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
              </div> */}
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
                icon={DollarSign}
                format="currency"
              />
              <MetricCard
                title="Commission Rate"
                value={8.5}
                icon={TrendingUp}
                format="percentage"
              />
              <MetricCard
                title="Pending Withdrawals"
                value={28}

                icon={Clock}
              />
              <MetricCard
                title="Dispute Costs"
                value={590}

                icon={AlertTriangle}
                format="currency"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                <ResponsiveContainer width="100%" height={350}>
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

              {/* <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  {paymentMethods.map((payment, index) => (
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
              </div> */}
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {/* {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Conversion Rate"
                value={12.8}
                icon={TrendingUp}
                format="percentage"
              />
              <MetricCard
                title="User Churn Rate"
                value={3.2}
                icon={Users}
                format="percentage"
              />
              <MetricCard
                title="Avg. Session Duration"
                value={24}
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
                  {conversionFunnel.map((stage, index) => (
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
        )} */}
      </div>
    </div>
  );
};

export default AdminDashboard;