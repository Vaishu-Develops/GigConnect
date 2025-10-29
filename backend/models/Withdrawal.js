import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  bankDetails: {
    accountNumber: {
      type: String,
      required: true
    },
    routingNumber: {
      type: String,
      required: true
    },
    accountHolderName: {
      type: String,
      required: true
    },
    bankName: {
      type: String,
      required: true
    }
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true // Allow null values but ensure uniqueness when present
  },
  processedAt: {
    type: Date
  },
  notes: {
    type: String
  },
  failureReason: {
    type: String
  }
}, {
  timestamps: true
});

// Generate unique transaction ID
withdrawalSchema.pre('save', function(next) {
  if (this.isNew && !this.transactionId) {
    this.transactionId = 'WTH' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

export default Withdrawal;