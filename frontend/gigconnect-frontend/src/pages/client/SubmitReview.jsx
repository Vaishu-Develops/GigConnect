import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gigService } from '../../services/gigService';
import { reviewService } from '../../services/reviewService';
import Rating from '../../components/ui/Rating';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/Loader';

const SubmitReview = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    communication: 5,
    quality: 5,
    timeliness: 5,
    professionalism: 5
  });

  useEffect(() => {
    fetchGig();
  }, [gigId]);

  const fetchGig = async () => {
    try {
      const gigData = await gigService.getGigById(gigId);
      setGig(gigData);
    } catch (error) {
      console.error('Failed to fetch gig:', error);
      navigate('/client/completed-projects');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await reviewService.submitReview({
        gigId,
        freelancerId: gig.freelancer?._id,
        rating: formData.rating,
        comment: formData.comment,
        categoryRatings: {
          communication: formData.communication,
          quality: formData.quality,
          timeliness: formData.timeliness,
          professionalism: formData.professionalism
        }
      });

      navigate('/client/completed-projects');
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Project not found
          </h3>
          <p className="text-gray-600">
            The project you're trying to review doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Rate Your Experience
            </h1>
            <p className="text-gray-600">
              Share your feedback about working with {gig.freelancer?.name}
            </p>
          </div>

          {/* Project Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Project: {gig.title}</h3>
            <div className="flex items-center space-x-4">
              <img
                src={gig.freelancer?.avatar || '/robot.png'}
                alt={gig.freelancer?.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{gig.freelancer?.name}</p>
                <p className="text-sm text-gray-600">Freelancer</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div className="text-center">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Overall Rating
              </label>
              <Rating
                rating={formData.rating}
                onRatingChange={(value) => handleRatingChange('rating', value)}
                size="lg"
                showLabel
              />
            </div>

            {/* Category Ratings */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Category Ratings
              </label>
              
              {[
                { key: 'communication', label: 'Communication' },
                { key: 'quality', label: 'Quality of Work' },
                { key: 'timeliness', label: 'Timeliness' },
                { key: 'professionalism', label: 'Professionalism' }
              ].map((category) => (
                <div key={category.key} className="flex items-center justify-between">
                  <span className="text-gray-700">{category.label}</span>
                  <Rating
                    rating={formData[category.key]}
                    onRatingChange={(value) => handleRatingChange(category.key, value)}
                    size="md"
                  />
                </div>
              ))}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                placeholder="Share details about your experience working with this freelancer. What did you like? What could be improved?"
                required
                minLength={10}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.comment.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={submitting}
              className="w-full"
            >
              Submit Review
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitReview;