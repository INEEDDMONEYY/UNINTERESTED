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
    incallPrice: {
      type: Number,
      default: 0,
    },
    outcallPrice: {
      type: Number,
      default: 0,
    },
    conversations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
      },
    ],

    /* ---------------- 🔐 Password Reset Fields ---------------- */
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    /* ----------------------------------------------------------- */

    // ❌ availability removed completely
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
    delete ret.resetPasswordToken; // extra safety
    delete ret.resetPasswordExpires;
    return ret;
  },
});

module.exports = mongoose.model('User', UserSchema);

