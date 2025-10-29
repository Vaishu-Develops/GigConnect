import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { reviewService } from '../../services/reviewService';
import ProfileHeader from '../../components/user/ProfileHeader';
import PortfolioGrid from '../../components/user/PortfolioGrid';
import ReviewCard from '../../components/user/ReviewCard';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/Loader';

const Profile = () => {
  const { user: currentUser, updateProfile } = useAuth();
  const [user, setUser] = useState(null);
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
      } catch (userError) {
        console.error('Failed to fetch user data:', userError);
        userData = currentUser; // Fallback to current user data
      }

      // Fetch reviews data safely
      let reviewsData = [];
      try {
        reviewsData = await reviewService.getUserReviews(currentUser._id);
        console.log('Reviews data received:', reviewsData);
      } catch (reviewError) {
        console.error('Failed to fetch reviews:', reviewError);
        reviewsData = []; // Default to empty array
      }
      
      setUser(userData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUser(currentUser); // Fallback to current user
      setReviews([]); // Ensure reviews is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleAddPortfolio = async (portfolioItem) => {
    try {
      // Simulate API call
      const updatedUser = await userService.addPortfolioItem(portfolioItem);
      setUser(updatedUser);
      setShowAddPortfolio(false);
    } catch (error) {
      console.error('Failed to add portfolio item:', error);
    }
  };

  const handleDeletePortfolio = async (itemId) => {
    try {
      const updatedUser = await userService.deletePortfolioItem(itemId);
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to delete portfolio item:', error);
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
        <ProfileHeader user={user} isOwnProfile={true} />

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
                  items={user.portfolio || []}
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
        onSubmit={handleAddPortfolio}
      />
    </div>
  );
};

// Portfolio Modal Component
const AddPortfolioModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    projectUrl: '',
    imageUrl: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      category: '',
      projectUrl: '',
      imageUrl: ''
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Portfolio Item" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Writing">Writing</option>
            <option value="Marketing">Marketing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project URL (Optional)
          </label>
          <input
            type="url"
            name="projectUrl"
            value={formData.projectUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="https://"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (Optional)
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="https://"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1">
            Add to Portfolio
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Profile;