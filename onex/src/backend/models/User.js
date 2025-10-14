const mongoose = require('mongoose');

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
      default: '', // optional field
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
        ref: 'Conversation', // link to conversation model
      },
    ],
  },
  { timestamps: true }
);

// Virtual property to check if user is admin
UserSchema.virtual('isAdmin').get(function () {
  return this.role === 'admin';
});

// Optional: transform output when sending to client
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password; // never send password
    return ret;
  },
});

module.exports = mongoose.model('User', UserSchema);
