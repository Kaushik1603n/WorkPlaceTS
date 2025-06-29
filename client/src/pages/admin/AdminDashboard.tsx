import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import {
  Users, Briefcase, IndianRupee, AlertTriangle, TrendingUp,
  Clock, Star,
} from 'lucide-react';

import MetricCard from '../../components/admin/dashboard/MetricCard';
import DashboardHeader from '../../components/admin/dashboard/DashboardHeader';
import TabNavigation from '../../components/admin/dashboard/TabNavigation';
import type {
  UserGrowthData, RevenueData,
  TopFreelancer, JobData
} from '../../components/admin/dashboard/types';
import axiosClient from '../../utils/axiosClient';
import ErrorMessage from '../../components/ui/ErrorMessage';

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [topFreelancers, setTopFreelancer] = useState<TopFreelancer[]>([]);
  const [jobData, setJobData] = useState<JobData[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [revenueDetails, setRevenueDetails] = useState({
    revenue: 0,
    pending: 0,
    wallet: 0,

  });
  const [jobDetails, setJobDetails] = useState({
    successRate: 100,
    avgBudget: 0,
    completedJob: 0,
    totalJob: 0,
    activeJob: 0
  });



  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [
        userGrowthRes,
        freelancersRes,
        jobGrowthRes,
        jobDetailsRes,
        revenueRes
      ] = await Promise.all([
        axiosClient.get("/admin/usergrowthdata"),
        axiosClient.get("/admin/topfreelancer"),
        axiosClient.get("/admin/alljobcount"),
        axiosClient.get("/admin/alljobdetails"),
        axiosClient.get("/admin/revenuedata")
      ]);

      setUserGrowthData(userGrowthRes.data.data);
      setTotalUsers(userGrowthRes.data.totalUsers)
      setTopFreelancer(freelancersRes.data.data);
      setJobData(jobGrowthRes.data.data);
      setJobDetails(jobDetailsRes.data.data);
      setRevenueData(revenueRes.data.data);
      setRevenueDetails(revenueRes.data.revenueDetails);
      setIsLoading(false)



    } catch (error) {
      setIsLoading(false)
      setError(true)
      console.error('Dashboard data fetch error:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Payments...</p>
        </div>
      </div>
    );
  }
  if (error) {

    return <ErrorMessage
      message="Failed to load data. Please try again."
      onRetry={() => {
        fetchDashboardData();
      }}
    />
  }


  // const revenueData: RevenueData[] = [
  //   {
  //     platformFee: 30,
  //     week: 'Week ,262025',
  //     dateRange: '2025-06-24 to 2025-06-30'
  //   },
  //   {
  //     platformFee: 300,
  //     week: 'Week ,262025',
  //     dateRange: '2025-06-24 to 2025-06-30'
  //   },
  //   {
  //     platformFee: 100,
  //     week: 'Week ,262025',
  //     dateRange: '2025-06-24 to 2025-06-30'
  //   },
  //   {
  //     platformFee: 50,
  //     week: 'Week ,262025',
  //     dateRange: '2025-06-24 to 2025-06-30'
  //   },

  // ];


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
                value={2.3}
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
                icon={IndianRupee}
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

            </div>
          </div>
        )}

        {/* Finance Tab */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Revenue"
                value={revenueDetails.revenue }
                icon={IndianRupee}
              />
              <MetricCard
                title="Wallet"
                value={revenueDetails.wallet}
                icon={TrendingUp}
              />
              <MetricCard
                title="Pending"
                value={revenueDetails.pending }

                icon={Clock}
              />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="platformFee" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;