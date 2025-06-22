import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Clock, Star, Target, Calendar, Award, AlertTriangle } from 'lucide-react';

const ClientSampleAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('hiring');

  // Sample data
  const hiringData = [
    { month: 'Jan', jobsPosted: 15, hiresMade: 12 },
    { month: 'Feb', jobsPosted: 22, hiresMade: 18 },
    { month: 'Mar', jobsPosted: 28, hiresMade: 24 },
    { month: 'Apr', jobsPosted: 19, hiresMade: 16 },
    { month: 'May', jobsPosted: 31, hiresMade: 28 },
    { month: 'Jun', jobsPosted: 25, hiresMade: 22 }
  ];

  const bidData = [
    { category: 'Web Dev', avgBids: 24 },
    { category: 'Design', avgBids: 18 },
    { category: 'Writing', avgBids: 32 },
    { category: 'Marketing', avgBids: 15 },
    { category: 'Data Entry', avgBids: 28 }
  ];

  const financialData = [
    { month: 'Jan', spent: 8500, avgCost: 680 },
    { month: 'Feb', spent: 12300, avgCost: 720 },
    { month: 'Mar', spent: 15600, avgCost: 650 },
    { month: 'Apr', spent: 9800, avgCost: 612 },
    { month: 'May', spent: 18200, avgCost: 650 },
    { month: 'Jun', spent: 14500, avgCost: 659 }
  ];

  const skillsData = [
    { name: 'React/Next.js', value: 35, color: '#3B82F6' },
    { name: 'Python', value: 28, color: '#10B981' },
    { name: 'UI/UX Design', value: 22, color: '#F59E0B' },
    { name: 'Content Writing', value: 15, color: '#EF4444' }
  ];

  const deliveryData = [
    { week: 'W1', onTime: 85, late: 15 },
    { week: 'W2', onTime: 92, late: 8 },
    { week: 'W3', onTime: 78, late: 22 },
    { week: 'W4', onTime: 88, late: 12 }
  ];

  const MetricCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-green-100' : 'bg-blue-100'}`}>
          <Icon className={`w-6 h-6 ${trend === 'up' ? 'text-green-600' : 'text-blue-600'}`} />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-lg font-medium transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Analytics Dashboard</h1>
          <p className="text-gray-600">Track your freelancing projects, spending, and performance metrics</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          <TabButton id="hiring" label="Hiring & Projects" active={activeTab === 'hiring'} onClick={setActiveTab} />
          <TabButton id="financial" label="Financial Insights" active={activeTab === 'financial'} onClick={setActiveTab} />
          <TabButton id="performance" label="Freelancer Performance" active={activeTab === 'performance'} onClick={setActiveTab} />
          <TabButton id="trends" label="Market Trends" active={activeTab === 'trends'} onClick={setActiveTab} />
        </div>

        {/* Hiring & Project Metrics */}
        {activeTab === 'hiring' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Jobs Posted This Month"
                value="25"
                change="+12% vs last month"
                icon={Target}
                trend="up"
              />
              <MetricCard
                title="Successful Hires"
                value="22"
                change="+8% vs last month"
                icon={Users}
                trend="up"
              />
              <MetricCard
                title="Freelancer Retention"
                value="68%"
                change="+5% vs last month"
                icon={Award}
                trend="up"
              />
              <MetricCard
                title="Avg Completion Time"
                value="7.2 days"
                change="-1.3 days vs last month"
                icon={Clock}
                trend="up"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Jobs Posted vs Hires Made</h3>
                <ResponsiveContainer width="100%" height={300}>
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

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Bids by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bidData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgBids" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Financial Insights */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Spent"
                value="$78,900"
                change="+15% vs last month"
                icon={DollarSign}
                trend="up"
              />
              <MetricCard
                title="Avg Cost per Project"
                value="$659"
                change="-3% vs last month"
                icon={TrendingDown}
                trend="up"
              />
              <MetricCard
                title="Total Savings"
                value="$12,450"
                change="+22% vs last month"
                icon={TrendingUp}
                trend="up"
              />
              <MetricCard
                title="Active Projects"
                value="18"
                change="+4 vs last month"
                icon={Target}
                trend="up"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="spent" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Project Cost</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgCost" stroke="#10B981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">$32,400</div>
                  <div className="text-sm text-gray-600">Web Development</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$18,750</div>
                  <div className="text-sm text-gray-600">Design</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">$15,200</div>
                  <div className="text-sm text-gray-600">Content Writing</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">$12,550</div>
                  <div className="text-sm text-gray-600">Marketing</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Freelancer Performance */}
        {activeTab === 'performance' && (
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
                <ResponsiveContainer width="100%" height={300}>
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
        )}

        {/* Market Trends */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Trending Skill"
                value="AI/ML"
                change="+45% demand"
                icon={TrendingUp}
                trend="up"
              />
              <MetricCard
                title="Best Posting Time"
                value="2-4 PM"
                change="30% faster hires"
                icon={Calendar}
                trend="up"
              />
              <MetricCard
                title="Market Competition"
                value="Medium"
                change="Stable vs last month"
                icon={Target}
                trend="up"
              />
              <MetricCard
                title="Avg Bid Range"
                value="$45-85/hr"
                change="+8% vs last month"
                icon={DollarSign}
                trend="up"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Skills in Demand</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={skillsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {skillsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Times to Post Jobs</h3>
                <div className="space-y-4">
                  {[
                    { time: '2:00 PM - 4:00 PM', efficiency: 92, day: 'Tuesday-Thursday' },
                    { time: '10:00 AM - 12:00 PM', efficiency: 87, day: 'Monday-Wednesday' },
                    { time: '8:00 PM - 10:00 PM', efficiency: 78, day: 'Sunday-Tuesday' },
                    { time: '6:00 AM - 8:00 AM', efficiency: 65, day: 'Wednesday-Friday' }
                  ].map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{slot.time}</div>
                        <div className="text-sm text-gray-600">{slot.day}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${slot.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{slot.efficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitor Pricing Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$25-45</div>
                  <div className="text-lg font-medium text-gray-900">Entry Level</div>
                  <div className="text-sm text-gray-600">Junior developers, basic design</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">$45-85</div>
                  <div className="text-lg font-medium text-gray-900">Mid Level</div>
                  <div className="text-sm text-gray-600">Experienced professionals</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">$85-150</div>
                  <div className="text-lg font-medium text-gray-900">Expert Level</div>
                  <div className="text-sm text-gray-600">Specialists, senior architects</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSampleAnalyticsDashboard;