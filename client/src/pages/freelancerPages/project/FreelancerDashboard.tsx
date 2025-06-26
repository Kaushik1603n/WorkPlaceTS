import { useState } from "react";
import TabButton from "../../../components/freelancer/dashboard/TabButton";
import FreelancerOverview from "../../../components/freelancer/dashboard/FreelancerOverview";
import FreelancerEarnings from "../../../components/freelancer/dashboard/FreelancerEarnings";
import FreelancerProjects from "../../../components/freelancer/dashboard/FreelancerProjects";

export default function FreelancerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Freelancer Analytics Dashboard</h1>
                    <p className="text-gray-600">Track your performance, earnings, and growth insights</p>
                </div>

                <div className="flex space-x-4 mb-8 overflow-x-auto">
                    <TabButton id="overview" label="Overview" active={activeTab === 'overview'} onClick={setActiveTab} />
                    <TabButton id="earnings" label="Earnings" active={activeTab === 'earnings'} onClick={setActiveTab} />
                    <TabButton id="projects" label="Projects" active={activeTab === 'projects'} onClick={setActiveTab} />
                </div>


                {activeTab === 'overview' && (
                    <FreelancerOverview />
                )}

                {activeTab === 'earnings' && (
                    <FreelancerEarnings />
                )}

                {activeTab === 'projects' && (
                    <FreelancerProjects />
                )}
            </div>
        </div>
    );
}