# Quick Start Guide - Dynamic Church Website

## 🚀 Get Started in 5 Minutes

### Step 1: Initialize Database
```bash
node initAdmin.js
```

**Output should show:**
```
✅ Connected to MongoDB
✅ Admin user created successfully
✅ Default church settings created successfully
✅ Default ministry sections created successfully
```

### Step 2: Start Backend Server
```bash
npm start
```

**Server should start on port 5002:**
```
✅ Server running on port 5002
✅ MongoDB connected successfully
```

### Step 3: Start Frontend (in new terminal)
```bash
cd jsmart1-react
npm run dev
```

**Frontend should start on port 3000:**
```
✅ Local: http://localhost:3000
```

### Step 4: Log In to Admin Panel
1. Open browser: `http://localhost:3000/admin`
2. Email: `admin@shekinah.org`
3. Password: `admin123`

### Step 5: Configure Your Church

#### Option A: Configure Church Settings
1. Click **Church Management** → **Church Settings**
2. Fill in your church information:
   - Church Name
   - Logo URL
   - Contact Information
   - Social Media Links
   - Bank Details
3. Click **Save**

#### Option B: Manage Ministry Sections
1. Click **Content Management** → **Ministry Sections**
2. Edit existing sections or add new ones:
   - Title
   - Description
   - Focus Areas
   - Section Image
   - Display Order
3. Click **Save**

#### Option C: Edit About Page
1. Click **Content Management** → **Content**
2. Edit sections:
   - "story" - Our Story section
   - "motto" - Our Motto section
   - "about" - About Us section
   - "vision" - Vision section
   - "mission" - Mission section
3. Click **Save**

## 📋 What's Dynamic

### Header & Footer
- Church name
- Logo
- Contact information
- Social media links

### Pages
- **Home**: Church name and logo
- **About**: Story, Motto, About Us, Vision, Mission
- **Ministries**: All ministry sections and details
- **Contact**: Contact information
- **Give**: Church name and bank details
- **Gallery**: Church name

## 🔧 Admin Panel Navigation

```
Admin Dashboard
├── Church Management
│   └── Church Settings
├── Content Management
│   ├── Content
│   ├── Ministry Sections
│   └── Ministries
├── Events
├── Sermons
├── Gallery
└── Users
```

## 🧪 Test Everything Works

### Test 1: Check Ministry Sections
```bash
node test-ministry-sections.js
```

### Test 2: Check Church Settings
```bash
curl http://localhost:5002/api/church-settings
```

### Test 3: Check Ministry Sections API
```bash
curl http://localhost:5002/api/ministry-sections
```

## 📱 View Your Website

1. Open `http://localhost:3000`
2. Check that:
   - Header shows your church name and logo
   - Footer shows your contact information
   - About page shows your story and motto
   - Ministries page shows your ministry sections
   - Contact page shows your contact info
   - Give page shows your church name and bank details

## 🐛 Troubleshooting

### Issue: "Cannot find module"
**Solution**: Run `npm install` in both root and `jsmart1-react` directories

### Issue: "MongoDB connection error"
**Solution**: Check `.env` file has correct `MONGODB_URI`

### Issue: "Admin login fails"
**Solution**: Run `node initAdmin.js` to create admin user

### Issue: "Ministry sections not showing"
**Solution**: 
1. Run `node initAdmin.js`
2. Hard refresh browser: `Ctrl+Shift+R`
3. Check browser console for errors

### Issue: "Changes not saving"
**Solution**:
1. Verify you're logged in as admin
2. Check browser console for error messages
3. Check server logs for API errors

## 📚 Full Documentation

- **DYNAMIC_CONTENT_IMPLEMENTATION.md** - Complete technical guide
- **IMPLEMENTATION_COMPLETE.md** - What was implemented
- **CHURCH_SETTINGS_GUIDE.md** - Church settings details
- **QUICK_START_CHURCH_SETTINGS.md** - Church settings quick start

## 🎯 Next Steps

1. ✅ Initialize database
2. ✅ Start servers
3. ✅ Log in to admin panel
4. ✅ Configure church settings
5. ✅ Customize ministry sections
6. ✅ Edit about page content
7. ✅ Verify website looks correct
8. ✅ Deploy to production

## 🚀 Deploy to Production

1. Update `.env` with production MongoDB URI
2. Update `.env` with production API URL
3. Build frontend: `cd jsmart1-react && npm run build`
4. Deploy backend to hosting service (Render, Heroku, etc.)
5. Deploy frontend to hosting service (Vercel, Netlify, etc.)

## 💡 Tips

- **Backup your data** before making major changes
- **Test changes** on staging before production
- **Use descriptive names** for ministry sections
- **Add high-quality images** for better appearance
- **Keep contact info updated** for visitors
- **Review content regularly** for accuracy

## ✅ You're All Set!

Your church website is now fully dynamic and ready to use. All content is managed through the admin panel, and no hardcoded church-specific information remains.

**Happy customizing! 🎉**

---

For more help, see the full documentation files or check the browser console for error messages.

