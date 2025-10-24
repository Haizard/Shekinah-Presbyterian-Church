const mongoose = require('mongoose');

const churchSettingsSchema = mongoose.Schema(
  {
    // Basic Information
    churchName: {
      type: String,
      default: '',
    },
    churchDescription: {
      type: String,
      default: '',
    },
    
    // Branding
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    
    // Contact Information
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    postalCode: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    
    // Service Times
    serviceTimes: [
      {
        day: String,
        time: String,
        description: String,
      }
    ],
    
    // Social Media Links
    socialMedia: {
      facebook: {
        type: String,
        default: '',
      },
      twitter: {
        type: String,
        default: '',
      },
      instagram: {
        type: String,
        default: '',
      },
      youtube: {
        type: String,
        default: '',
      },
      whatsapp: {
        type: String,
        default: '',
      },
      linkedin: {
        type: String,
        default: '',
      },
    },
    
    // Bank Details
    bankDetails: {
      bankName: {
        type: String,
        default: '',
      },
      accountName: {
        type: String,
        default: '',
      },
      accountNumber: {
        type: String,
        default: '',
      },
      branchName: {
        type: String,
        default: '',
      },
      swiftCode: {
        type: String,
        default: '',
      },
      instructions: {
        type: String,
        default: '',
      },
    },
    
    // Map Coordinates
    mapCoordinates: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
      mapEmbedUrl: {
        type: String,
        default: '',
      },
    },
    
    // Additional Settings
    timezone: {
      type: String,
      default: 'UTC',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    language: {
      type: String,
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

const ChurchSettings = mongoose.model('ChurchSettings', churchSettingsSchema);

module.exports = ChurchSettings;

