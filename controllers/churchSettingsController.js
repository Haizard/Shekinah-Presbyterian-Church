const ChurchSettings = require('../models/ChurchSettings');

// @desc    Get church settings
// @route   GET /api/church-settings
// @access  Public
const getChurchSettings = async (req, res) => {
  try {
    let settings = await ChurchSettings.findOne();
    
    // If no settings exist, create default empty settings
    if (!settings) {
      settings = new ChurchSettings({});
      await settings.save();
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching church settings:', error);
    res.status(500).json({ message: 'Server error fetching church settings' });
  }
};

// @desc    Update church settings
// @route   PUT /api/church-settings
// @access  Private/Admin
const updateChurchSettings = async (req, res) => {
  try {
    const {
      churchName,
      churchDescription,
      logo,
      favicon,
      address,
      city,
      country,
      postalCode,
      phone,
      email,
      serviceTimes,
      socialMedia,
      bankDetails,
      mapCoordinates,
      timezone,
      currency,
      language,
    } = req.body;

    let settings = await ChurchSettings.findOne();

    if (!settings) {
      settings = new ChurchSettings();
    }

    // Update fields
    if (churchName !== undefined) settings.churchName = churchName;
    if (churchDescription !== undefined) settings.churchDescription = churchDescription;
    if (logo !== undefined) settings.logo = logo;
    if (favicon !== undefined) settings.favicon = favicon;
    if (address !== undefined) settings.address = address;
    if (city !== undefined) settings.city = city;
    if (country !== undefined) settings.country = country;
    if (postalCode !== undefined) settings.postalCode = postalCode;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (serviceTimes !== undefined) settings.serviceTimes = serviceTimes;
    if (socialMedia !== undefined) settings.socialMedia = { ...settings.socialMedia, ...socialMedia };
    if (bankDetails !== undefined) settings.bankDetails = { ...settings.bankDetails, ...bankDetails };
    if (mapCoordinates !== undefined) settings.mapCoordinates = { ...settings.mapCoordinates, ...mapCoordinates };
    if (timezone !== undefined) settings.timezone = timezone;
    if (currency !== undefined) settings.currency = currency;
    if (language !== undefined) settings.language = language;

    const updatedSettings = await settings.save();
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error('Error updating church settings:', error);
    res.status(500).json({ message: 'Server error updating church settings' });
  }
};

module.exports = {
  getChurchSettings,
  updateChurchSettings,
};

