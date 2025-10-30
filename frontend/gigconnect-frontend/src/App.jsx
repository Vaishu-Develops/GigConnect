import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Context Hooks
import { useAuth } from './context/AuthContext.jsx'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LoadingSpinner from './components/ui/Loader'

// Public Pages
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import ExploreGigs from './pages/public/ExploreGigs'
import BrowseFreelancers from './pages/public/BrowseFreelancers'
import HowItWorks from './pages/public/HowItWorks'
import FAQ from './pages/public/FAQ'
import Contact from './pages/public/Contact'

// Common Protected Pages
import Dashboard from './pages/common/Dashboard'
import Profile from './pages/common/Profile'
import EditProfile from './pages/common/EditProfile'
import UserProfile from './pages/common/UserProfile'
import Messages from './pages/common/Messages'
import ChatThread from './pages/common/ChatThread'
import Notifications from './pages/common/Notifications'
import Settings from './pages/common/Settings'
import SavedGigs from './pages/common/SavedGigs'
import Contracts from './pages/common/Contracts'
import ContractDetails from './pages/common/ContractDetails'

// Client-Specific Pages
import PostGig from './pages/client/PostGig'
import MyGigs from './pages/client/MyGigs'
import EditGig from './pages/client/EditGig'
import DirectHire from './pages/client/DirectHire';
import GigApplicants from './pages/client/GigApplicants'
import ActiveProjects from './pages/client/ActiveProjects'
import ProjectDetails from './pages/client/ProjectDetails'
import CompletedProjects from './pages/client/CompletedProjects'
import PaymentCheckout from './pages/client/PaymentCheckout'
import PaymentSuccess from './pages/client/PaymentSuccess'
import SubmitReview from './pages/client/SubmitReview'

// Freelancer-Specific Pages
import BrowseJobs from './pages/freelancer/BrowseJobs'
import JobDetails from './pages/freelancer/JobDetails'
import ApplyToJob from './pages/freelancer/ApplyToJob'
import MyApplications from './pages/freelancer/MyApplications'
import ActiveJobs from './pages/freelancer/ActiveJobs'
import JobWorkspace from './pages/freelancer/JobWorkspace'
import CompletedJobs from './pages/freelancer/CompletedJobs'
import MyReviews from './pages/freelancer/MyReviews'
import Earnings from './pages/freelancer/Earnings'
import HireProposals from './pages/freelancer/HireProposals'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageGigs from './pages/admin/ManageGigs'
import PlatformAnalytics from './pages/admin/PlatformAnalytics'
import ReportedContent from './pages/admin/ReportedContent'

// Workspace Pages
import WorkspaceList from './pages/common/WorkspaceList'
import CreateWorkspace from './pages/common/CreateWorkspace'
import WorkspaceDashboard from './pages/common/WorkspaceDashboard'
import InvitationTester from './pages/common/InvitationTester'

function App() {
  const { user, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<ExploreGigs />} />
          <Route path="/gigs/:gigId" element={<JobDetails />} />
          <Route path="/browse-freelancers" element={<BrowseFreelancers />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user/:userId" element={<UserProfile />} />

          {/* Common Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/new"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:chatId"
            element={
              <ProtectedRoute>
                <ChatThread />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-gigs"
            element={
              <ProtectedRoute>
                <SavedGigs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contracts"
            element={
              <ProtectedRoute>
                <Contracts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/contracts"
            element={
              <ProtectedRoute requiredRole="client">
                <Contracts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contracts/:contractId"
            element={
              <ProtectedRoute>
                <ContractDetails />
              </ProtectedRoute>
            }
          />

          {/* Workspace Routes */}
          <Route
            path="/workspaces"
            element={
              <ProtectedRoute>
                <WorkspaceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspaces/create"
            element={
              <ProtectedRoute>
                <CreateWorkspace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspaces/:workspaceId"
            element={
              <ProtectedRoute>
                <WorkspaceDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/invitations"
            element={
              <ProtectedRoute>
                <InvitationTester />
              </ProtectedRoute>
            }
          />

          {/* Client-Specific Routes */}
          <Route
            path="/client/post-gig"
            element={
              <ProtectedRoute requiredRole="client">
                <PostGig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/my-gigs"
            element={
              <ProtectedRoute requiredRole="client">
                <MyGigs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/edit-gig/:gigId"
            element={
              <ProtectedRoute requiredRole="client">
                <EditGig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/gig-applicants/:gigId"
            element={
              <ProtectedRoute requiredRole="client">
                <GigApplicants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hire-freelancer"
            element={
              <ProtectedRoute requiredRole="client">
                <DirectHire />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/active-projects"
            element={
              <ProtectedRoute requiredRole="client">
                <ActiveProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/project/:gigId"
            element={
              <ProtectedRoute requiredRole="client">
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/completed-projects"
            element={
              <ProtectedRoute requiredRole="client">
                <CompletedProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/payment/:gigId"
            element={
              <ProtectedRoute requiredRole="client">
                <PaymentCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/payment-checkout"
            element={
              <ProtectedRoute requiredRole="client">
                <PaymentCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/payment-success/:orderId"
            element={
              <ProtectedRoute requiredRole="client">
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/review/:gigId"
            element={
              <ProtectedRoute requiredRole="client">
                <SubmitReview />
              </ProtectedRoute>
            }
          />

          {/* Freelancer-Specific Routes */}
          <Route
            path="/freelancer/browse-jobs"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <BrowseJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/job/:gigId"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <JobDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/apply/:gigId"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <ApplyToJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/applications"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/hire-proposals"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <HireProposals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/active-jobs"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <ActiveJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/workspace/:gigId"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <JobWorkspace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/completed-jobs"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <CompletedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/reviews"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <MyReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/earnings"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <Earnings />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gigs"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageGigs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute requiredRole="admin">
                <PlatformAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requiredRole="admin">
                <ReportedContent />
              </ProtectedRoute>
            }
          />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App