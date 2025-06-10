import React, { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import axiosClient from '../../../utils/axiosClient';
import type { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { ProjectHeader } from '../../../components/freelancer/project-submission/ProjectHeader';
import { ProjectOverview } from '../../../components/freelancer/project-submission/ProjectOverview';
import { MilestonesDeliverables } from '../../../components/freelancer/project-submission/MilestonesDeliverables';
import { Timeline } from '../../../components/freelancer/project-submission/Timeline';

// Types
// interface Milestone {
//   _id: number;
//   title: string;
//   dueDate: string;
//   amount: number;
//   status: 'pending' | 'in-progress' | 'submit';
// }

// interface TimelineItem {
//   id: number;
//   title: string;
//   date: string;
//   status: 'completed' | 'current' | 'upcoming';
//   type: 'started' | 'deadline' | 'milestone' | 'delivery';
// }

// interface FileItem {
//   id: number;
//   name: string;
//   type: 'client' | 'freelancer';
//   uploadDate?: string;
// }

interface Milestones {
  _id: string;
  title: string;
  amount: number;
  dueDate: string | Date;
  description: string;
  status: "submitted"
  | "interviewing"
  | "rejected"
  | "accepted"
  | "cancelled"
  | "active"
  | "completed"
  | "pending";
}

interface ProposalDetails {
  _id: string;
  coverLetter: string;
  budgetType: 'fixed' | 'hourly';
  bidAmount: number;
  estimatedTime: number;
  milestones: Milestones[];
  status: 'interviewing' | 'hired' | 'rejected' | 'pending';
  payments: string[];
  createdAt: Date;
  updatedAt: Date;
  contractId: string;
}

interface JobDetails {
  jobId: string;
  title: string;
  description: string;
  stack: string;
  time: string;
  reference: string;
  requiredFeatures: string;
  hiredFreelancer: string;
  hiredProposalId: string;
  budgetType: 'fixed' | 'hourly';
  budget: number;
  clientId: string;
  clientEmail: string;
  clientFullName: string;
}

// interface JobContractData {
//   jobDetails: JobDetails;
//   proposalDetails: ProposalDetails;
// }

// Header Component
// const ProjectHeader: React.FC = () => (
//   <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
//     <div className="flex justify-between items-start">
//       <div>
//         <h1 className="text-2xl font-semibold text-gray-900 mb-2">E-commerce Website Development</h1>
//         <div className="flex items-center gap-4 text-sm text-gray-600">
//           <span>Client: <span className="text-blue-600 font-medium">John Davidson</span></span>
//           <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Active</span>
//         </div>
//         <p className="text-sm text-gray-500 mt-1">Job ID: #A2427B3 | Accepted: April 28, 2025</p>
//       </div>
//       <div className="text-right">
//         <p className="text-sm text-gray-600 mb-1">Progress:</p>
//         <p className="text-lg font-semibold text-gray-900">25% Complete</p>
//         <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
//           <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// Project Overview Component
// const ProjectOverview: React.FC = () => (
//   <div className="bg-white border border-gray-200 rounded-lg p-6">
//     <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h2>

//     <div className="mb-6">
//       <h3 className="text-sm font-semibold text-gray-700 mb-2">Client's Initial Brief</h3>
//       <p className="text-sm text-gray-600 leading-relaxed">
//         I need a modern e-commerce website built with Shopify. The website should have a clean,
//         professional design focused on selling electronics products. It needs to include a custom checkout
//         process, product comparison features, and integration with our existing inventory system.
//       </p>
//     </div>

//     <div className="mb-6">
//       <h3 className="text-sm font-semibold text-blue-600 mb-3">Goals/Requirements:</h3>
//       <ul className="space-y-2 text-sm text-gray-600">
//         <li className="flex items-start">
//           <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//           Build a Shopify store with custom checkout
//         </li>
//         <li className="flex items-start">
//           <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//           Create product comparison functionality
//         </li>
//         <li className="flex items-start">
//           <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//           Integrate with existing inventory system
//         </li>
//         <li className="flex items-start">
//           <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//           Mobile-responsive design
//         </li>
//         <li className="flex items-start">
//           <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//           SEO optimization for product pages
//         </li>
//       </ul>
//     </div>

//     <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//       <h3 className="text-sm font-semibold text-gray-700 mb-3">Freelancer's Proposal Summary</h3>

//       <div className="mb-4">
//         <h4 className="text-sm font-medium text-blue-600 mb-2">Scope of Work:</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//           <div>
//             <p className="font-medium mb-1">Deliverables:</p>
//             <p>Homepage, Product Pages, Category Pages, Cart & Checkout, Payment Gateway Setup, Inventory Integration</p>
//           </div>
//           <div>
//             <p className="font-medium mb-1">Timeline:</p>
//             <p><strong>Start Date:</strong> May 5, 2025</p>
//             <p><strong>Deadline:</strong> May 30, 2025</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// Financial Details Component
const FinancialDetails: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h2>

    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Agreed Price:</span>
        <span className="font-semibold text-gray-900">$2,000 (Fixed Price)</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Payment Status:</span>
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Payment Pending</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Platform Fee:</span>
        <span className="text-gray-900">10% ($200)</span>
      </div>

      <hr className="border-gray-200" />

      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700">You'll Receive:</span>
        <span className="text-lg font-bold text-gray-900">$1,800</span>
      </div>

      <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
        Request Milestone Payment
      </button>

      <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
        Download Invoice
      </button>
    </div>
  </div>
);

// Milestones Component
// const MilestonesDeliverables: React.FC = () => {
//   const [milestones] = useState<Milestone[]>([
//     { _id: 1, title: 'Draft Design', dueDate: 'May 10, 2025', amount: 500, status: 'in-progress' },
//     { _id: 2, title: 'Development', dueDate: 'May 20, 2025', amount: 1000, status: 'pending' },
//     { _id: 3, title: 'Final Delivery', dueDate: 'May 30, 2025', amount: 500, status: 'pending' }
//   ]);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'in-progress': return 'bg-yellow-100 text-yellow-800';
//       case 'pending': return 'bg-gray-100 text-gray-600';
//       case 'submit': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-600';
//     }
//   };

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case 'in-progress': return 'In Progress';
//       case 'pending': return 'Pending';
//       case 'submit': return 'Submit Work';
//       default: return 'Pending';
//     }
//   };

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-900">Milestones & Deliverables</h2>
//         <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1 rounded transition-colors">
//           Submit Work
//         </button>
//       </div>

//       <div className="space-y-4">
//         {milestones.map((milestone) => (
//           <div key={milestone._id} className="border border-gray-200 rounded-lg p-4">
//             <div className="flex justify-between items-start mb-2">
//               <div>
//                 <h3 className="font-medium text-gray-900">Milestone {milestone.id}: {milestone.title}</h3>
//                 <p className="text-sm text-gray-500">Due: {milestone.dueDate}</p>
//               </div>
//               <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
//                 {getStatusText(milestone.status)}
//               </span>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold text-gray-900">${milestone.amount}</span>
//               <button className="border border-green-500 text-green-600 hover:bg-green-50 text-sm font-medium px-3 py-1 rounded transition-colors">
//                 Submit for Review
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// Timeline Component
// const Timeline: React.FC = () => {
//   const [timelineItems] = useState<TimelineItem[]>([
//     { id: 1, title: 'Project Started', date: 'May 5, 2025', status: 'completed', type: 'started' },
//     { id: 2, title: 'First Draft Deadline', date: 'May 10, 2025', status: 'current', type: 'deadline' },
//     { id: 3, title: 'Development Milestone', date: 'May 20, 2025', status: 'upcoming', type: 'milestone' },
//     { id: 4, title: 'Final Delivery', date: 'May 30, 2025', status: 'upcoming', type: 'delivery' }
//   ]);

//   const getStatusIcon = (status: string, type: string) => {
//     if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-500" />;
//     if (status === 'current') return <Clock className="w-4 h-4 text-blue-500" />;
//     return <AlertCircle className="w-4 h-4 text-gray-400" />;
//   };

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-6">
//       <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline & Deadlines</h2>

//       <div className="space-y-4">
//         {timelineItems.map((item) => (
//           <div key={item.id} className="flex items-start space-x-3">
//             <div className="flex-shrink-0 mt-1">
//               {getStatusIcon(item.status, item.type)}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className={`text-sm font-medium ${item.status === 'completed' ? 'text-green-700' : item.status === 'current' ? 'text-blue-700' : 'text-gray-700'}`}>
//                 {item.title}
//               </p>
//               <p className="text-xs text-gray-500">{item.date}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <button className="w-full mt-4 border border-orange-300 text-orange-600 hover:bg-orange-50 font-medium py-2 px-4 rounded-lg transition-colors">
//         Request Deadline Extension
//       </button>
//     </div>
//   );
// };

// Terms Component
const TermsConditions: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h2>

    <div className="space-y-4 text-sm text-gray-600">
      <div>
        <h3 className="font-medium text-gray-700 mb-1">Revision Policy</h3>
        <p>Includes 2 free revisions per milestone; additional revisions at $50/hour.</p>
      </div>

      <div>
        <h3 className="font-medium text-gray-700 mb-1">Cancellation Policy</h3>
        <p>Client may cancel before Milestone 2 with 50% refund of remaining balance. After Milestone 2, a 25% refund is applicable.</p>
      </div>

      <div>
        <h3 className="font-medium text-gray-700 mb-1">Intellectual Property</h3>
        <p>All rights transfer to client upon final payment. Source files will be provided as specified in the agreement.</p>
      </div>
    </div>
  </div>
);

// Files Component
// const FilesSubmissions: React.FC = () => {

//   const [files] = useState<FileItem[]>([
//     { id: 1, name: 'Brand_Guidelines.pdf', type: 'client' },
//     { id: 2, name: 'Logo_Files.zip', type: 'client' },
//     { id: 3, name: 'Product_Descriptions.docx', type: 'client' },
//     { id: 4, name: 'Homepage_Wireframe_v1.png', type: 'freelancer', uploadDate: 'May 8, 2025' },
//     { id: 5, name: 'Site_Structure.pdf', type: 'freelancer', uploadDate: 'May 7, 2025' }
//   ]);




//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-6">
//       <h2 className="text-lg font-semibold text-gray-900 mb-4">Files & Submissions</h2>

//       <div className="mb-6">
//         <h3 className="text-sm font-semibold text-gray-700 mb-3">Client's Uploads</h3>
//         <div className="space-y-2">
//           {files.filter(f => f.type === 'client').map((file) => (
//             <div key={file.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
//               <div className="flex items-center space-x-2">
//                 <Download className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm text-gray-700">{file.name}</span>
//               </div>
//               <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mb-6">
//         <h3 className="text-sm font-semibold text-gray-700 mb-3">Freelancer's Submissions</h3>
//         <div className="space-y-2">
//           {files.filter(f => f.type === 'freelancer').map((file) => (
//             <div key={file.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
//               <div className="flex items-center space-x-2">
//                 <Download className="w-4 h-4 text-gray-400" />
//                 <div>
//                   <span className="text-sm text-gray-700 block">{file.name}</span>
//                   {file.uploadDate && <span className="text-xs text-gray-500">{file.uploadDate}</span>}
//                 </div>
//               </div>
//               <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <button className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
//         <Upload className="w-4 h-4" />
//         <span>Upload New Files</span>
//       </button>
//     </div>
//   );
// };

// Actions Component
const Actions: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>

    <div className="space-y-3">
      <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
        Submit Work for Milestone 1
      </button>

      <button className="w-full border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
        <DollarSign className="w-4 h-4" />
        <span>Request Milestone Payment</span>
      </button>

      {/* <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
        <Clock className="w-4 h-4" />
        <span>Extend Deadline</span>
      </button>

      <button className="w-full border border-red-300 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
        <AlertCircle className="w-4 h-4" />
        <span>Report Issue</span>
      </button> */}
    </div>
  </div>
);

// Main Dashboard Component
const ProjectDashboard: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();

  const [jobDetails, SetJobDetails] = useState<JobDetails>({
    jobId: '',
    title: '',
    description: '',
    stack: '',
    time: '',
    reference: '',
    requiredFeatures: '',
    hiredFreelancer: '',
    hiredProposalId: '',
    budgetType: "hourly",
    budget: 0,
    clientId: '',
    clientEmail: '',
    clientFullName: '',
  })
  const [proposalDetails, SetProposalDetails] = useState<ProposalDetails>({
    _id: "",
    coverLetter: "",
    budgetType: 'fixed',
    bidAmount: 0,
    estimatedTime: 4,
    milestones: [],
    status: 'interviewing',
    payments: [],
    createdAt: new Date,
    updatedAt: new Date,
    contractId: "",
  })
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosClient.get(`/jobs/project-details/${jobId}`);
        SetJobDetails(res.data.data?.jobDetails);
        SetProposalDetails(res.data.data?.proposalDetails);

      } catch (err) {
        const error = err as AxiosError;
        console.error("Failed to fetch projects:", error);
        setError(
          "Failed to load projects. Please try again later."
        );
      } finally {
        setLoading(false);

      }
    };

    fetchProjects();
  }, [jobId])
  // console.log(proposalDetails.milestones);

  if (loading) {
    console.log("");

  }
  if (error) {
    console.log("error");



  }
  const onSubmitWork = (id: string) => {
    console.log(id);

  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ProjectHeader title={jobDetails.title} clientName={jobDetails.clientFullName}
          status={"active"} jobId={jobDetails.jobId}
          acceptedDate={"1/1/1"} progress={50} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ProjectOverview
              brief={jobDetails.description}
              goals={jobDetails.requiredFeatures}
              deliverables={jobDetails.requiredFeatures}
              startDate={proposalDetails.createdAt}
              deadline={proposalDetails.updatedAt}
            />
            <MilestonesDeliverables milestones={proposalDetails.milestones} onSubmitWork={onSubmitWork} />
            {/* <FilesSubmissions /> */}
            <TermsConditions />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <FinancialDetails />
            <Timeline />
            <Actions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;