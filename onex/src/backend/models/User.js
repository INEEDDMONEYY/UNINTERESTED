const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    Monday: { type: String, default: '' },
    Tuesday: { type: String, default: '' },
    Wednesday: { type: String, default: '' },
    Thursday: { type: String, default: '' },
    Friday: { type: String, default: '' },
    Saturday: { type: String, default: '' },
    Sunday: { type: String, default: '' },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profilePic: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    conversations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
      },
    ],
    availability: {
      type: availabilitySchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

UserSchema.virtual('isAdmin').get(function () {
  return this.role === 'admin';
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model('User', UserSchema);
