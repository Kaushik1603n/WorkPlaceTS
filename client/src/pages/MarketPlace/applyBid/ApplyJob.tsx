import React, { useEffect, useState } from "react";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { getFreelancerProfile } from "../../../features/freelancerFeatures/profile/freelancerProfileSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { type AppDispatch, type RootState } from "../../../app/store";
import ProfileHeader from "../../../components/marketPlace/applyJob/ProfileHeader";
import MilestoneForm from "../../../components/marketPlace/applyJob/MilestoneForm";
import BidTypeSelector from "../../../components/marketPlace/applyJob/BidTypeSelector";
import ClientRequirements from "../../../components/marketPlace/applyJob/ClientRequirements";
import cover from "../../../assets/cover.png";
import avatar from "../../../assets/p1.jpg";
import { applyJobProposal } from "../../../features/marketPlace/marketPlaceSlice";

interface Milestone {
    id?: number;
    title: string;
    description: string;
    dueDate: string;
    amount: string;
}

interface FormValues {
    coverLetter: string;
    bidAmount: string;
    timeline: string;
    workSamples: string;
}

interface MilestoneErrors {
    title?: string;
    description?: string;
    dueDate?: string;
    amount?: string;
}

function ApplyJob() {
    const dispatch = useDispatch<AppDispatch>();
    const { freelancer } = useSelector((state: RootState) => state.freelancerProfile);
    const { user } = useSelector((state: RootState) => state.auth);
    // const baseURL = import.meta.env.VITE_API_BASE_URL as string;
    const { jobId } = useParams<{ jobId: string }>();

    useEffect(() => {
        dispatch(getFreelancerProfile())
            .unwrap()
            .then(() => { })
            .catch((error) => {
                console.error(error?.message);
            });
    }, [dispatch]);

    const [bidType, setBidType] = useState<"fixed" | "hourly">("fixed");
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [newMilestone, setNewMilestone] = useState<Milestone>({
        title: "",
        description: "",
        dueDate: "",
        amount: "",
    });
    const [formValues, setFormValues] = useState<FormValues>({
        coverLetter: "",
        bidAmount: "",
        timeline: "",
        workSamples: "",
    });
    const [agreeVideoCall, setAgreeVideoCall] = useState(false);
    const [agreeNDA, setAgreeNDA] = useState(false);
    const [milestoneErrors, setMilestoneErrors] = useState<MilestoneErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormValues({
            ...formValues,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleMilestoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewMilestone({
            ...newMilestone,
            [name]: value,
        });

        if (milestoneErrors[name as keyof MilestoneErrors]) {
            setMilestoneErrors({
                ...milestoneErrors,
                [name]: "",
            });
        }
    };

    const validateMilestone = () => {
        const errors: MilestoneErrors = {};

        if (!newMilestone.title.trim()) {
            toast.error("Title is required");
            return
        }

        if (!newMilestone.dueDate) {
            toast.error("Due date is required");
            return
        }
        const dueDate = new Date(newMilestone.dueDate);

        if (isNaN(dueDate.getTime())) {
            toast.error("Invalid due date");
            return;
        }

        const today = new Date();

        if (dueDate < today) {
            toast.error("Due date must be in the future");
            return;
        }
        if (!newMilestone.description) {
            toast.error("Description is required");
            return
        }

        if (!newMilestone.amount.trim()) {
            toast.error("Amount is required");
            return
        } else if (isNaN(parseFloat(newMilestone.amount))) {
            toast.error("Amount must be a valid number");
            return
        }

        setMilestoneErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const addMilestone = () => {
        if (!validateMilestone()) return;

        setMilestones([...milestones, { ...newMilestone, id: Date.now() }]);
        setNewMilestone({
            title: "",
            description: "",
            dueDate: "",
            amount: "",
        });
        setMilestoneErrors({});
    };

    const removeMilestone = (id: number) => {
        setMilestones(milestones.filter((milestone) => milestone.id !== id));
    };

    const validateForm = () => {
        // let newErrors = true;

        if (!formValues.coverLetter.trim()) {
            toast.error("Cover letter is required");
            return false;
        }

        if (!formValues.bidAmount.trim()) {
            toast.error("Bid amount is required");
            return false;
        } else if (isNaN(parseFloat(formValues.bidAmount))) {
            toast.error("Bid amount must be a valid number");
            return false;
        }

        if (!formValues.timeline.trim()) {
            toast.error("Timeline is required");
            return false;
        }

        if (!formValues.workSamples.trim()) {
            toast.error("Work samples link is required");
            return false;
        }

        if (!agreeVideoCall) {
            toast.error("You must agree to a video call interview if selected");
            return false;
        }

        if (!agreeNDA) {
            toast.error("You must agree to the Non-Disclosure Agreement terms");
            return false;
        }

        if (milestones.length === 0) {
            toast.error("At least one milestone is required");
            return false;
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const proposalData = {
            ...formValues,
            milestones,
            bidType,
            agreeVideoCall,
            agreeNDA,
            jobId: jobId || "",
        };



        if (validateForm()) {
            dispatch(applyJobProposal(proposalData))
                .unwrap()
                .then((response) => {
                    toast.success(response.message || "Proposal submitted successfully");
                    setMilestones([]);
                    setNewMilestone({
                        title: "",
                        description: "",
                        dueDate: "",
                        amount: "",
                    });
                    setFormValues({
                        coverLetter: "",
                        bidAmount: "",
                        timeline: "",
                        workSamples: "",
                    });
                    setAgreeNDA(false);
                    setAgreeVideoCall(false);
                })
                .catch((error) => {
                    console.error("Error submitting proposal:", error);
                    toast.error(error.error || "Failed to submit proposal");
                });

        }
    };

    return (
        <>
            <NavigationBar />
            <div className="max-w-4xl mx-auto pt-8 pb-16 px-4">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold">Submit Your Proposal</h1>
                    <p className="text-gray-600">
                        Complete the form below to send your proposal to the client.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 border border-color">
                    <ProfileHeader
                        coverPic={freelancer?.coverPic || cover}
                        profilePic={freelancer?.profilePic || avatar}
                        skills={freelancer?.skills || []}
                        fullName={user?.fullName || ""}
                        role={user?.role || ""}
                        location={freelancer?.location}
                        createdAt={freelancer?.createdAt}
                        email={user?.email}
                    />

                    <div className="pt-16 pb-4 px-4">
                        <div className="mb-8">
                            <div className="flex items-center mb-6">
                                <h2 className="text-xl font-bold">Proposal Details</h2>
                                <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                    Required
                                </span>
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 font-medium">Cover Letter</label>
                                <textarea
                                    className="w-full border border-color focus:outline-none  rounded-lg p-3 min-h-32"
                                    placeholder="Tell the client why you are best for this job..."
                                    name="coverLetter"
                                    value={formValues.coverLetter}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <BidTypeSelector
                                bidType={bidType}
                                onBidTypeChange={(type) => setBidType(type)}
                            />

                            <div className="mb-6">
                                <label className="block mb-2 font-medium">Bid Amount</label>
                                <input
                                    type="text"
                                    name="bidAmount"
                                    value={formValues.bidAmount}
                                    onChange={handleChange}
                                    className="w-full border border-color focus:outline-none rounded-lg p-3"
                                    placeholder="Enter your total project cost or hourly rate"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 font-medium">Timeline</label>
                                <input
                                    type="text"
                                    name="timeline"
                                    value={formValues.timeline}
                                    onChange={handleChange}
                                    className="w-full border border-color focus:outline-none rounded-lg p-3"
                                    placeholder="eg: 1 week"
                                />
                            </div>

                            <MilestoneForm
                                newMilestone={newMilestone}
                                // milestoneErrors={milestoneErrors}
                                onMilestoneChange={handleMilestoneChange}
                                onAddMilestone={addMilestone}
                                milestones={milestones}
                                onRemoveMilestone={removeMilestone}
                            />

                            <div className="mb-6">
                                <label className="block mb-2 font-medium">Work Samples</label>
                                <input
                                    type="text"
                                    name="workSamples"
                                    value={formValues.workSamples}
                                    onChange={handleChange}
                                    className="w-full border border-color focus:outline-none rounded-lg p-3"
                                    placeholder="eg: GitHub.com"
                                />
                            </div>

                            <ClientRequirements
                                agreeVideoCall={agreeVideoCall}
                                onAgreeVideoCallChange={() => setAgreeVideoCall(!agreeVideoCall)}
                                agreeNDA={agreeNDA}
                                onAgreeNDAChange={() => setAgreeNDA(!agreeNDA)}
                            />

                            <button
                                onClick={handleSubmit}
                                className="bg-green-500 text-white px-8 py-3 rounded-lg"
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ApplyJob;