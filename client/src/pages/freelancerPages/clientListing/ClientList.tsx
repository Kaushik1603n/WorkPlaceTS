import { useEffect, useState } from "react";
import avt from "../../../assets/avt.jpg";
import axiosClient from "../../../utils/axiosClient";
import Pagination from "../../../components/Pagination";
import { User, X, MapPin, Mail, Star, MessageSquare, Award, MessageCircle, Eye, Briefcase } from "lucide-react";

export interface ClientRatingStats {
    avgClarity: number;
    avgPayment: number;
    avgCommunication: number;
}

interface ClientResult {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    profilePic?: string;
    description?: string;
    location?: string;
    hourlyRate?: number;
    avgRating?: number;
    feedbackCount: number;
    clientRatings?: ClientRatingStats;
}

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: ClientResult | null;
}

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(
                <Star
                    key={i}
                    size={size}
                    className="fill-yellow-400 text-yellow-400"
                />
            );
        } else if (i === fullStars && hasHalfStar) {
            stars.push(
                <div key={i} className="relative">
                    <Star size={size} className="text-gray-300" />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                        <Star size={size} className="fill-yellow-400 text-yellow-400" />
                    </div>
                </div>
            );
        } else {
            stars.push(
                <Star
                    key={i}
                    size={size}
                    className="text-gray-300"
                />
            );
        }
    }

    return <div className="flex items-center gap-0.5">{stars}</div>;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile }) => {
    if (!isOpen || !profile) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Modal Header */}
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors bg-white bg-opacity-20 rounded-full p-2"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-bold">Client Profile</h2>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Profile Info */}
                        <div className="lg:w-1/3">
                            <div className="text-center mb-6">
                                <div className="relative inline-block mb-4">
                                    <img
                                        src={profile.profilePic || avt}
                                        alt={profile.fullName}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = avt;
                                        }}
                                    />
                                    {profile.avgRating && profile.avgRating >= 4.5 && (
                                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                                            <Award size={16} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {profile.fullName}
                                </h3>
                                <p className="text-lg text-green-600 font-medium mb-4 bg-blue-50 px-3 py-1 rounded-full inline-block">
                                    {profile.role}
                                </p>
                            </div>

                            {/* Rating Summary */}
                            {profile.avgRating && (
                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <div className="text-center mb-4">
                                        <div className="text-3xl font-bold text-gray-800 mb-1">
                                            {profile.avgRating.toFixed(1)}
                                        </div>
                                        <div className="flex justify-center w-full">
                                            <StarRating rating={profile.avgRating} size={20} />
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {profile.feedbackCount} review{profile.feedbackCount !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Mail size={18} className="text-green-500" />
                                    <span className="text-sm break-all">{profile.email}</span>
                                </div>
                                {profile.location && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <MapPin size={18} className="text-green-500" />
                                        <span className="text-sm">{profile.location}</span>
                                    </div>
                                )}
                                {profile.hourlyRate && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Briefcase size={18} className="text-green-500" />
                                        <span className="text-sm font-medium">
                                            Budget: ${profile.hourlyRate}/hour
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Details */}
                        <div className="lg:w-2/3">
                            {/* Description Section */}
                            {profile.description && (
                                <div className="mb-8">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <User size={20} className="text-green-500" />
                                        About Client
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                        {profile.description}
                                    </p>
                                </div>
                            )}

                            {/* Detailed Ratings */}
                            {profile.clientRatings && (
                                <div className="mb-6">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Star size={20} className="text-green-500" />
                                        Client Rating Breakdown
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-green-50 p-4 rounded-lg text-center">
                                            <Eye size={24} className="text-green-500 mx-auto mb-2" />
                                            <div className="text-2xl font-bold text-green-600">
                                                {profile.clientRatings.avgClarity.toFixed(1)}
                                            </div>
                                            <div className="text-sm text-gray-600">Project Clarity</div>
                                        </div>
                                        <div className="bg-emerald-50 p-4 rounded-lg text-center">
                                            <Award size={24} className="text-emerald-500 mx-auto mb-2" />
                                            <div className="text-2xl font-bold text-emerald-600">
                                                {profile.clientRatings.avgPayment.toFixed(1)}
                                            </div>
                                            <div className="text-sm text-gray-600">Payment</div>
                                        </div>
                                        <div className="bg-cyan-50 p-4 rounded-lg text-center">
                                            <MessageCircle size={24} className="text-cyan-500 mx-auto mb-2" />
                                            <div className="text-2xl font-bold text-cyan-600">
                                                {profile.clientRatings.avgCommunication.toFixed(1)}
                                            </div>
                                            <div className="text-sm text-gray-600">Communication</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-between items-center rounded-b-xl">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                            <MessageSquare size={16} />
                            {profile.feedbackCount} reviews
                        </span>
                        {profile.avgRating && (
                            <span className="flex items-center gap-1">
                                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                {profile.avgRating.toFixed(1)} rating
                            </span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

function ClientList() {
    const [client, setClient] = useState<ClientResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<ClientResult | null>(null);

    const fetchClient = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axiosClient.get('/freelancer/client', {
                params: {
                    page: currentPage,
                    limit: 8,
                }
            });
            setClient(res.data.clients || []);
            setTotalPages(res.data?.pagination.totalPages || 1);

        } catch (error) {
            console.error('Error fetching client:', error);
            setError('Failed to load client. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClient();
    }, [currentPage]);

    const handleProfileView = (clientId: string) => {
        const profile = client.find(c => c._id === clientId);
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
                            onClick={fetchClient}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (client.length === 0) {
        return (
            <div className="py-5 px-4 md:px-8 lg:px-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                        Available Clients
                    </h2>
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-600 mb-2">No clients available</h3>
                        <p className="text-gray-500">Check back later for new client profiles.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-screen m-3 rounded-lg border border-[#2bd773] p-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Available Clients
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Connect with potential clients for your services
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {client.map((profile) => (
                        <div
                            key={profile._id}
                            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:border-blue-300 relative overflow-hidden"
                        >
                            {/* Top Badge for High Rated Clients */}
                            {/* {profile.avgRating && profile.avgRating >= 4.5 && (
                                <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <Award size={12} />
                                    <span>Verified</span>
                                </div>
                            )} */}

                            {/* Profile Image */}
                            <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all relative">
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
                            <div className="text-center mb-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                                    {profile.fullName}
                                </h3>
                                {/* {profile.role && (
                                    <p className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full inline-block">
                                        {profile.role}
                                    </p>
                                )} */}
                            </div>

                            {/* Rating */}
                            {profile.avgRating ? (
                                <div className="flex items-center justify-center mb-1 bg-gray-50 py-2 rounded-lg">
                                    <StarRating rating={profile.avgRating} />
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        {profile.avgRating.toFixed(1)}
                                    </span>
                                    <span className="ml-1 text-xs text-gray-500">
                                        ({profile.feedbackCount})
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center mb-1 bg-gray-50 py-2 rounded-lg">
                                    <span className="text-sm text-gray-500">New Client</span>
                                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        Opportunity
                                    </span>
                                </div>
                            )}

                            {/* Description */}
                            <div className="flex-grow mb-1">
                                <p className="text-sm text-gray-600 text-center leading-relaxed line-clamp-3">
                                    {profile.description || "Professional client looking for quality freelance services."}
                                </p>
                            </div>

                            {/* Location */}
                            {profile.location && (
                                <div className="flex items-center justify-center mb-1 text-sm text-gray-500">
                                    <MapPin size={14} className="mr-1" />
                                    <span className="truncate">{profile.location}</span>
                                </div>
                            )}

                            {/* Stats Row */}
                            <div className="flex justify-center gap-4 mb-1 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <MessageSquare size={12} />
                                    <span>{profile.feedbackCount} reviews</span>
                                </div>
                                {profile.avgRating && (
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                        <span>{profile.avgRating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Bar */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                <button
                                    onClick={() => handleProfileView(profile._id)}
                                    className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium
                                         hover:from-green-600 hover:to-green-700 transition-all duration-200 
                                        flex  justify-center  items-center space-x-2 shadow-sm hover:shadow`}
                                >
                                    <User size={14} />
                                    <span>View Profile</span>
                                </button>


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

export default ClientList;