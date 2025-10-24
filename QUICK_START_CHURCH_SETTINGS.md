# Quick Start: Church Settings Configuration

## 🎯 Your Questions Answered

### 1. Can administrators manage church settings through the admin panel?
**YES!** ✅

Administrators can now fully manage all church settings through a dedicated admin page.

### 2. How do they access it?
**Via the Admin Sidebar Menu** ✅

1. Log in to the admin panel (`/admin`)
2. Look at the left sidebar
3. Find the **"Church Management"** section
4. Click **"Church Settings"** menu item
5. You'll see the Church Settings Manager page

### 3. Why is "Shekinah Church" still showing?
**The database hasn't been initialized yet** ⚠️

The Church Settings need to be created in the database first. Follow the steps below.

---

## 🚀 Getting Started (5 Minutes)

### Step 1: Initialize the Database

Run ONE of these commands in your terminal:

```bash
# Option A: Initialize admin user + Church Settings
node initAdmin.js

# Option B: Initialize content + Church Settings  
node init-content.js

# Option C: Seed database with sample data + Church Settings
node seedData.js

# Option D: Initialize local database (for development)
node init-local-db.js
```

**Expected Output:**
```
✅ MongoDB connected successfully
✅ Admin user created successfully
✅ Default church settings created successfully
```

### Step 2: Start Your Application

```bash
# Terminal 1: Start backend server
npm start

# Terminal 2: Start React frontend
cd jsmart1-react
npm run dev
```

### Step 3: Log In to Admin Panel

1. Go to `http://localhost:3000/admin` (or your admin URL)
2. Log in with:
   - **Email**: `admin@shekinah.org`
   - **Password**: `admin123`

### Step 4: Configure Church Settings

1. In the left sidebar, click **"Church Settings"** (under Church Management)
2. Fill in your church information:
   - Church Name
   - Logo URL
   - Address, City, Country
   - Phone and Email
   - Social Media Links
   - Bank Details (for donations)
3. Click **"Save Settings"** button
4. You should see a success message: "Church settings updated successfully!"

### Step 5: Verify Changes

1. Go to the website homepage
2. Check the **Header** - should show your church name and logo
3. Scroll to **Footer** - should show your contact information
4. Visit **Contact Page** - should show your address, phone, email
5. Visit **Donation Page** - should show your church name and bank details

---

## 🔍 Troubleshooting

### Problem: Still seeing "Shekinah Church"

**Solution:**
1. Hard refresh your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check browser console (F12) for errors
3. Verify the API is working:
   ```bash
   curl http://localhost:5002/api/church-settings
   ```
   Should return your church settings as JSON

### Problem: Can't find "Church Settings" in admin sidebar

**Solution:**
1. Make sure you're logged in as admin
2. Look in the **"Church Management"** section (not Finance or Content)
3. If still not visible, try accessing directly: `http://localhost:3000/admin/church-settings`

### Problem: Changes not saving

**Solution:**
1. Verify you're logged in as admin
2. Check browser console (F12) for error messages
3. Check server logs for database errors
4. Try saving again

### Problem: Database not initializing

**Solution:**
1. Verify MongoDB connection string in `.env` file
2. Check MongoDB is running and accessible
3. Try running the test script:
   ```bash
   node test-church-settings.js
   ```

---

## 📱 What Gets Updated

When you configure Church Settings, these parts of your website automatically update:

| Page/Component | What Updates |
|---|---|
| **Header** | Church name and logo |
| **Footer** | Church name, logo, address, phone, email |
| **Contact Page** | All contact information |
| **Donation Page** | Church name and bank details |
| **Gallery Page** | Church name in intro text |

---

## 🔐 Security Notes

- ✅ Only admins can update Church Settings
- ✅ Public can view Church Settings (read-only)
- ✅ All updates require JWT authentication
- ✅ Sensitive data (bank details) are stored securely

---

## 📚 More Information

For detailed documentation, see:
- `CHURCH_SETTINGS_GUIDE.md` - Complete user guide
- `CHURCH_SETTINGS_IMPLEMENTATION_SUMMARY.md` - Technical details

---

## ✅ Verification Checklist

After completing the steps above:

- [ ] Database initialized successfully
- [ ] Admin panel accessible
- [ ] Church Settings menu item visible in sidebar
- [ ] Can access Church Settings page
- [ ] Can fill in and save church information
- [ ] Website header shows correct church name and logo
- [ ] Website footer shows correct contact information
- [ ] Contact page displays correct information
- [ ] Donation page shows correct bank details

---

## 🎉 You're Done!

Your church website is now fully configured and ready to use. Any church can now deploy this project and customize it with their own information through the admin panel.

**No more hardcoded "Shekinah Church" - it's now fully dynamic!** 🚀

