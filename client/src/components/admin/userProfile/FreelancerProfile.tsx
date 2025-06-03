import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import cover from "../../../assets/cover.png";
import avatar from "../../../assets/p1.jpg";
import { User, MapPin, Calendar, Mail, Briefcase, Globe, Shield, Clock, User2, TimerIcon, Workflow, DollarSign, Code, UserCheck2Icon } from 'lucide-react';
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../app/store";
import { freelancerDetails, userVerification } from "../../../features/admin/users/usersSlice";
import type { ComponentType, SVGProps } from 'react';
import { toast } from "react-toastify";


interface ClientDetailsI {
    id?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    profile?: string | undefined;
    status?: string | undefined,
    role?: string | undefined,
    isVerification?: string | undefined,
    createdAt?: string | undefined,
    cover?: string | undefined;
    availability?: string | undefined;
    experienceLevel?: string | undefined;
    education?: string | undefined;
    hourlyRate?: string | undefined;
    skills?: string[] | [];
    location?: string | undefined,
    reference?: string | undefined,
    description?: string | undefined,
    updatedAt?: string | undefined,
}

interface InfoItemProps {
    icon: ComponentType<SVGProps<SVGSVGElement>>; // For SVG icons
    label: string;
    value: string | string[];
    color?: string;
}
function FreelancerVerifyProfile() {
    const dispatch = useDispatch<AppDispatch>()
    const { userId } = useParams();
    const [freelancerProfile, setFreelancerProfile] = useState<ClientDetailsI>({
        id: "N/A",
        name: "N/A",
        email: "N/A",
        role: "N/A",
        status: "N/A",
        isVerification: "false",
        createdAt: "N/A",
        profile: undefined,
        cover: undefined,
        availability: "N/A",
        experienceLevel: "N/A",
        education: "N/A",
        hourlyRate: "N/A",
        skills: [],
        location: "N/A",
        reference: "N/A",
        description: "N/A",
        updatedAt: "N/A",
    })


    useEffect(() => {
        dispatch(freelancerDetails({ userId })).unwrap().then((data) => {
            setFreelancerProfile(data)
        }).catch((error) => {
            console.error(error);
        })
    }, [dispatch, userId]);

    const VerifyAcoount = (userId: string | undefined, status: string) => {
        dispatch(userVerification({ userId, status })).unwrap().then((data) => {
            toast.success(data.message)
            setFreelancerProfile((prev) => ({
                ...prev,
                isVerification: data.status
            }))
        }).catch((error) => {
            console.error(error);
        })
    }
    return (
        <div className="container mx-auto px-4 pb-8 ">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 border border-[#27AE60]">
                <div className="relative">
                    <div className="w-full aspect-[5.5/1] overflow-hidden ">
                        <img
                            src={freelancerProfile.cover ? freelancerProfile?.cover : cover}
                            alt="Profile Banner"
                            className="w-full object-cover"
                        />
                    </div>
                </div>

                <div className="min-h-screen bg-[#f5fff9] from-blue-50 to-indigo-100 py-8 px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Header Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-[#27AE60]">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <div className="h-30 w-30 border border-[#27AE60] rounded-full bg-white p-1 shadow-md">
                                    <img
                                        src={freelancerProfile.profile ? freelancerProfile?.profile : avatar}
                                        alt="Profile"
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{freelancerProfile.name ? freelancerProfile.name : "N/A"}</h1>
                                    <p className="text-lg text-blue-600 font-semibold mb-1">{freelancerProfile.email ? freelancerProfile.email : "N/A"}</p>
                                    <p className="text-gray-600 mb-4">{freelancerProfile.role ? freelancerProfile.role : "client"} • {""}</p>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                            {freelancerProfile.status ? freelancerProfile.status : "N/A"}
                                        </span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            Last updated: {freelancerProfile.updatedAt ? new Date(freelancerProfile.updatedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Contact Information */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#27AE60]">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <User className="h-5 w-5 mr-2 text-blue-500" />
                                    Freelancer Information
                                </h2>
                                <div className="space-y-4">
                                    <InfoItem
                                        icon={Mail}
                                        label="Email Address"
                                        value={freelancerProfile.email ? freelancerProfile.email : "N/A"}
                                        color="text-red-500"
                                    />
                                    <InfoItem
                                        icon={User2}
                                        label="User Id"
                                        value={freelancerProfile.id ? freelancerProfile.id : "N/A"}
                                        color="text-green-500"
                                    />
                                    <InfoItem
                                        icon={MapPin}
                                        label="Location"
                                        value={freelancerProfile.location ? freelancerProfile.location : "N/A"}
                                        color="text-purple-500"
                                    />
                                    <InfoItem
                                        icon={Globe}
                                        label="Website"
                                        value={freelancerProfile.reference ? freelancerProfile.reference : "N/A"}
                                        color="text-blue-500"
                                    />
                                    <InfoItem
                                        icon={Shield}
                                        label="Role"
                                        value={freelancerProfile.role ? freelancerProfile.role : "freelancer"}
                                        color="text-orange-500"
                                    />
                                    <InfoItem
                                        icon={Calendar}
                                        label="Join Date"
                                        value={freelancerProfile.createdAt ? new Date(freelancerProfile.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        }) : 'N/A'}
                                        color="text-teal-500"
                                    />
                                    <InfoItem
                                        icon={Clock}
                                        label="Status"
                                        value={freelancerProfile.status ? freelancerProfile.status : "N/A"}
                                        color="text-green-500"
                                    />
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#27AE60]">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Briefcase className="h-5 w-5 mr-2 text-indigo-500" />
                                    Professional Details
                                </h2>
                                <div className="space-y-4">
                                    <InfoItem
                                        icon={TimerIcon}
                                        label="Availability"
                                        value={freelancerProfile.availability ? freelancerProfile.availability : "N/A"}
                                        color="text-indigo-500"
                                    />
                                    <InfoItem
                                        icon={Workflow}
                                        label="Experience"
                                        value={freelancerProfile.experienceLevel ? freelancerProfile.experienceLevel : "N/A"}
                                        color="text-orange-500"
                                    />

                                    <InfoItem
                                        icon={DollarSign}
                                        label="Hourly Rate"
                                        value={freelancerProfile.hourlyRate ? freelancerProfile.hourlyRate : "N/A"}
                                        color="text-green-500"
                                    />
                                    <InfoItem
                                        icon={Code}
                                        label="Skills"
                                        value={freelancerProfile.skills ? freelancerProfile.skills : "N/A"}
                                        color="text-green-500"
                                    />
                                    <InfoItem
                                        icon={UserCheck2Icon}
                                        label="Bio"
                                        value={freelancerProfile.description ? freelancerProfile.description : "N/A"}
                                        color="text-green-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Information Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                <h3 className="text-lg font-semibold mb-2">Projects</h3>
                                <p className="text-3xl font-bold">24</p>
                                <p className="text-blue-100 text-sm">Completed this year</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                                <h3 className="text-lg font-semibold mb-2">Experience</h3>
                                <p className="text-3xl font-bold">3.2</p>
                                <p className="text-green-100 text-sm">Years at company</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                                <h3 className="text-lg font-semibold mb-2">Rating</h3>
                                <p className="text-3xl font-bold">4.8</p>
                                <p className="text-purple-100 text-sm">Performance score</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-4 px-4 ">
                    {freelancerProfile.isVerification !== "false" &&
                        <div className="py-4 px-4 flex justify-end">
                            <button
                                onClick={() => VerifyAcoount(freelancerProfile.id, "rejected")}
                                className={`px-6 py-2 mx-4 flex  bg-[#ae2727] text-white font-medium rounded-lg hover:bg-[#992222] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-opacity-50 
                                ${freelancerProfile.isVerification === "rejected" ? "opacity-50 cursor-not-allowed" : ""}`}>
                                Cancel Verification
                            </button>
                            <button
                                onClick={() => VerifyAcoount(freelancerProfile.id, "verified")}
                                className={`px-6 py-2  flex  bg-[#27AE60] text-white font-medium rounded-lg hover:bg-[#229954] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-opacity-50
                                 ${freelancerProfile.isVerification === "verified" ? "opacity-50 cursor-not-allowed" : ""}`}>
                                Verify Account
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}



export default FreelancerVerifyProfile



const InfoItem = ({ icon: Icon, label, value, color = "text-gray-600" }: InfoItemProps) => (
    <div className="flex items-start p-3 bg-[#EFFFF6] rounded-lg hover:bg-[#e0f6e9] transition-colors">
        <div className={`p-2 rounded-full bg-white shadow-sm ${color}`}>
            <Icon className="h-4 w-4" />
        </div>
        <div className="ml-3 flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
            {Array.isArray(value) ? (
                <div className="flex flex-wrap gap-2 mt-1">
                    {value.map((skill, index) => (
                        <SkillBadge key={index} skill={skill} />
                    ))}
                </div>
            ) : (
                <p className="text-sm font-medium text-gray-900">{value || "N/A"}</p>
            )}
        </div>
    </div>
);

function SkillBadge({ skill }: { skill: string }) {
    return (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {skill}
        </span>
    );
}



