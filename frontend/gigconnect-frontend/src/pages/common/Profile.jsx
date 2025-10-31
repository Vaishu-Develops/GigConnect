import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { reviewService } from '../../services/reviewService';
import { portfolioService } from '../../services/portfolioService';
import ProfileHeader from '../../components/user/ProfileHeader';
import PortfolioGrid from '../../components/user/PortfolioGrid';
import ReviewCard from '../../components/user/ReviewCard';
import AddPortfolioModal from '../../components/user/AddPortfolioModal';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/Loader';

const Profile = () => {
  const { user: currentUser, updateProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [loading, setLoading] = useState(true);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      console.log('Fetching user data for ID:', currentUser._id);
      
      // Fetch user data safely
      let userData = null;
      try {
        userData = await userService.getUserById(currentUser._id);
        console.log('User data received:', userData);
        console.log('User avatar field:', userData?.avatar);
        console.log('User profilePicture field:', userData?.profilePicture);
      } catch (userError) {
        console.error('Failed to fetch user data:', userError);
        userData = currentUser; // Fallback to current user data
      }

      // Fetch portfolio data
      let portfolioData = [];
      try {
        const portfolioResponse = await portfolioService.getMyPortfolio();
        portfolioData = portfolioResponse.portfolioItems || portfolioResponse.portfolio || [];
        console.log('Portfolio data received:', portfolioData);
      } catch (portfolioError) {
        console.error('Failed to fetch portfolio:', portfolioError);
        portfolioData = userData?.portfolio || [];
      }

      // Fetch reviews data safely
      let reviewsData = [];
      try {
        const reviewsResponse = await reviewService.getUserReviews(currentUser._id);
        reviewsData = reviewsResponse.reviews || [];
        console.log('Reviews data received:', reviewsResponse);
      } catch (reviewError) {
        console.error('Failed to fetch reviews:', reviewError);
        reviewsData = []; // Default to empty array
      }
      
      setUser(userData);
      setPortfolio(portfolioData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUser(currentUser); // Fallback to current user
      setPortfolio([]); // Ensure portfolio is always an array
      setReviews([]); // Ensure reviews is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleAddPortfolio = (newPortfolioItem) => {
    setPortfolio(prev => [newPortfolioItem, ...prev]);
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleDeletePortfolio = async (itemId) => {
    try {
      await portfolioService.deletePortfolioItem(itemId);
      setPortfolio(prev => prev.filter(item => item._id !== itemId));
      alert('Portfolio item deleted successfully!');
    } catch (error) {
      console.error('Failed to delete portfolio item:', error);
      alert('Failed to delete portfolio item. Please try again.');
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader 
          user={user} 
          isOwnProfile={true} 
          onProfileUpdated={handleProfileUpdated}
        />

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
                onClick={() => setActiveTab('stats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Statistics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'portfolio' && user.role === 'freelancer' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">My Portfolio</h3>
                  <Button onClick={() => setShowAddPortfolio(true)}>
                    Add Portfolio Item
                  </Button>
                </div>
                <PortfolioGrid 
                  items={portfolio}
                  isOwnProfile={true}
                  onAddItem={() => setShowAddPortfolio(true)}
                  onDeleteItem={handleDeletePortfolio}
                />
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h3>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⭐</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600">
                      {user.role === 'freelancer' 
                        ? 'Complete projects to receive reviews from clients.'
                        : 'Hire freelancers and complete projects to leave reviews.'
                      }
                    </p>
                  </div>
                ) : (
                  (Array.isArray(reviews) ? reviews : []).map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {user.completedProjects || 0}
                  </div>
                  <div className="text-gray-600">Completed Projects</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {user.avgRating ? user.avgRating.toFixed(1) : '0.0'}
                  </div>
                  <div className="text-gray-600">Average Rating</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">
                    {user.responseRate || 0}%
                  </div>
                  <div className="text-gray-600">Response Rate</div>
                </div>

                {user.role === 'freelancer' && (
                  <>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {user.onTimeRate || 0}%
                      </div>
                      <div className="text-gray-600">On-time Delivery</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ₹{user.totalEarnings || 0}
                      </div>
                      <div className="text-gray-600">Total Earnings</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-cyan-600 mb-2">
                        {user.repeatClients || 0}
                      </div>
                      <div className="text-gray-600">Repeat Clients</div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Portfolio Modal */}
      <AddPortfolioModal 
        isOpen={showAddPortfolio}
        onClose={() => setShowAddPortfolio(false)}
        onPortfolioAdded={handleAddPortfolio}
      />
    </div>
  );
};

export default Profile;