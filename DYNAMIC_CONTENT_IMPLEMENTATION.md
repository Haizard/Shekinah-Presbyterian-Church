# Dynamic Content Implementation - Complete Guide

## Overview

This document describes the complete implementation of dynamic content management for the church website, including Church Settings, Ministry Sections, and About page content.

## What Has Been Made Dynamic

### 1. **Church Settings** ✅
- Church name, logo, and branding
- Contact information (address, phone, email)
- Social media links
- Bank details for donations
- Service times and timezone
- Managed via `/admin/church-settings`

### 2. **Ministry Sections** ✅
- All detailed ministry section content (Church Planting, Leadership Development, Youth Ministry, etc.)
- Section titles, descriptions, and focus areas
- Section ordering
- Managed via `/admin/ministry-sections`

### 3. **About Page Content** ✅
- "Our Story" section - now pulls from database
- "Our Motto" section - already using DynamicContent
- "About Us", "Vision", and "Mission" sections - already using DynamicContent

### 4. **Ministries Page** ✅
- Individual ministry cards (from Ministry model)
- Detailed ministry sections (from MinistrySection model)
- "How We Serve" section (from Content model)

## Database Models

### ChurchSettings Model
```javascript
{
  churchName: String,
  churchDescription: String,
  logo: String,
  favicon: String,
  address: String,
  city: String,
  country: String,
  postalCode: String,
  phone: String,
  email: String,
  serviceTimes: Array,
  socialMedia: Object,
  bankDetails: Object,
  mapCoordinates: Object,
  timezone: String,
  currency: String,
  language: String
}
```

### MinistrySection Model
```javascript
{
  title: String,
  description: String,
  image: String,
  focusAreas: [
    {
      icon: String,
      text: String
    }
  ],
  order: Number,
  sectionId: String (unique identifier)
}
```

## API Endpoints

### Church Settings
- `GET /api/church-settings` - Get church settings (public)
- `PUT /api/church-settings` - Update church settings (admin only)

### Ministry Sections
- `GET /api/ministry-sections` - Get all ministry sections (public)
- `GET /api/ministry-sections/by-id/:id` - Get by MongoDB ID (public)
- `GET /api/ministry-sections/by-section/:sectionId` - Get by section ID (public)
- `POST /api/ministry-sections` - Create new section (admin only)
- `PUT /api/ministry-sections/:id` - Update section (admin only)
- `DELETE /api/ministry-sections/:id` - Delete section (admin only)

## Admin Panel Access

### Church Settings Manager
- **URL**: `/admin/church-settings`
- **Sidebar**: Church Management → Church Settings
- **Features**:
  - Edit church name, logo, contact info
  - Manage social media links
  - Configure bank details
  - Set timezone and currency

### Ministry Sections Manager
- **URL**: `/admin/ministry-sections`
- **Sidebar**: Content Management → Ministry Sections
- **Features**:
  - Add/edit/delete ministry sections
  - Manage section titles and descriptions
  - Add focus areas with icons
  - Set display order
  - Upload section images

## Frontend Components

### Updated Components
- **Header.jsx** - Uses dynamic church name and logo
- **Footer.jsx** - Uses dynamic contact information
- **Ministries.jsx** - Renders dynamic ministry sections
- **About.jsx** - Uses DynamicContent for story section
- **Contact.jsx** - Uses dynamic contact information
- **Give.jsx** - Uses dynamic church name and bank details
- **Gallery.jsx** - Uses dynamic church name

### Context Providers
- **ChurchSettingsContext** - Provides church settings throughout app
- **ContentContext** - Provides content sections
- **AuthContext** - Provides authentication

## Initialization

### Default Ministry Sections
When the database is initialized, 6 default ministry sections are created:
1. Church Planting & Gospel Expansion
2. Leadership Development
3. Youth & Next Generation Ministry
4. Community Impact & Mercy Ministry
5. Missions & Evangelism
6. Prayer Ministry

### Initialization Scripts
Run one of these to initialize the database:
```bash
node initAdmin.js          # Initialize admin + settings + sections
node init-content.js       # Initialize content + settings + sections
node seedData.js           # Seed database + settings + sections
node init-local-db.js      # Initialize local DB + settings + sections
```

## File Structure

### New Files Created
- `models/MinistrySection.js` - MongoDB model
- `controllers/ministrySectionController.js` - API controller
- `routes/ministrySections.js` - API routes
- `utils/initializeMinisterySections.js` - Initialization helper
- `jsmart1-react/src/pages/admin/MinistrySectionManager.jsx` - Admin page

### Modified Files
- `server.js` - Added ministry sections routes
- `jsmart1-react/src/App.jsx` - Added route and import
- `jsmart1-react/src/services/api.js` - Added API methods
- `jsmart1-react/src/components/admin/AdminSidebar.jsx` - Added menu item
- `jsmart1-react/src/pages/Ministries.jsx` - Uses dynamic sections
- `jsmart1-react/src/pages/About.jsx` - Uses DynamicContent for story
- `initAdmin.js` - Calls initialization
- `init-content.js` - Calls initialization
- `seedData.js` - Calls initialization
- `init-local-db.js` - Calls initialization

## How to Use

### For Administrators

1. **Configure Church Settings**
   - Go to `/admin/church-settings`
   - Fill in your church information
   - Save changes

2. **Manage Ministry Sections**
   - Go to `/admin/ministry-sections`
   - Add, edit, or delete ministry sections
   - Set display order
   - Add focus areas

3. **Edit About Page Content**
   - Go to `/admin/content`
   - Edit "about", "vision", "mission", "story", and "motto" sections
   - Changes appear immediately on the website

### For Developers

1. **Initialize Database**
   ```bash
   node initAdmin.js
   ```

2. **Start Application**
   ```bash
   npm start
   cd jsmart1-react && npm run dev
   ```

3. **Access Admin Panel**
   - URL: `http://localhost:3000/admin`
   - Email: `admin@shekinah.org`
   - Password: `admin123`

## Key Features

✅ **Universal** - Works for any church
✅ **Dynamic** - All content managed through admin panel
✅ **Secure** - Admin-only updates with JWT authentication
✅ **Responsive** - Works on all devices
✅ **Scalable** - Easy to add more fields
✅ **Fallback** - Graceful handling of empty settings
✅ **Auto-Initialize** - Creates default settings automatically

## Troubleshooting

### Ministry Sections Not Showing
1. Run initialization script: `node initAdmin.js`
2. Hard refresh browser: `Ctrl+Shift+R`
3. Check browser console for errors
4. Verify API: `curl http://localhost:5002/api/ministry-sections`

### Can't Access Admin Pages
1. Verify you're logged in as admin
2. Check sidebar for menu items
3. Try accessing directly: `/admin/ministry-sections`
4. Check browser console for errors

### Changes Not Saving
1. Verify you're logged in as admin
2. Check browser console for error messages
3. Verify database connection in server logs
4. Try again after page refresh

## Next Steps

1. ✅ Initialize database with default ministry sections
2. ✅ Log in to admin panel
3. ✅ Configure church settings
4. ✅ Customize ministry sections
5. ✅ Edit about page content
6. ✅ Verify website displays correctly
7. ✅ Deploy to production

---

**Status**: ✅ Implementation Complete and Ready for Use

