import MetricCard from "./MetricCard"
import {
    CheckCircle,

    Clock,
    Star,
    Users,
    BarChart3,
    Filter
} from 'lucide-react';
function FreelancerProjects() {
      const projectHistory = [
        { id: 1, name: 'E-commerce Website', client: 'TechCorp', status: 'Completed', earnings: 2500, rating: 5, date: '2024-05-15' },
        { id: 2, name: 'Mobile App UI', client: 'StartupXYZ', status: 'Active', earnings: 1800, rating: null, date: '2024-06-01' },
        { id: 3, name: 'Dashboard Design', client: 'DataCorp', status: 'Completed', earnings: 1200, rating: 4.8, date: '2024-04-20' },
        { id: 4, name: 'API Integration', client: 'TechCorp', status: 'Completed', earnings: 900, rating: 5, date: '2024-03-10' }
    ];
    return (
        <div className="space-y-8">
            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Projects"
                    value="47"
                    change={""}
                    icon={BarChart3}
                />
                <MetricCard
                    title="Completed"
                    value="44"
                    change={""}
                    icon={CheckCircle}
                />
                <MetricCard
                    title="Active"
                    value="3"
                    change={""}
                    icon={Clock}

                />
                <MetricCard
                    title="Repeat Clients"
                    value="12"
                    change={""}
                    icon={Users}

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
    )
}

export default FreelancerProjects
