const Settings = require('../models/Settings');

// Get settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = new Settings({
        restaurant: {
          name: 'My Restaurant',
          phone: '',
          email: '',
          address: '',
        },
        delivery: {
          enabled: true,
          radius: 5,
          fee: 5,
          minimumOrder: 20,
        },
        operatingHours: [
          { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
          { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
          { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
          { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
          { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
          { day: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
          { day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
        ],
        isAcceptingOrders: true,
      });
      await settings.save();
    }

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Get Settings Error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Update settings (staff only)
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings(updates);
    } else {
      Object.assign(settings, updates);
      settings.updatedAt = Date.now();
    }

    await settings.save();

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Update Settings Error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

// Toggle accepting orders
exports.toggleAcceptingOrders = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    settings.isAcceptingOrders = !settings.isAcceptingOrders;
    settings.updatedAt = Date.now();
    await settings.save();

    res.json({ success: true, isAcceptingOrders: settings.isAcceptingOrders });
  } catch (error) {
    console.error('Toggle Orders Error:', error);
    res.status(500).json({ error: 'Failed to toggle order acceptance' });
  }
};
