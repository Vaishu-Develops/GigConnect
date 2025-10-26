import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['client', 'freelancer'],
    },
    skills: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: '',
    },
    // Freelancer-specific fields
    totalEarnings: {
      type: Number,
      default: 0,
    },
    completedProjects: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    experience: {
      type: String,
      default: '',
    },
    education: [{
      type: String
    }],
    certifications: [{
      type: String
    }],
    languages: [{
      type: String
    }],
    // Client-specific fields
    companyName: {
      type: String,
      default: '',
    },
    companySize: {
      type: String,
      default: '',
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    projectsPosted: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);