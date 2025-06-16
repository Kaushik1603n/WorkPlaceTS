import { useParams } from "react-router-dom";
import MilestoneSubmissions from "../../../components/client/project/MilestoneSubmissions";

const ClientProjectPage = () => {
  const { jobId } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Project Milestones</h1>
      <MilestoneSubmissions jobId={jobId as string} />
    </div>
  );
};

export default ClientProjectPage