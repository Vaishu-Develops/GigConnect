export const APP_NAME = 'GigConnect';
export const APP_VERSION = '1.0.0';

export const USER_ROLES = {
  CLIENT: 'client',
  FREELANCER: 'freelancer',
  ADMIN: 'admin'
};

export const GIG_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  APPLICATION: 'application',
  FILE: 'file',
  SYSTEM: 'system'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  APPLICATION: 'application',
  HIRE: 'hire',
  PAYMENT: 'payment',
  REVIEW: 'review',
  SYSTEM: 'system'
};

export const CATEGORIES = [
  'Technology',
  'Design',
  'Writing',
  'Marketing',
  'Consulting',
  'Home Services',
  'Tutoring',
  'Creative Arts',
  'Professional Services',
  'Other'
];

export const SKILLS = [
  'React',
  'Node.js',
  'JavaScript',
  'TypeScript',
  'Python',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Digital Marketing',
  'SEO',
  'Mobile Development',
  'Web Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Cloud Computing',
  'Video Editing',
  'Photography',
  'Social Media Marketing',
  'Project Management'
];

export const CURRENCY = 'INR';
export const PLATFORM_FEE_PERCENTAGE = 5;

export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALL: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB