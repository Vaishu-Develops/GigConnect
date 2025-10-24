import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../../services/userService';
import { reviewService } from '../../services/reviewService';
import ProfileHeader from '../../components/user/ProfileHeader';
import PortfolioGrid from '../../components/user/PortfolioGrid';
import ReviewCard from '../../components/user/ReviewCard';
import { LoadingSpinner } from '../../components/ui/Loader';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const [userData, reviewsData] = await Promise.all([
        userService.getUserById(userId),
        reviewService.getUserReviews(userId)
      ]);
      
      setUser(userData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            User not found
          </h3>
          <p className="text-gray-600">
            The user profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader user={user} isOwnProfile={false} />

        {/* Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {user.role === 'freelancer' && (
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'portfolio'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Portfolio
                </button>
              )}
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'about'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                About
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'portfolio' && user.role === 'freelancer' && (
              <PortfolioGrid 
                items={user.portfolio || []}
                isOwnProfile={false}
              />
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⭐</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600">
                      {user.role === 'freelancer' 
                        ? 'This freelancer hasn\'t received any reviews yet.'
                        : 'This client hasn\'t received any reviews yet.'
                      }
                    </p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  About {user.name}
                </h3>
                
                {user.bio ? (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {user.bio}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600 italic">
                    {user.name} hasn't added a bio yet.
                  </p>
                )}

                {/* Additional Info */}
                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Email: {user.email}</div>
                      {user.location && <div>Location: {user.location}</div>}
                      <div>Member since: {new Date(user.createdAt).getFullYear()}</div>
                    </div>
                  </div>

                  {user.role === 'freelancer' && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Professional Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        {user.hourlyRate && (
                          <div>Hourly Rate: ₹{user.hourlyRate}/hr</div>
                        )}
                        <div>Completed Projects: {user.completedProjects || 0}</div>
                        <div>Response Rate: {user.responseRate || 0}%</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;