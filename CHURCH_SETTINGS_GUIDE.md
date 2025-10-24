# Church Settings Configuration Guide

## Overview

The Church Settings feature allows administrators to dynamically configure all church-specific information (name, logo, contact details, social media, bank details, etc.) through the admin panel. This makes the website fully universal - any church can deploy this project and customize it with their own information.

## Accessing Church Settings

### Admin Panel Navigation

1. **Log in to the Admin Panel**
   - Navigate to `/admin` (or your admin login page)
   - Enter your admin credentials

2. **Access Church Settings**
   - In the left sidebar, look for the **"Church Management"** section
   - Click on **"Church Settings"** menu item
   - You'll be taken to `/admin/church-settings`

### Church Settings Manager Page

The Church Settings Manager page is organized into several sections:

#### 1. **Basic Information**
- **Church Name**: The official name of your church
- **Church Description**: A brief description of your church

#### 2. **Branding**
- **Logo URL**: URL to your church logo image
- **Favicon URL**: URL to your church favicon (appears in browser tab)

#### 3. **Contact Information**
- **Address**: Street address of your church
- **City**: City where your church is located
- **Country**: Country where your church is located
- **Postal Code**: Postal/ZIP code
- **Phone**: Main phone number
- **Email**: Main email address

#### 4. **Social Media Links**
- **Facebook**: Facebook page URL
- **Twitter**: Twitter profile URL
- **Instagram**: Instagram profile URL
- **YouTube**: YouTube channel URL

#### 5. **Bank Details** (for donations)
- **Bank Name**: Name of the bank
- **Account Name**: Name on the bank account
- **Account Number**: Bank account number
- **Swift Code**: SWIFT code for international transfers

#### 6. **Settings**
- **Timezone**: Timezone for your church (e.g., UTC, Africa/Dar_es_Salaam)
- **Currency**: Currency code (e.g., USD, TZS)
- **Language**: Language code (e.g., en, sw)

## How It Works

### Frontend Components Using Church Settings

The following pages automatically display your church settings:

1. **Header** - Displays church name and logo
2. **Footer** - Displays church name, logo, address, phone, and email
3. **Contact Page** - Shows all contact information
4. **Give (Donation) Page** - Shows church name and bank details
5. **Gallery Page** - Shows church name in intro text

### Data Flow

```
Admin Panel (ChurchSettingsManager)
    ↓
API PUT /api/church-settings (admin only)
    ↓
MongoDB (ChurchSettings collection)
    ↓
API GET /api/church-settings (public)
    ↓
React Context (ChurchSettingsContext)
    ↓
Components (Header, Footer, Contact, etc.)
```

## Troubleshooting

### Issue: Still Seeing "Shekinah Church" or Empty Values

**Possible Causes:**
1. Church Settings haven't been initialized in the database yet
2. The frontend hasn't fetched the settings
3. The API endpoint is not responding

**Solutions:**

#### Solution 1: Initialize Database
Run one of these initialization scripts:

```bash
# Option 1: Initialize admin and settings
node initAdmin.js

# Option 2: Initialize content and settings
node init-content.js

# Option 3: Seed database with sample data and settings
node seedData.js

# Option 4: Initialize local database (for development)
node init-local-db.js
```

#### Solution 2: Check API Connection
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for a request to `/api/church-settings`
5. Check if it returns a 200 status with settings data

#### Solution 3: Verify Database Connection
1. Check MongoDB connection in server logs
2. Ensure `MONGODB_URI` environment variable is set correctly
3. Verify database credentials

### Issue: Admin Can't Save Church Settings

**Possible Causes:**
1. User is not logged in as admin
2. Admin authorization middleware is blocking the request
3. Database connection issue

**Solutions:**
1. Verify you're logged in as an admin user
2. Check browser console for error messages
3. Check server logs for authorization errors
4. Ensure the user has `isAdmin: true` in the database

### Issue: Changes Not Appearing on Website

**Possible Causes:**
1. Browser cache
2. Frontend not re-fetching settings
3. Settings not saved to database

**Solutions:**
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check browser console for errors
4. Verify settings were saved in admin panel (success message should appear)

## API Endpoints

### Get Church Settings (Public)
```
GET /api/church-settings
Response: { churchName, logo, address, phone, email, ... }
```

### Update Church Settings (Admin Only)
```
PUT /api/church-settings
Headers: Authorization: Bearer <admin_token>
Body: { churchName, logo, address, phone, email, ... }
Response: Updated settings object
```

## Default Values

When Church Settings are first created, they have these default values:

```javascript
{
  churchName: '',
  churchDescription: '',
  logo: '',
  favicon: '',
  address: '',
  city: '',
  country: '',
  postalCode: '',
  phone: '',
  email: '',
  serviceTimes: [],
  socialMedia: {
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    whatsapp: '',
    linkedin: ''
  },
  bankDetails: {
    bankName: '',
    accountName: '',
    accountNumber: '',
    branchName: '',
    swiftCode: '',
    instructions: ''
  },
  mapCoordinates: {
    latitude: null,
    longitude: null,
    mapEmbedUrl: ''
  },
  timezone: 'UTC',
  currency: 'USD',
  language: 'en'
}
```

## Best Practices

1. **Logo**: Use a high-quality image (PNG or SVG recommended)
2. **Email**: Use a monitored email address
3. **Phone**: Include country code for international accessibility
4. **Social Media**: Use full URLs (e.g., https://facebook.com/yourchurch)
5. **Bank Details**: Keep sensitive information secure
6. **Timezone**: Use standard timezone format (e.g., Africa/Dar_es_Salaam)

## Next Steps

After configuring Church Settings:

1. Verify all information displays correctly on the website
2. Test all contact information (phone, email, address)
3. Verify social media links work
4. Test donation page with bank details
5. Check mobile responsiveness

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Check server logs for API errors
3. Verify database connection
4. Ensure all initialization scripts have been run
5. Clear browser cache and try again

