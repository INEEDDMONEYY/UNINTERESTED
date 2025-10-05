import mongoose from 'mongoose';

const AdminSettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'Mystery Mansion',
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    supportEmail: {
      type: String,
      default: 'fantometechnologies@gmail.com',
    },
    maxUploadSize: {
      type: Number,
      default: 10, // MB
    },
    allowedFileTypes: {
      type: [String],
      default: ['jpg', 'png', 'pdf'],
    },
    customSettings: {
      type: Map,
      of: String, // Flexible key-value settings
      default: {},
    },
    devMessage: {
      type: String,
      default: 'Respect all members on the platform, post often to get rewarded 🌟',
    },

    // ✅ Add these missing fields
    roleRestriction: {
      type: String,
      default: '',
    },
    suspendUserId: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('AdminSettings', AdminSettingsSchema);
