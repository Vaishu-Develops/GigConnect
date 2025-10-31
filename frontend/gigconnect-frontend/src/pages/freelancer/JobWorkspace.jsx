import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gigService } from '../../services/gigService';
import { chatService } from '../../services/chatService';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/Loader';

const JobWorkspace = () => {
  const { gigId } = useParams();
  const [gig, setGig] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobData();
  }, [gigId]);

  const fetchJobData = async () => {
    try {
      const gigData = await gigService.getGigById(gigId);
      setGig(gigData);
      // Mock deliverables data
      setDeliverables([
        { id: 1, name: 'Initial Design Mockups', status: 'completed', dueDate: '2024-01-15' },
        { id: 2, name: 'Final Design Files', status: 'in-progress', dueDate: '2024-01-25' },
        { id: 3, name: 'Documentation', status: 'pending', dueDate: '2024-01-30' }
      ]);
    } catch (error) {
      console.error('Failed to fetch job data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      const deliverable = {
        id: deliverables.length + 1,
        name: newDeliverable,
        status: 'pending',
        dueDate: new Date().toISOString().split('T')[0]
      };
      setDeliverables(prev => [...prev, deliverable]);
      setNewDeliverable('');
    }
  };

  const updateDeliverableStatus = (id, status) => {
    setDeliverables(prev => 
      prev.map(d => d.id === id ? { ...d, status } : d)
    );
  };

  const submitWork = async () => {
    try {
      // Send completion message to client
      await chatService.sendMessage({
        chatId: `${gig.client._id}_${gigId}`,
        content: 'I have completed the work and submitted all deliverables for review.',
        messageType: 'text'
      });
      
      alert('Work submitted successfully! The client has been notified.');
    } catch (error) {
      console.error('Failed to submit work:', error);
      alert('Failed to submit work. Please try again.');
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
            Job not found
          </h3>
          <p className="text-gray-600">
            The job you're looking for doesn't exist.
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
              to="/freelancer/active-jobs"
              className="text-emerald-600 hover:text-emerald-700 font-medium mb-4 inline-block"
            >
              ← Back to Active Jobs
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="accent">In Progress</Badge>
              <span className="text-gray-600">Client: {gig.client?.name}</span>
              <span className="text-gray-600">Budget: ₹{gig.budget}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              as={Link}
              to={`/messages/new?userId=${gig.client?._id}&gigId=${gigId}`}
            >
              Message Client
            </Button>
            <Button
              onClick={submitWork}
              variant="secondary"
            >
              Submit Work
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Brief */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Brief</h3>
              <p className="text-gray-700 leading-relaxed">{gig.description}</p>
              
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Skills Required</h4>
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
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Deliverables</h3>
                <Badge variant="primary">{deliverables.length} items</Badge>
              </div>

              {/* Add Deliverable */}
              <div className="flex space-x-2 mb-6">
                <Input
                  placeholder="Add a new deliverable..."
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addDeliverable}>
                  Add
                </Button>
              </div>

              {/* Deliverables List */}
              <div className="space-y-4">
                {deliverables.map((deliverable) => (
                  <div key={deliverable.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{deliverable.name}</h4>
                      <p className="text-sm text-gray-600">Due: {new Date(deliverable.dueDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <select
                        value={deliverable.status}
                        onChange={(e) => updateDeliverableStatus(deliverable.id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                      <Badge variant={
                        deliverable.status === 'completed' ? 'success' :
                        deliverable.status === 'in-progress' ? 'accent' : 'gray'
                      }>
                        {deliverable.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={gig.client?.avatar || '/robot.png'}
                  alt={gig.client?.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{gig.client?.name}</h4>
                  <p className="text-gray-600 text-sm">⭐ {gig.client?.avgRating || 'No ratings'}</p>
                  <p className="text-gray-600 text-sm">📍 {gig.client?.location}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  as={Link}
                  to={`/user/${gig.client?._id}`}
                  variant="outline"
                  className="w-full"
                >
                  View Client Profile
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
                    <p className="text-sm text-gray-600">5 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mid-project Review</p>
                    <p className="text-sm text-gray-600">Due tomorrow</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Final Delivery</p>
                    <p className="text-sm text-gray-600">Due in 5 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Upload Files
                </Button>
                <Button variant="outline" className="w-full">
                  Request Extension
                </Button>
                <Button variant="outline" className="w-full">
                  Ask Question
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobWorkspace;