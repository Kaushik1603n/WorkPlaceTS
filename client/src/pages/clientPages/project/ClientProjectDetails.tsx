import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import {  Calendar, Eye, ExternalLink } from "lucide-react";
import axiosClient from "../../../utils/axiosClient";
import { JobDetailsCard } from "../../../components/client/project/JobDetailsCard";
import { ProposalsList } from "../../../components/client/project/ProposalsList";


interface JobDetails {
  title: string;
  description: string;
  stack: string;
  time: string;
  reference: string;
  requiredFeatures: string[];
  budgetType: string;
  budget: string;
  experienceLevel: string;
  clientId: {
    fullName: string;
    email: string;
  };
}

interface Proposal {
  proposal_id: string;
  freelancerName: string;
  freelancerEmail: string;
  jobTitle: string;
  status: string;
  submittedAt: string;
  bidAmount: string;
}

function ClientJobWithProposals() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState({
    job: true,
    proposals: true,
  });
  const [error, setError] = useState({
    job: "",
    proposals: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProjectsDetails = async () => {
      try {
        const res = await axiosClient.get(`jobs/job-details/${jobId}`);
        if (isMounted) {
          setJob(res.data.data);
        }
      } catch (err) {
        if (isMounted) {
          setError((prev) => ({ ...prev, job: (err as Error).message }));
        }
      } finally {
        if (isMounted) {
          setLoading((prev) => ({ ...prev, job: false }));
        }
      }
    };

    const fetchProposalDetails = async () => {
      try {
        const res = await axiosClient.get(`proposal/all-proposal/${jobId}`);
        if (isMounted) {
          setProposals(res.data.data);
        }
      } catch (err) {
        if (isMounted) {
          setError((prev) => ({ ...prev, proposals: (err as Error).message }));
        }
      } finally {
        if (isMounted) {
          setLoading((prev) => ({ ...prev, proposals: false }));
        }
      }
    };

    Promise.all([fetchProjectsDetails(), fetchProposalDetails()]);

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  if (loading.job || loading.proposals) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error.job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 border border-red-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Job</h3>
            <p className="text-red-600 mb-4">{error.job}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  m-3 rounded-lg border border-[#2bd773] bg-[#EFFFF6]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {job?.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Posted recently</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{proposals.length} proposals</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-7 gap-8">
          <div className="xl:col-span-4">
            {job && <JobDetailsCard job={job} />}
          </div>

          <div className="xl:col-span-3">
            <ProposalsList proposals={proposals} error={error.proposals} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientJobWithProposals;