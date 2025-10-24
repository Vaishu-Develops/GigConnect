import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gigService } from '../../services/gigService';
import { chatService } from '../../services/chatService';
import UserCard from '../../components/user/UserCard';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/Loader';

const GigApplicants = () => {
  const { gigId } = useParams();
  const [gig, setGig] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [gigId]);

  const fetchData = async () => {
    try {
      const [gigData, applicationsData] = await Promise.all([
        gigService.getGigById(gigId),
        gigService.getGigApplications(gigId)
      ]);
      
      setGig(gigData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHire = async (freelancerId) => {
    try {
      // Update gig status and assign freelancer
      await gigService.updateGig(gigId, {
        status: 'in-progress',
        freelancerId
      });
      
      // Create chat with freelancer
      await chatService.createChat(freelancerId, gigId);
      
      alert('Freelancer hired successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Failed to hire freelancer:', error);
      alert('Failed to hire freelancer');
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
            The gig you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/client/my-gigs"
            className="text-emerald-600 hover:text-emerald-700 font-medium mb-4 inline-block"
          >
            ← Back to My Gigs
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Applicants for: {gig.title}
          </h1>
          <p className="text-gray-600">
            {applications.length} freelancers have applied for this gig
          </p>
        </div>

        {/* Applicants List */}
        <div className="space-y-6">
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No applicants yet
              </h3>
              <p className="text-gray-600 mb-6">
                Your gig hasn't received any applications yet. Check back later or consider updating your gig details.
              </p>
              <Button as={Link} to={`/client/edit-gig/${gigId}`}>
                Edit Gig Details
              </Button>
            </div>
          ) : (
            applications.map((application) => (
              <div key={application._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Applicant Info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <img
                        src={application.freelancer.avatar || '/default-avatar.png'}
                        alt={application.freelancer.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {application.freelancer.name}
                          </h3>
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm font-medium">
                            ₹{application.bidAmount}/project
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>⭐ {application.freelancer.avgRating || 'No ratings'}</span>
                          <span>📍 {application.freelancer.location}</span>
                          <span>⏱️ {application.timeline}</span>
                        </div>

                        <p className="text-gray-700 mb-4">
                          {application.proposal}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {application.freelancer.skills?.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-3 lg:w-48">
                    <Button
                      onClick={() => handleHire(application.freelancer._id)}
                      className="w-full"
                    >
                      Hire Now
                    </Button>
                    
                    <Button
                      as={Link}
                      to={`/messages/new?userId=${application.freelancer._id}&gigId=${gigId}`}
                      variant="secondary"
                      className="w-full"
                    >
                      Message
                    </Button>
                    
                    <Button
                      as={Link}
                      to={`/user/${application.freelancer._id}`}
                      variant="outline"
                      className="w-full"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GigApplicants;