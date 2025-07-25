import { useEffect, useState } from "react";
import cover from "../../../assets/cover.png";
import avatar from "../../../assets/p1.jpg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getClientProfile } from "../../../features/clientFeatures/profile/clientProfileSlice";
import type { AppDispatch, RootState } from "../../../app/store";
import RecentProject from "../../../components/client/profile/RecentProject";
import { PasswordChangeModal } from "../../../components/changePass/PasswordChangeModal";
import { changeEmail, changeEmailOtp, changePass, getUserDetails } from "../../../features/auth/authSlice";
import { toast } from "react-toastify";
import { EmailVerificationModal } from "../../../components/emailVerify/EmailVerificationModal";
import axiosClient from "../../../utils/axiosClient";
import type { AxiosError } from "axios";
interface FreelancerProject {
    _id: string;
    contractId: string;
    budget: number;
    budgetType: string;
    time: string;
    status: string;
    title: string;
    description: string;
}
export default function ClientProfile() {
    const dispatch = useDispatch<AppDispatch>();
    const { client } = useSelector((state: RootState) => state.clientProfile);
    const { user } = useSelector((state: RootState) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
    const [allProjects, setAllProjects] = useState<FreelancerProject[]>([]);
    const [completeProject, setCompleteProject] = useState<number>();
    const [pendingProject, setProgressProject] = useState<number>();
    const [postedProject, setPostedProject] = useState<number>();

    useEffect(() => {
        dispatch(getClientProfile())
            .unwrap()
            .then(() => { })
            .catch((error) => {
                console.error(error?.message);
            });

        dispatch(getUserDetails())
            .unwrap()
            .then(() => {
            })
            .catch((error) => {
                console.error(error?.message);
            });
    }, [dispatch]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {

                const res = await axiosClient.get("client/project/get-project");
                setAllProjects(res.data.data);
                console.log(res.data.data);
                
            } catch (err) {
                const error = err as AxiosError;
                toast.error("Failed to fetch projects")
                console.error("Failed to fetch projects:", error);

            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        setProgressProject(
            allProjects.reduce((acc, prg) => {
                return prg.status === "in-progress" ? acc + 1 : acc;
            }, 0)
        );
        setCompleteProject(
            allProjects.reduce((acc, prg) => {
                return prg.status === "completed" ? acc + 1 : acc;
            }, 0)
        );
        setPostedProject(
            allProjects.reduce((acc, prg) => {
                return prg.status === "posted" ? acc + 1 : acc;
            }, 0)
        );
    }, [allProjects])




    const handlePasswordChange = (passwords: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        dispatch(changePass(passwords))
            .unwrap()
            .then(() => {
                toast.success("Password changed successfully!");
            })
            .catch((error) => {
                const errorMessage = typeof error === 'string'
                    ? error
                    : error?.message || "Failed to change password";
                toast.error(errorMessage);

            });
    }


    const handleEmailVerification = (email: string, otp: string) => {
        dispatch(changeEmailOtp({ email, otp }))
            .unwrap()
            .then(() => {
                toast.success("Email Change successfully!");
            }).catch((error) => {
                const errorMessage = typeof error === 'string'
                    ? error
                    : error?.message || "Failed to change Email";
                toast.error(errorMessage);

            });
    };

    const onOtpVerify = async (email: string) => {
        dispatch(changeEmail({ email }))
            .unwrap()
            .then(() => {
                toast.success("Otp sent successfully!");
            }).catch((error) => {
                const errorMessage = typeof error === 'string'
                    ? error
                    : error?.message || "Failed to Verify Email";
                toast.error(errorMessage);
                setIsEmailVerificationOpen(false)
            });


    };





    return (
        <div className="container mx-auto px-4 pb-8 ">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 border border-color">
                <div className="relative">
                    <div className="w-full aspect-[5.5/1] overflow-hidden bg-amber-50">
                        <img
                            src={client?.coverPic ? client.coverPic : cover}
                            alt="Profile Banner"
                            className="w-full object-cover"
                        />
                    </div>

                    <div className="absolute left-4 bottom-0 transform translate-y-1/2">
                        <div className="h-30 w-30 rounded-full bg-white p-1 shadow-md">
                            <img
                                src={client?.profilePic ? client.profilePic : avatar}
                                alt="Profile"
                                className="h-full w-full rounded-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-4 px-4">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/3">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {user?.fullName}
                                <p className={`text-sm font-medium mt-1 px-2 py-1 rounded-full inline-block ml-2 ${user?.isVerification === 'verified'
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : user?.isVerification === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                        : user?.isVerification === 'rejected'
                                            ? 'bg-red-100 text-red-800 border border-red-200'
                                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                                    }`}>
                                    {user?.isVerification}
                                </p>
                            </h2>
                            <p className="text-gray-600 mt-1">{client?.companyName}</p>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <span>{client?.location ? client?.location : "Location"}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span>
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }) : 'N/A'}
                                    </span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span>{user?.email}</span>
                                </div>
                            </div>



                            <div className="mt-6">
                                <button className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white py-2 px-4 rounded-md font-medium transition-colors">
                                    Create new Job
                                </button>
                                <button
                                    onClick={() => setIsEmailVerificationOpen(true)}
                                    className="w-full mt-3 border border-[#2ECC71] text-[#2ECC71] hover:bg-[#EFFFF6] hover:text-[#27AE60] py-2 px-4 rounded-md font-medium transition-colors duration-200"
                                >
                                    Change Email
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full mt-3 border border-[#2ECC71] text-[#2ECC71] hover:bg-[#EFFFF6] hover:text-[#27AE60] py-2 px-4 rounded-md font-medium transition-colors  duration-200"

                                >
                                    Change Password
                                </button>
                                <Link
                                    to="edit"
                                    className="block w-full mt-3 border border-[#2ECC71] text-[#2ECC71] hover:bg-[#EFFFF6] hover:text-[#27AE60] py-2 px-4 rounded-md font-medium transition-colors text-center duration-200"
                                >
                                    Edit Profile
                                </Link>

                                <EmailVerificationModal
                                    isOpen={isEmailVerificationOpen}
                                    onClose={() => setIsEmailVerificationOpen(false)}
                                    onSubmit={handleEmailVerification}
                                    onOtpVerify={onOtpVerify}
                                />
                                <PasswordChangeModal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    onSubmit={handlePasswordChange}
                                />

                            </div>
                        </div>

                        <div className="w-full md:w-2/3">
                            <div className="grid grid-cols-3 gap-4 mb-6 ">
                                <div className=" p-4 rounded-md text-center shadow-sm bg-color-light border border-color">
                                    <h3 className="text-green-800 font-medium">
                                        Completed Projects
                                    </h3>
                                    <p className="text-2xl font-bold mt-1">
                                        {completeProject}
                                    </p>
                                </div>
                                <div className=" p-4 rounded-md text-center shadow-sm bg-color-light border border-color">
                                    <h3 className="text-green-800 font-medium">
                                        In-Progress Projects
                                    </h3>
                                    <p className="text-2xl font-bold mt-1">
                                        {pendingProject}
                                    </p>
                                </div>
                                <div className=" p-4 rounded-md text-center shadow-sm bg-color-light border border-color">
                                    <h3 className="text-green-800 font-medium">
                                        Poseted Projects
                                    </h3>
                                    <p className="text-2xl font-bold mt-1">
                                        {postedProject}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-4">Recent Projects</h3>


                                <RecentProject
                                    allProject={allProjects} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
