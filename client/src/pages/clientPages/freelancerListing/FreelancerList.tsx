import { useEffect, useState } from "react";
import avt from "../../../assets/avt.jpg";
import axiosClient from "../../../utils/axiosClient";
import Pagination from "../../../components/Pagination";
import { User, X, MapPin, DollarSign, Mail } from "lucide-react";

interface FreelancerResult {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    profilePic?: string;
    bio?: string;
    location?: string;
    hourlyRate?: number;
}

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: FreelancerResult | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile }) => {
    if (!isOpen || !profile) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50  flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Profile Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0">
                            <img
                                src={profile.profilePic || avt}
                                alt={profile.fullName}
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = avt;
                                }}
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">
                                {profile.fullName}
                            </h3>
                            <p className="text-lg text-green-600 font-medium mb-4">
                                {profile.role}
                            </p>

                            <div className="space-y-3">
                                {/* Email */}
                                <div className="flex items-center gap-3">
                                    <Mail size={20} className="text-gray-500" />
                                    <span className="text-gray-700">{profile.email}</span>
                                </div>

                                {/* Location */}
                                {profile.location && (
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} className="text-gray-500" />
                                        <span className="text-gray-700">{profile.location}</span>
                                    </div>
                                )}

                                {/* Hourly Rate */}
                                {profile.hourlyRate && (
                                    <div className="flex items-center gap-3">
                                        <DollarSign size={20} className="text-gray-500" />
                                        <span className="text-gray-700">
                                            ${profile.hourlyRate}/hour
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    {profile.bio && (
                        <div className="mt-6">
                            <h4 className="text-xl font-semibold text-gray-800 mb-3">About</h4>
                            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    
                </div>
            </div>
        </div>
    );
};

function FreelancerList() {
    const [freelancers, setFreelancers] = useState<FreelancerResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<FreelancerResult | null>(null);

    const fetchFreelancers = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axiosClient.get('/client/freelancer', {
                params: {
                    page: currentPage,
                    limit: 8,
                }
            });
            setFreelancers(res.data.freelancer || []);
            setTotalPages(res.data?.pagination.totalPages || 1);

        } catch (error) {
            console.error('Error fetching freelancers:', error);
            setError('Failed to load freelancers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFreelancers();
    }, [currentPage]);

    const handleProfileView = (freelancerId: string) => {
        const profile = freelancers.find(f => f._id === freelancerId);
        if (profile) {
            setSelectedProfile(profile);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProfile(null);
    };

    if (loading) {
        return (
            <div className="py-5 px-4 md:px-8 lg:px-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-center items-center min-h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-5 px-4 md:px-8 lg:px-16">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-12">
                        <div className="text-red-500 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={fetchFreelancers}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (freelancers.length === 0) {
        return (
            <div className="py-5 px-4 md:px-8 lg:px-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                        Available Freelancers
                    </h2>
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-600 mb-2">No freelancers available</h3>
                        <p className="text-gray-500">Check back later for new freelancer profiles.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-screen  m-3 rounded-lg border border-[#2bd773]  p-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Available Freelancers
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Find the perfect freelancer for your project
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {freelancers.map((profile) => (
                        <div
                            key={profile._id}
                            className="bg-[#EFFFF6] border border-[#2bd773] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group"
                        >
                            {/* Profile Image */}
                            <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full ring-2 ring-green-100 group-hover:ring-green-200 transition-all">
                                <img
                                    src={profile.profilePic || avt}
                                    alt={`${profile.fullName}'s profile`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = avt;
                                    }}
                                />
                            </div>

                            {/* Name and Role */}
                            <div className="text-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                    {profile.fullName}
                                </h3>
                                {profile.role && (
                                    <p className="text-sm text-green-600 font-medium">
                                        {profile.role}
                                    </p>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="flex-grow ">
                                <p className="text-sm text-gray-600 text-center leading-relaxed">
                                    {profile.bio || "Professional freelancer ready to help with your projects."}
                                </p>
                            </div>

                            {/* Location */}
                            {profile.location && (
                                <div className="flex items-center justify-center mb-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {profile.location}
                                </div>
                            )}

                            {/* Action Bar */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto mb-2">
                                <button
                                    onClick={() => handleProfileView(profile._id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2"
                                >
                                    <User />
                                    <span>Profile View</span>
                                </button>

                                <div className="text-right">
                                    <div className="text-lg font-bold text-green-600">
                                        ${profile.hourlyRate || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        per hour
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {!loading && (
                    <div className="flex justify-center mt-8">
                        <Pagination
                            currentPage={currentPage || 1}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={isModalOpen}
                onClose={closeModal}
                profile={selectedProfile}
            />
        </div>
    );
}

export default FreelancerList;