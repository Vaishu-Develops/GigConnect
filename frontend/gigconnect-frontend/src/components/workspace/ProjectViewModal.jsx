import React from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ProjectViewModal = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null;

  const getStatusColor = (status) => {
    const colors = {
      'planning': 'gray',
      'active': 'blue',
      'on-hold': 'yellow',
      'completed': 'green',
      'cancelled': 'red'
    };
    return colors[status] || 'gray';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'gray',
      'medium': 'blue',
      'high': 'yellow',
      'urgent': 'red'
    };
    return colors[priority] || 'gray';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {project.title}
              </h3>
              <Badge variant={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              <Badge variant={getPriorityColor(project.priority)}>
                {project.priority}
              </Badge>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Project Description */}
          {project.description && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700">{project.description}</p>
            </div>
          )}

          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created by:</span>
                  <span className="font-medium">{project.owner?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <Badge variant={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">{project.progress || 0}%</span>
                </div>
                {project.deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-medium">
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {project.completedDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">
                      {new Date(project.completedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Budget & Financials</h4>
              <div className="space-y-3">
                {project.budget && project.budget.amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">
                      {project.budget.currency} {project.budget.amount.toLocaleString()}
                    </span>
                  </div>
                )}
                {project.earnings && project.earnings.amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Earnings:</span>
                    <span className="font-medium text-green-600">
                      {project.earnings.currency} {project.earnings.amount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {project.progress !== undefined && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-900">Progress</h4>
                <span className="text-sm font-medium text-gray-600">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          {project.assignedTo && project.assignedTo.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Team Members</h4>
              <div className="space-y-3">
                {project.assignedTo.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.user?.avatar || '/robot.png'}
                        alt={member.user?.name || 'Unknown'}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <span className="font-medium text-gray-900">
                          {member.user?.name || 'Unknown'}
                        </span>
                        <div className="text-sm text-gray-600">
                          {member.user?.email || ''}
                        </div>
                      </div>
                    </div>
                    <Badge variant="gray">{member.role}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestones */}
          {project.milestones && project.milestones.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Milestones</h4>
              <div className="space-y-3">
                {project.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-4 h-4 rounded-full mt-1 ${
                      milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{milestone.title}</h5>
                      {milestone.description && (
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      )}
                      {milestone.dueDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {milestone.completed && (
                      <Badge variant="green">Completed</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => alert('Edit functionality coming soon!')}>
              Edit Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectViewModal;