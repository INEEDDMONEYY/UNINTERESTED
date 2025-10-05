import AdminSettings from '../models/AdminSettings.js'; // ✅ Add .js extension (ESM style)

// Get current settings
export const getSettings = async (req, res) => {
  console.log("🔹 PUT /api/admin/settings hit with body:", req.body);
  try {
    let settings = await AdminSettings.findOne();

    // If no settings exist yet, create default ones
    if (!settings) {
      settings = await AdminSettings.create({
        roleRestriction: '',
        suspendUserId: '',
        devMessage: 'Welcome to the platform 🌟',
      });
    }

    res.json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update or create settings
export const updateSettings = async (req, res) => { // ✅ fixed typo: 'aysnc' → 'async'
  try {
    const data = req.body;
    let settings = await AdminSettings.findOne();

    if (settings) {
      // ✅ Apply new values to existing settings
      Object.assign(settings, data);
      await settings.save();
    } else {
      // ✅ Fix capitalization typo: Adminsettings → AdminSettings
      settings = await AdminSettings.create(data);
    }

    res.json(settings);
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ message: err.message });
  }
};
