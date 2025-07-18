import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import cover from "../../../assets/cover.png";
import avatar from "../../../assets/p1.jpg";
import { User, MapPin, Calendar, Mail, Building, Briefcase, Globe, Shield, Clock, User2 } from 'lucide-react';
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../app/store";
import { clientDetails, userVerification } from "../../../features/admin/users/usersSlice";
import type { ComponentType, SVGProps } from 'react';
import { toast } from "react-toastify";


interface ClientDetailsII {
  id?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  role?: string | undefined;
  status?: string | undefined,
  isVerification?: string | undefined,
  createdAt?: string | undefined,
  profile?: string | undefined;
  cover?: string | undefined;
  companyName?: string | undefined;
  location?: string | undefined;
  website?: string | undefined;
  description?: string | undefined;
  updatedAt?: string | undefined,
}

interface InfoItemProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>; // For SVG icons
  label: string;
  value: string;
  color?: string;
}

function ClentVerifyProfile() {
  const dispatch = useDispatch<AppDispatch>()
  const { userId } = useParams();
  const [clientProfile, setClientProfile] = useState<ClientDetailsII>({
    id: "N/A",
    name: "N/A",
    email: "N/A",
    role: "N/A",
    status: "N/A",
    isVerification: "false",
    createdAt: "N/A",
    profile: undefined,
    cover: undefined,
    companyName: "N/A",
    location: "N/A",
    website: "N/A",
    description: "N/A",
    updatedAt: "N/A",
  })

  useEffect(() => {
    dispatch(clientDetails({ userId })).unwrap().then((data) => {
      setClientProfile(data)
      console.log(data);

    }).catch((error) => {
      console.log(error);
    })
  }, [dispatch, userId]);

  const VerifyAcoount = (userId: string | undefined, status: string) => {
    dispatch(userVerification({ userId, status })).unwrap().then((data) => {
      toast.success(data.message)
      setClientProfile((prev) => ({
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
              src={clientProfile.cover ? clientProfile?.cover : cover}
              alt="Profile Banner"
              className="w-full object-cover"
            />
          </div>
        </div>

        <div className="min-h-screen bg-[#f5fff9] from-blue-50 to-indigo-100 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-[#27AE60]">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="h-30 w-30 border border-[#27AE60] rounded-full bg-white p-1 shadow-md">
                  <img
                    src={clientProfile.profile ? clientProfile?.profile : avatar}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{clientProfile.name ? clientProfile.name : "N/A"}</h1>
                  <p className="text-lg text-blue-600 font-semibold mb-1">{clientProfile.companyName ? clientProfile.companyName : "N/A"}</p>
                  <p className="text-gray-600 mb-4">{clientProfile.role ? clientProfile.role : "client"} • {""}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {clientProfile.status ? clientProfile.status : "N/A"}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Last updated: {clientProfile.updatedAt ? new Date(clientProfile.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#27AE60]" >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <InfoItem
                    icon={Mail}
                    label="Email Address"
                    value={clientProfile.email ? clientProfile.email : "N/A"}
                    color="text-red-500"
                  />
                  <InfoItem
                    icon={User2}
                    label="User Id"
                    value={clientProfile.id ? clientProfile.id : "N/A"}
                    color="text-green-500"
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Location"
                    value={clientProfile.location ? clientProfile.location : "N/A"}
                    color="text-purple-500"
                  />
                  <InfoItem
                    icon={Globe}
                    label="Website"
                    value={clientProfile.website ? clientProfile.website : "N/A"}
                    color="text-blue-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#27AE60]">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-indigo-500" />
                  Professional Details
                </h2>
                <div className="space-y-4">
                  <InfoItem
                    icon={Building}
                    label="Company"
                    value={clientProfile.companyName ? clientProfile.companyName : "N/A"}
                    color="text-indigo-500"
                  />
                  <InfoItem
                    icon={Shield}
                    label="Role"
                    value={clientProfile.role ? clientProfile.role : "client"}
                    color="text-orange-500"
                  />
                  <InfoItem
                    icon={Calendar}
                    label="Join Date"
                    value={clientProfile.createdAt ? new Date(clientProfile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'N/A'}
                    color="text-teal-500"
                  />
                  <InfoItem
                    icon={Clock}
                    label="Status"
                    value={clientProfile.status ? clientProfile.status : "N/A"}
                    color="text-green-500"
                  />
                </div>
              </div>
            </div>

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
          {clientProfile.isVerification !== "false" &&
            <div className="py-4 px-4 flex justify-end">
              <button
                onClick={() => VerifyAcoount(clientProfile.id, "rejected")}
                className={`px-6 py-2 mx-4 flex  bg-[#ae2727] text-white font-medium rounded-lg hover:bg-[#992222] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-opacity-50 
                                ${clientProfile.isVerification === "rejected" ? "opacity-50 cursor-not-allowed" : ""}`}>
                Cancel Verification
              </button>
              <button
                onClick={() => VerifyAcoount(clientProfile.id, "verified")}
                className={`px-6 py-2  flex  bg-[#27AE60] text-white font-medium rounded-lg hover:bg-[#229954] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-opacity-50
                                 ${clientProfile.isVerification === "verified" ? "opacity-50 cursor-not-allowed" : ""}`}>
                Verify Account
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ClentVerifyProfile
const InfoItem = ({ icon: Icon, label, value, color = "text-gray-600" }: InfoItemProps) => (
  <div className="flex items-center p-3 bg-[#EFFFF6] rounded-lg hover:bg-[#e0f6e9] transition-colors">
    <div className={`p-2 rounded-full bg-white shadow-sm ${color}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="ml-3 flex-1">
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  </div>
);