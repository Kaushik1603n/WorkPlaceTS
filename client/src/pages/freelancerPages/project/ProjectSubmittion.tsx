import React, { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import axiosClient from '../../../utils/axiosClient';
import type { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { ProjectHeader } from '../../../components/freelancer/project-submission/ProjectHeader';
import { ProjectOverview } from '../../../components/freelancer/project-submission/ProjectOverview';
import { MilestonesDeliverables } from '../../../components/freelancer/project-submission/MilestonesDeliverables';
import { Timeline } from '../../../components/freelancer/project-submission/Timeline';
import { MilestoneSubmissionModal } from '../../../components/freelancer/project-submission/MilestoneSubmissionModal';
import { toast } from 'react-toastify';


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
  job_Id: string;
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
    </div>
  </div>
);

// Main Dashboard Component
const ProjectDashboard: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();

  const [jobDetails, SetJobDetails] = useState<JobDetails>({
    jobId: '',
    job_Id: '',
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
  const [proposalDetails, setProposalDetails] = useState<ProposalDetails>({
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
  const [selectedMilestone, setSelectedMilestone] = useState<Milestones | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosClient.get(`/jobs/project-details/${jobId}`);
        SetJobDetails(res.data.data?.jobDetails);
        setProposalDetails(res.data.data?.proposalDetails);

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

  if (loading) {
    console.log("");

  }
  if (error) {
    console.log("error");
  }

  const onSubmitWork = (milestoneId: string) => {
    const milestone = proposalDetails.milestones.find((m) => m._id === milestoneId);
    if (milestone) {
      setSelectedMilestone(milestone);
    }
  };

  const handleMilestoneSubmission = async (milestoneId: string, deliverables: { links: string[]; comments: string }) => {
    try {
      setLoading(true);
      const submissionData = {
        milestoneId,
        comments: deliverables.comments,
        links: deliverables.links
      };

      console.log(submissionData);

      await axiosClient.post(`/jobs/submit-milestone/${jobId}`, submissionData,);

      // Refresh project details after submission
      const res = await axiosClient.get(`/jobs/project-details/${jobId}`);
      setProposalDetails(res.data.data?.proposalDetails);

      toast.success('Milestone submitted successfully!');
    } catch (err) {
      const error = err as AxiosError;
      console.error('Failed to submit milestone:', error);
      toast.error('Failed to submit milestone. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ProjectHeader title={jobDetails.title} clientName={jobDetails.clientFullName}
          status={"active"} jobId={jobDetails.job_Id}
          acceptedDate={"1/1/1"} progress={50} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">
            <ProjectOverview
              brief={jobDetails.description}
              goals={jobDetails.requiredFeatures}
              deliverables={jobDetails.requiredFeatures}
              startDate={proposalDetails.createdAt}
              deadline={proposalDetails.updatedAt}
            />
            <MilestonesDeliverables milestones={proposalDetails.milestones} onSubmitWork={onSubmitWork} />
            <TermsConditions />
          </div>

          <div className="space-y-6">
            <FinancialDetails />
            <Timeline />
            <Actions />
          </div>
        </div>
      </div>
      {selectedMilestone && (
        <MilestoneSubmissionModal
          milestone={selectedMilestone}
          onSubmit={handleMilestoneSubmission}
          onClose={() => setSelectedMilestone(null)}
        />
      )}
    </div>
  );
};

export default ProjectDashboard;