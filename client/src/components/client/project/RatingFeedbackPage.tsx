import { useState } from 'react';
import { Star, Heart, Shield, Clock, Award, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface RatingFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    ratings: { quality: number; deadlines: number; professionalism: number };
    feedback: string;
    overallRating: number;
  }) => void;
}

interface Ratings {
  quality: number;
  deadlines: number;
  professionalism: number;
}

const RatingFeedbackModal = ({ isOpen, onClose, onSubmit }: RatingFeedbackModalProps) => {
  const [ratings, setRatings] = useState<Ratings>({
    quality: 0,
    deadlines: 0,
    professionalism: 0
  });

  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const ratingCategories = [
    { key: 'quality', label: 'Quality of Work', icon: Award },
    { key: 'deadlines', label: 'Meeting Deadlines', icon: Clock },
    { key: 'professionalism', label: 'Professionalism', icon: Shield }
  ];

  const handleRating = (category: keyof Ratings, rating: number) => {
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
      await onSubmit({ ratings, feedback, overallRating: Number(overallRating) });
      setSubmissionSuccess(true);
    } catch {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRatings({ quality: 0, deadlines: 0, professionalism: 0 });
    setFeedback('');
    setSubmissionSuccess(false);
  };

  const overallRating = Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / 3;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-opacity-50">      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-gray-500" />
      </button>

      {submissionSuccess ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-green-600" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your feedback has been submitted successfully.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReset}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Submit Another Review
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white mb-2">Rate Your Experience</h1>
            <p className="text-indigo-100">Help other clients by sharing your feedback</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Overall Rating Display */}
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${star <= Math.round(overallRating)
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
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-gray-900">{label}</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(key as keyof Ratings, star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${star <= ratings[key as keyof Ratings]
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
              <h3 className="text-lg font-semibold text-gray-900">Written Feedback </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• What did the freelancer do well?</p>
                <p>• Any areas for improvement?</p>
                <p>• Would you hire them again?</p>
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your detailed experience..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={5}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={Object.values(ratings).some(rating => rating === 0)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Rating & Feedback'}
            </button>

            {Object.values(ratings).some(rating => rating === 0) && (
              <p className="text-center text-sm text-gray-500">
                Please rate all categories before submitting
              </p>
            )}
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default RatingFeedbackModal;