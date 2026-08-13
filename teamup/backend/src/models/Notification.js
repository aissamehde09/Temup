import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, index: true },
    type: {
      type: String,
      enum: ['MATCH_CREATED', 'MATCH_JOINED', 'MATCH_LEFT', 'MATCH_FULL', 'MATCH_UPDATED', 'MATCH_REMINDER'],
      required: true,
    },
    message: { type: String, required: true },
    context: { type: String, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Notification = mongoose.model('Notification', notificationSchema);
