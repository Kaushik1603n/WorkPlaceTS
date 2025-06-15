import { useEffect, useState } from "react";
import cover from "../../../assets/cover.png";
import avatar from "../../../assets/p1.jpg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import RecentProject from "../../../components/client/profile/RecentProject";
import { getFreelancerProfile } from "../../../features/freelancerFeatures/profile/freelancerProfileSlice";
import { PasswordChangeModal } from "../../../components/changePass/PasswordChangeModal";
import { changePass } from "../../../features/auth/authSlice";
import { toast } from "react-toastify";

export default function FreelancerProfile() {
    const dispatch = useDispatch<AppDispatch>();
    const { freelancer } = useSelector((state: RootState) => state.freelancerProfile);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(getFreelancerProfile())
            .unwrap()
            .then(() => { })
            .catch((error) => {
                console.error(error?.message);
            });
    }, [dispatch]);

    const [projectStats] = useState({
        completed: 10,
        pending: 2,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

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


    return (
        <div className="container mx-auto px-4 pb-8 ">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 border border-color">
                <div className="relative">
                    <div className="w-full aspect-[5.5/1] overflow-hidden bg-amber-50">
                        <img
                            src={freelancer?.coverPic ? freelancer.coverPic : cover}
                            alt="Profile Banner"
                            className="w-full object-cover"
                        />
                    </div>

                    <div className="absolute left-4 bottom-0 transform translate-y-1/2">
                        <div className="h-30 w-30 rounded-full bg-white p-1 shadow-md">
                            <img
                                src={freelancer?.profilePic ? freelancer.profilePic : avatar}
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
                            </h2>
                            {/* <p className="text-gray-600 mt-1">{freelancer?.role?freelancer?.role:"freelancer"}</p> */}

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
                                    <span>{freelancer?.location ? freelancer?.location : "Location"}</span>
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

                            {/* <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-800">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-800">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-800">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
              </div> */}

                            <div className="mt-6">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full mt-3 bg-[#EFFFF6] border border-[#2ECC71] hover:bg-[#2ECC71] text-[#2ECC71] hover:text-[#fff] py-2 px-4 rounded-md font-medium transition-colors"
                                >
                                    Change Password
                                </button>

                                <PasswordChangeModal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    onSubmit={handlePasswordChange}
                                />

                                <Link
                                    to="edit"
                                    className="block w-full mt-3 border border-[#2ECC71] text-[#2ECC71] hover:bg-[#EFFFF6] hover:text-[#27ae60] py-2 px-4 rounded-md font-medium text-center transition duration-200"
                                >
                                    Edit Profile
                                </Link>
                            </div>
                            <div className="mt-6 border border-color rounded-md p-4 w-full">
                                <h3 className="text-lg font-semibold mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2 max-h-35 overflow-y-auto p-1">
                                    {freelancer?.skills ? freelancer?.skills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 border border-color rounded-md bg-emerald-50 text-emerald-800 inline-block"
                                        >
                                            {skill}
                                        </div>
                                    )) :
                                        <p>
                                            No skills</p>}
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-2/3">
                            <div className="grid grid-cols-2 gap-4 mb-6 ">
                                <div className=" p-4 rounded-md text-center shadow-sm bg-color-light border border-color">
                                    <h3 className="text-green-800 font-medium">
                                        Completed Projects
                                    </h3>
                                    <p className="text-2xl font-bold mt-1">
                                        {projectStats.completed}
                                    </p>
                                </div>
                                <div className=" p-4 rounded-md text-center shadow-sm bg-color-light border border-color">
                                    <h3 className="text-green-800 font-medium">
                                        Pending Projects
                                    </h3>
                                    <p className="text-2xl font-bold mt-1">
                                        {projectStats.pending}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-4">Recent Projects</h3>

                                <RecentProject />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
