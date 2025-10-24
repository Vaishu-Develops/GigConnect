import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gigService } from '../../services/gigService';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/Loader';

const ProjectDetails = () => {
  const { gigId } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [gigId]);

  const fetchProject = async () => {
    try {
      const gigData = await gigService.getGigById(gigId);
      setGig(gigData);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeProject = async () => {
    try {
      await gigService.updateGig(gigId, { status: 'completed' });
      fetchProject(); // Refresh data
    } catch (error) {
      console.error('Failed to complete project:', error);
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
            The project you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/client/active-projects"
              className="text-emerald-600 hover:text-emerald-700 font-medium mb-4 inline-block"
            >
              ← Back to Active Projects
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="accent">In Progress</Badge>
              <span className="text-gray-600">Budget: ₹{gig.budget}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              as={Link}
              to={`/messages/new?userId=${gig.freelancer?._id}&gigId=${gigId}`}
            >
              Message Freelancer
            </Button>
            <Button
              onClick={completeProject}
              variant="secondary"
            >
              Mark Complete
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h3>
              <p className="text-gray-700 leading-relaxed">{gig.description}</p>
              
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Skills Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {gig.skillsRequired.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Project Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{gig.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{gig.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{gig.duration || 'Flexible'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Deliverables</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Final Design Files</h4>
                    <p className="text-sm text-gray-600">All source files and assets</p>
                  </div>
                  <Badge variant="success">Completed</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Documentation</h4>
                    <p className="text-sm text-gray-600">User guide and technical docs</p>
                  </div>
                  <Badge variant="accent">In Progress</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Freelancer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Freelancer</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={gig.freelancer?.avatar || '/default-avatar.png'}
                  alt={gig.freelancer?.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{gig.freelancer?.name}</h4>
                  <p className="text-gray-600 text-sm">⭐ {gig.freelancer?.avgRating || 'No ratings'}</p>
                  <p className="text-gray-600 text-sm">📍 {gig.freelancer?.location}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  as={Link}
                  to={`/user/${gig.freelancer?._id}`}
                  variant="outline"
                  className="w-full"
                >
                  View Full Profile
                </Button>
              </div>
            </div>

            {/* Project Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Project Started</p>
                    <p className="text-sm text-gray-600">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mid-project Review</p>
                    <p className="text-sm text-gray-600">Due in 3 days</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Final Delivery</p>
                    <p className="text-sm text-gray-600">Due in 7 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;