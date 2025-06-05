import React from "react";
import cover from "../../../assets/cover.png";
import avatar from "../../../assets/p1.jpg";

interface ProfileHeaderProps {
    coverPic?: string;
    profilePic?: string;
    skills?: string[];
    fullName: string;
    role: string;
    location?: string;
    createdAt?: string;
    email?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    coverPic,
    profilePic,
    skills,
    fullName,
    role,
    location,
    createdAt,
    email,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 border-b border-[#27AE60]">

            <div className="relative p-4">
                <div className="w-full aspect-[5.5/1] overflow-hidden">
                    <img
                        src={coverPic || cover}
                        alt="Profile Banner"
                        className="w-full object-cover rounded-lg"
                    />
                </div>

                <div className="absolute left-4 bottom-0 transform translate-y-1/2">
                    <div className="h-30 w-30 rounded-full bg-white p-1 shadow-md">
                        <img
                            src={profilePic || avatar}
                            alt="Profile"
                            className="h-full w-full rounded-full object-cover"
                        />
                    </div>
                </div>

            </div>
            <div className="pt-16 pb-4 px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3">
                        <h2 className="text-xl font-semibold text-gray-800">{fullName}</h2>
                        <p className="text-gray-600 mt-1">{role}</p>

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
                                <span>{location || "Location"}</span>
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
                                    {createdAt
                                        ? new Date(createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })
                                        : ""}
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
                                <span>{email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-2/3">
                        <div className="mt-6 border border-color rounded-md p-4 w-full">
                            <h3 className="text-lg font-semibold mb-3">Skills</h3>
                            <div className="flex flex-wrap gap-2 max-h-35 overflow-y-auto p-1">
                                {skills?.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-2 border border-color rounded-md bg-emerald-50 text-emerald-800 inline-block"
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;