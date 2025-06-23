import { useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../../utils/axiosClient';
import axios from 'axios';

interface FormData {
    title: string;
    description: string;
    clientId: string;
    clientEmail: string;
}

interface ReportProblemModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    clientEmail: string;
    jobId: string;
}

const ReportProblemModal = ({
    isOpen,
    onClose,
    clientId,
    clientEmail,
    jobId,
}: ReportProblemModalProps) => {
    const [formData, setFormData] = useState<Omit<FormData, 'clientId' | 'clientEmail'>>({
        title: '',
        description: ''
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        const submissionData = {
            ...formData,
            clientId,
            clientEmail,
            jobId
        };
        try {
            const res = await axiosClient.post("/jobs/freelancer/report", submissionData);

            if (res.data.success) {
                toast.success("Report submitted successfully!");
            } else {
                toast.error(res.data.error || "Failed to submit report");
            }
        } catch (error) {
            console.error("Report submission error:", error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Network error occurred");
            } else {
                toast.error("An unexpected error occurred");
            }
        };
        setFormData({ title: '', description: '' });
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Report Problem</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">

                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Problem Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter problem title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"

                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe the problem in detail"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"

                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                        >
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportProblemModal;