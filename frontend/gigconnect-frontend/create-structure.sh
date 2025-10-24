#!/bin/bash
echo "Creating folder structure..."

mkdir -p src/components/{layout,ui,auth,gig,chat,user,payment}
mkdir -p src/pages/{public,common,client,freelancer,admin}
mkdir -p src/{context,services,hooks,utils,styles}

# Create main app file
touch src/App.js

# Layout components
touch src/components/layout/{Navbar.js,Footer.js,Sidebar.js,ProtectedRoute.js}

# UI components
touch src/components/ui/{Button.js,Input.js,Card.js,Modal.js,Loader.js,Toast.js,Badge.js,Rating.js}

# Auth components
touch src/components/auth/{LoginForm.js,RegisterForm.js,RoleSelector.js}

# Gig components
touch src/components/gig/{GigCard.js,GigGrid.js,GigForm.js,GigFilters.js,GigDetails.js,SkillTag.js}

# Chat components
touch src/components/chat/{ChatBox.js,ChatList.js,MessageBubble.js,ChatHeader.js,TypingIndicator.js}

# User components
touch src/components/user/{UserCard.js,ProfileHeader.js,PortfolioGrid.js,ReviewCard.js}

# Payment components
touch src/components/payment/{PaymentModal.js,OrderSummary.js,PaymentSuccess.js}

# Pages
touch src/pages/public/{Home.js,Login.js,Register.js,ExploreGigs.js,BrowseFreelancers.js,HowItWorks.js,FAQ.js,Contact.js}
touch src/pages/common/{Dashboard.js,Profile.js,EditProfile.js,UserProfile.js,Messages.js,ChatThread.js,Notifications.js,Settings.js}
touch src/pages/client/{PostGig.js,MyGigs.js,EditGig.js,GigApplicants.js,ActiveProjects.js,ProjectDetails.js,CompletedProjects.js,PaymentCheckout.js,PaymentSuccess.js,SubmitReview.js}
touch src/pages/freelancer/{BrowseJobs.js,JobDetails.js,ApplyToJob.js,MyApplications.js,ActiveJobs.js,JobWorkspace.js,CompletedJobs.js,MyReviews.js,Earnings.js}
touch src/pages/admin/{AdminDashboard.js,ManageUsers.js,ManageGigs.js,PlatformAnalytics.js,ReportedContent.js}

# Context
touch src/context/{AuthContext.js,ChatContext.js,GigContext.js,NotificationContext.js,ThemeContext.js}

# Services
touch src/services/{api.js,authService.js,gigService.js,chatService.js,paymentService.js,userService.js}

# Hooks
touch src/hooks/{useAuth.js,useSocket.js,useLocalStorage.js,useDebounce.js,useForm.js,usePagination.js}

# Utils
touch src/utils/{constants.js,helpers.js,validation.js,formatters.js,socket.js}

# Styles
touch src/styles/{index.css,components.css,animations.css}

echo "✅ Structure created successfully!"
