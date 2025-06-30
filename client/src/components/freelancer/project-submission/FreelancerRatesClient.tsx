import React, { useState } from 'react';
import { Star, FileText, DollarSign, MessageCircle, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface RatingData {
  ratings: {
    clarity: number;
    payment: number;
    communication: number;
  };
  feedback: string;
  overallRating: number;
}

interface FreelancerRatesClientProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RatingData) => Promise<{
    success: boolean;
    error?: string;
    data?: any;
  }>;
}

const FreelancerRatesClient: React.FC<FreelancerRatesClientProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [ratings, setRatings] = useState({
    clarity: 0,
    payment: 0,
    communication: 0,
  });
  
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const ratingCategories = [
    { key: 'clarity', label: 'Clarity of Requirements', icon: FileText },
    { key: 'payment', label: 'Payment Promptness', icon: DollarSign },
    { key: 'communication', label: 'Communication', icon: MessageCircle },
  ];

  const handleRating = (category: keyof typeof ratings, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleSubmit = async () => {
    if (Object.values(ratings).some(rating => rating === 0)) {
      toast.error('Please rate all categories before submitting');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const res = await onSubmit({ 
        ratings, 
        feedback, 
        overallRating: Number(overallRating) 
      });
      
      if (res.success) {
        setSubmitted(true);
      } else if (res.error) {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRatings({ clarity: 0, payment: 0, communication: 0 });
    setFeedback('');
    setSubmitted(false);
  };

  const overallRating = Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / 3;

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-opacity-50">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h2>
            <p className="text-gray-600 mb-6">Thank you for rating your client experience.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Rate Another Client
              </button>
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-opacity-50">
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-green-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white mb-2">Rate Your Client</h1>
          <p className="text-teal-100">Share your experience working with this client</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Overall Rating Display */}
          <div className="text-center">
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 ${
                    star <= Math.round(overallRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-lg font-semibold text-gray-700">
              Overall Rating: {overallRating.toFixed(1)}/5.0
            </p>
          </div>

          {/* Individual Ratings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Rate Each Category</h3>
            {ratingCategories.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="font-medium text-gray-900">{label}</span>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(key as keyof typeof ratings, star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= ratings[key as keyof typeof ratings]
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Written Feedback */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Written Feedback</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• How was the client to work with?</p>
              <p>• Any challenges faced?</p>
              <p>• Would you work with them again?</p>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience working with this client..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              rows={5}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={Object.values(ratings).some(rating => rating === 0) || isSubmitting}
            className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-teal-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : 'Submit Client Rating'}
          </button>

          {Object.values(ratings).some(rating => rating === 0) && (
            <p className="text-center text-sm text-gray-500">
              Please rate all categories before submitting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerRatesClient;