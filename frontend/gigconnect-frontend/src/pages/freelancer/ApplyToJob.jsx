import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gigService } from '../../services/gigService';
import { chatService } from '../../services/chatService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/Loader';

const ApplyToJob = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    proposal: '',
    bidAmount: '',
    timeline: '',
    portfolioItems: []
  });

  useEffect(() => {
    fetchGig();
  }, [gigId]);

  const fetchGig = async () => {
    try {
      const gigData = await gigService.getGigById(gigId);
      setGig(gigData);
      // Pre-fill bid amount with gig budget
      setFormData(prev => ({ ...prev, bidAmount: gigData.budget }));
    } catch (error) {
      console.error('Failed to fetch gig:', error);
      navigate('/freelancer/browse-jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create a chat/message with the proposal
      await chatService.sendMessage({
        chatId: `${gig.client._id}_${gigId}`, // This would be generated properly
        content: `Application for "${gig.title}":\n\nProposal: ${formData.proposal}\nBid: ₹${formData.bidAmount}\nTimeline: ${formData.timeline}`,
        messageType: 'application'
      });

      navigate('/freelancer/applications');
    } catch (error) {
      console.error('Failed to submit application:', error);
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
            Gig not found
          </h3>
          <p className="text-gray-600">
            The gig you're trying to apply for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/freelancer/job/${gigId}`}
            className="text-emerald-600 hover:text-emerald-700 font-medium mb-4 inline-block"
          >
            ← Back to Job Details
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apply to: {gig.title}
          </h1>
          <p className="text-gray-600">
            Submit your proposal to get hired for this project
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Proposal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Proposal *
                  </label>
                  <textarea
                    name="proposal"
                    value={formData.proposal}
                    onChange={handleChange}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Introduce yourself and explain why you're the right fit for this project. Include your relevant experience and how you plan to approach the work."
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.proposal.length}/1000 characters
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Bid Amount */}
                  <Input
                    label="Your Bid (₹) *"
                    type="number"
                    name="bidAmount"
                    value={formData.bidAmount}
                    onChange={handleChange}
                    min="1"
                    required
                  />

                  {/* Timeline */}
                  <Input
                    label="Estimated Timeline *"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    placeholder="e.g., 2 weeks, 1 month"
                    required
                  />
                </div>

                {/* Portfolio Items (would be dynamic) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Portfolio Items (Optional)
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                      <input type="checkbox" className="text-emerald-600 focus:ring-emerald-500" />
                      <span className="ml-3 text-sm text-gray-700">Website Redesign Project</span>
                    </div>
                    <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                      <input type="checkbox" className="text-emerald-600 focus:ring-emerald-500" />
                      <span className="ml-3 text-sm text-gray-700">Mobile App UI/UX</span>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label className="text-sm text-gray-700">
                    I agree to the terms of service and understand that this proposal 
                    will be sent to the client and may lead to a contract if accepted.
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={submitting}
                  className="w-full"
                >
                  Submit Application
                </Button>
              </form>
            </div>
          </div>

          {/* Gig Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Job Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">₹{gig.budget}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{gig.category}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{gig.location}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-medium">
                    {new Date(gig.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Application Tips</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Personalize your proposal for this specific project</li>
                <li>• Highlight relevant experience and skills</li>
                <li>• Be clear about your proposed approach</li>
                <li>• Set realistic timeline expectations</li>
                <li>• Proofread before submitting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyToJob; 