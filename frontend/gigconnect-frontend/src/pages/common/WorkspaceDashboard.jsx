import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { workspaceService } from '../../services/workspaceService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/Loader';
import InviteMemberModal from '../../components/workspace/InviteMemberModal';
import CreateProjectModal from '../../components/workspace/CreateProjectModal';
import MemberManageModal from '../../components/workspace/MemberManageModal';
import ProjectViewModal from '../../components/workspace/ProjectViewModal';
import WorkspaceSettingsModal from '../../components/workspace/WorkspaceSettingsModal';
import StartDiscussionModal from '../../components/workspace/StartDiscussionModal';
import DiscussionList from '../../components/workspace/DiscussionList';
import DiscussionChat from '../../components/workspace/DiscussionChat';
import AnalyticsDashboard from '../../components/workspace/AnalyticsDashboard';

const WorkspaceDashboard = () => {
  const { workspaceId } = useParams();
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState(null);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showMemberManageModal, setShowMemberManageModal] = useState(false);
  const [showProjectViewModal, setShowProjectViewModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStartDiscussionModal, setShowStartDiscussionModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchWorkspace();
  }, [workspaceId]);

  const fetchWorkspace = async () => {
    try {
      const [workspaceResponse, statsResponse, projectsResponse] = await Promise.all([
        workspaceService.getWorkspace(workspaceId),
        workspaceService.getWorkspaceStats(workspaceId),
        projectService.getWorkspaceProjects(workspaceId, { limit: 5 })
      ]);
      setWorkspace(workspaceResponse.data);
      setStats(statsResponse.data);
      setProjects(projectsResponse.data.projects || []);
    } catch (error) {
      console.error('Failed to fetch workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'success',
      member: 'primary',
      viewer: 'gray'
    };
    return colors[role] || 'gray';
  };

  const getUserRole = () => {
    if (!workspace || !user) return null;
    if (workspace.owner._id === user._id) return 'owner';
    const member = workspace.members.find(m => m.user._id === user._id);
    return member ? member.role : null;
  };

  const canInviteMembers = () => {
    const userRole = getUserRole();
    return userRole === 'owner' || (userRole === 'admin' && workspace.settings.allowMemberInvite);
  };

  const canCreateProjects = () => {
    const userRole = getUserRole();
    return userRole === 'owner' || userRole === 'admin';
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev.slice(0, 4)]);
    // Refresh stats to update project count
    fetchWorkspace();
  };

  const handleMemberManage = (member) => {
    setSelectedMember(member);
    setShowMemberManageModal(true);
  };

  const handleMemberUpdated = () => {
    fetchWorkspace(); // Refresh workspace data
    setShowMemberManageModal(false);
  };

  const handleProjectView = (project) => {
    setSelectedProject(project);
    setShowProjectViewModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Workspace not found
          </h3>
          <p className="text-gray-600 mb-6">
            The workspace you're looking for doesn't exist or you don't have access.
          </p>
          <Button as={Link} to="/workspaces">
            Back to Workspaces
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
                {workspace.avatar ? (
                  <img
                    src={workspace.avatar}
                    alt={workspace.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {workspace.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {workspace.name}
                  </h1>
                  <Badge variant={getRoleColor(getUserRole())}>
                    {getUserRole() === 'owner' ? 'Owner' : getUserRole()}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">
                  {workspace.description || 'No description provided'}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>
                    {stats?.memberCount || 0} member{(stats?.memberCount || 0) !== 1 ? 's' : ''}
                  </span>
                  <span>•</span>
                  <span>
                    Created {new Date(workspace.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>
                    Owner: {workspace.owner.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              {canInviteMembers() && (
                <Button onClick={() => setShowInviteModal(true)}>
                  Invite Members
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={() => setShowSettingsModal(true)}
              >
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'members', name: 'Members', icon: '👥' },
                { id: 'projects', name: 'Projects', icon: '💼' },
                { id: 'discussions', name: 'Discussions', icon: '💬' },
                { id: 'activity', name: 'Activity', icon: '⚡' },
                { id: 'analytics', name: 'Analytics', icon: '📈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-emerald-600">
                      {stats?.memberCount || 0}
                    </div>
                    <div className="text-emerald-700 text-sm">Team Members</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats?.totalProjects || 0}
                    </div>
                    <div className="text-blue-700 text-sm">Total Projects</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {stats?.completedProjects || 0}
                    </div>
                    <div className="text-purple-700 text-sm">Completed</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      ₹{stats?.totalEarnings?.toLocaleString() || 0}
                    </div>
                    <div className="text-orange-700 text-sm">Total Earnings</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => setShowCreateProjectModal(true)}
                      disabled={!canCreateProjects()}
                    >
                      <span className="mr-3">📁</span>
                      Create New Project
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => setActiveTab('discussions')}
                    >
                      <span className="mr-3">💬</span>
                      Start Discussion
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => setActiveTab('analytics')}
                    >
                      <span className="mr-3">📊</span>
                      View Analytics
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Team Members ({stats?.memberCount || 0})
                  </h3>
                  {canInviteMembers() && (
                    <Button size="sm" onClick={() => setShowInviteModal(true)}>
                      Invite Member
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {workspace.members.map((member) => (
                    <div
                      key={member.user._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={(member.user.avatar && member.user.avatar.trim()) || '/robot.png'}
                          alt={member.user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {member.user.name}
                            {workspace.owner._id === member.user._id && (
                              <span className="ml-2 text-sm text-emerald-600">(Owner)</span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600">{member.user.email}</p>
                          <p className="text-xs text-gray-500">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                        {getUserRole() === 'owner' && member.user._id !== user._id && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMemberManage(member)}
                          >
                            Manage
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Workspace Projects ({projects.length})
                  </h3>
                  {canCreateProjects() && (
                    <Button size="sm" onClick={() => setShowCreateProjectModal(true)}>
                      Create Project
                    </Button>
                  )}
                </div>

                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project._id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {project.title}
                              </h4>
                              <Badge 
                                variant={
                                  project.status === 'completed' ? 'success' :
                                  project.status === 'active' ? 'primary' :
                                  project.status === 'on-hold' ? 'yellow' :
                                  'gray'
                                }
                              >
                                {project.status}
                              </Badge>
                              <Badge 
                                variant={
                                  project.priority === 'urgent' ? 'red' :
                                  project.priority === 'high' ? 'yellow' :
                                  project.priority === 'medium' ? 'blue' :
                                  'gray'
                                }
                              >
                                {project.priority}
                              </Badge>
                            </div>
                            {project.description && (
                              <p className="text-gray-600 mb-3">{project.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Created by {project.owner?.name}</span>
                              {project.deadline && (
                                <>
                                  <span>•</span>
                                  <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                                </>
                              )}
                              {project.budget?.amount > 0 && (
                                <>
                                  <span>•</span>
                                  <span>Budget: {project.budget.currency} {project.budget.amount}</span>
                                </>
                              )}
                            </div>
                            {project.tags && project.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {project.tags.map((tag, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {project.progress !== undefined && (
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                  {project.progress}%
                                </div>
                                <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                                  <div 
                                    className="h-2 bg-emerald-500 rounded-full"
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleProjectView(project)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📁</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      No projects yet
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Start collaborating by creating your first project
                    </p>
                    {canCreateProjects() && (
                      <Button onClick={() => setShowCreateProjectModal(true)}>
                        Create First Project
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Recent Activity
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600">🏢</span>
                    </div>
                    <div>
                      <p className="text-gray-900">
                        <span className="font-semibold">{workspace.owner.name}</span> created this workspace
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(workspace.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {workspace.members.slice(1).map((member) => (
                    <div key={member.user._id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600">👋</span>
                      </div>
                      <div>
                        <p className="text-gray-900">
                          <span className="font-semibold">{member.user.name}</span> joined the workspace
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(member.joinedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discussions Tab */}
            {activeTab === 'discussions' && (
              <div>
                {selectedDiscussion ? (
                  <DiscussionChat 
                    discussionId={selectedDiscussion._id}
                    onBack={() => setSelectedDiscussion(null)}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Team Discussions
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Start conversations, share ideas, and collaborate with your team
                        </p>
                      </div>
                      <Button 
                        onClick={() => setShowStartDiscussionModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        + Start Discussion
                      </Button>
                    </div>

                    {/* Discussion List Component */}
                    <DiscussionList 
                      workspaceId={workspace._id}
                      onDiscussionSelect={(discussion) => {
                        setSelectedDiscussion(discussion);
                      }}
                    />
                  </>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard workspaceId={workspace._id} />
            )}
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        workspace={workspace}
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInviteSent={fetchWorkspace}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        workspace={workspace}
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Member Manage Modal */}
      <MemberManageModal
        member={selectedMember}
        workspace={workspace}
        isOpen={showMemberManageModal}
        onClose={() => setShowMemberManageModal(false)}
        onMemberUpdated={handleMemberUpdated}
      />

      {/* Project View Modal */}
      <ProjectViewModal
        project={selectedProject}
        isOpen={showProjectViewModal}
        onClose={() => setShowProjectViewModal(false)}
      />

      {/* Workspace Settings Modal */}
      <WorkspaceSettingsModal
        workspace={workspace}
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onWorkspaceUpdated={fetchWorkspace}
      />

      {/* Start Discussion Modal */}
      <StartDiscussionModal
        workspace={workspace}
        isOpen={showStartDiscussionModal}
        onClose={() => setShowStartDiscussionModal(false)}
        onDiscussionCreated={() => {
          setShowStartDiscussionModal(false);
          setSelectedDiscussion(null); // Clear any selected discussion
          setActiveTab('discussions'); // Switch to discussions tab to see the new discussion
        }}
      />
    </div>
  );
};

export default WorkspaceDashboard;