import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: function() {
        return this.paymentType === 'gig';
      }
    },
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: function() {
        return this.paymentType === 'contract';
      }
    },
    paymentType: {
      type: String,
      enum: ['gig', 'contract'],
      required: true,
      default: 'gig'
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['created', 'attempted', 'paid', 'failed', 'refunded'],
      default: 'created',
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Payment', paymentSchema);