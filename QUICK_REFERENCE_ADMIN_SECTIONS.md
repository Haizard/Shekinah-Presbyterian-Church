# Quick Reference: Admin Panel Sections

## All Editable Sections at a Glance

| Section | Location | Type | Editable? | Notes |
|---------|----------|------|-----------|-------|
| **How We Serve** | Home page | Multiple items | ✅ Yes | Add/edit service areas with icons and images |
| **Our Motto** | About page | Structured | ✅ Yes | Motto text, verse reference, explanation |
| **Our Story** | About page | Text + Image | ✅ Yes | Church history and background |
| **Our Beliefs** | About page | Multiple items | ✅ Yes | Core beliefs with titles and descriptions |
| **Ministries Intro** | Ministries page | Text | ✅ Yes | Generic, church-neutral text |
| **Our Vision** | About page | Text | ✅ Yes | Church vision statement |
| **Our Mission** | About page | Text | ✅ Yes | Church mission statement |
| **Leadership** | About page | Multiple items | ✅ Yes | Church leaders with bios and images |
| **Weekly Schedule** | Schedule page | Structured | ✅ Yes | Church service times and events |
| **Featured Event** | Home page | Structured | ✅ Yes | Highlight upcoming events |
| **Special Events** | Events page | Multiple items | ✅ Yes | List of special events |
| **Video Gallery** | Media page | Multiple items | ✅ Yes | YouTube videos and testimonies |
| **Sermon Series** | Sermons page | Multiple items | ✅ Yes | Sermon series with individual sermons |

---

## How to Access Each Section

### Step 1: Log In
- URL: `http://localhost:3000/admin`
- Email: `admin@shekinah.org`
- Password: `admin123`

### Step 2: Go to Content Manager
- Click "Content Management" in sidebar
- Click "Content"

### Step 3: Find Your Section
- **Option A**: Scroll through the table
- **Option B**: Use the filter dropdown to select section
- **Option C**: Use search box to find by name

### Step 4: Edit
- Click the **Edit** button (pencil icon)
- Make your changes
- Click **Save**

---

## Section Details

### 1. How We Serve
- **Edit**: Add/remove service areas
- **Fields**: Name, Description, Icon, Image
- **Example**: Community Outreach, Youth Ministry, Worship Services

### 2. Our Motto
- **Edit**: Motto text, verse reference, explanation
- **Format**: Supports HTML formatting
- **Example**: "The True Word, The True Gospel, and True Freedom"

### 3. Our Story
- **Edit**: Church history and background
- **Format**: Supports HTML formatting
- **Include**: Founding date, milestones, impact

### 4. Our Beliefs
- **Edit**: Add/remove core beliefs
- **Fields**: Belief title, description
- **Example**: God's Love, Salvation Through Christ, The Holy Spirit

### 5. Ministries Intro
- **Edit**: Introduction text for ministries page
- **Format**: Generic, church-neutral
- **Current**: "We believe that every believer is called to serve..."

### 6. Our Vision
- **Edit**: Church vision statement
- **Format**: Text with HTML support
- **Example**: "To be a beacon of hope and light in our community..."

### 7. Our Mission
- **Edit**: Church mission statement
- **Format**: Text with HTML support
- **Example**: "To make disciples of Jesus Christ..."

### 8. Leadership
- **Edit**: Add/remove church leaders
- **Fields**: Name, Position, Bio, Image
- **Include**: Pastor, staff, board members

### 9. Weekly Schedule
- **Edit**: Service times and weekly events
- **Format**: Structured JSON
- **Include**: Day, time, location, event name

### 10. Featured Event
- **Edit**: Highlight upcoming event
- **Fields**: Title, date, time, location, description
- **Example**: Annual conference, special service

### 11. Special Events
- **Edit**: List of special events
- **Fields**: Title, date, time, location, description
- **Example**: Youth camp, mission trip, conference

### 12. Video Gallery
- **Edit**: Add/remove videos
- **Fields**: Title, URL, thumbnail, description
- **Format**: YouTube embed URLs

### 13. Sermon Series
- **Edit**: Add/remove sermon series
- **Fields**: Series title, description, individual sermons
- **Include**: Scripture references, dates

---

## Common Tasks

### Add a New Service Area
1. Go to Content Manager
2. Find "How We Serve"
3. Click Edit
4. Click "Add Ministry Area"
5. Fill in name, description, icon
6. Click Save

### Update Church Motto
1. Go to Content Manager
2. Find "Our Motto"
3. Click Edit
4. Update motto text and explanation
5. Click Save

### Add a New Belief
1. Go to Content Manager
2. Find "Our Beliefs"
3. Click Edit
4. Click "Add Belief"
5. Fill in title and description
6. Click Save

### Upload an Image
1. In any form, find the image upload section
2. Click "Choose Image"
3. Select image from your computer
4. Image will be uploaded automatically
5. Click Save

---

## Tips & Tricks

### Formatting Text
- Use `<strong>text</strong>` for bold
- Use `<em>text</em>` for italic
- Use `<ul><li>item</li></ul>` for lists
- Use `<p>text</p>` for paragraphs

### Image Best Practices
- Size: 1200x800 pixels or larger
- Format: JPG, PNG, or WebP
- Size: Keep under 5MB
- Quality: Use high-quality images

### Saving Changes
- Always click the Save button
- Wait for success message
- Hard refresh browser to see changes
- Check website to verify

### Troubleshooting
- Hard refresh: `Ctrl+Shift+R`
- Clear cache: Browser settings
- Check console: F12 for errors
- Verify login: Ensure admin access

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Hard Refresh | `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac) |
| Open Console | `F12` |
| Search | `Ctrl+F` |
| Save Form | `Ctrl+S` (in some forms) |

---

## Need Help?

1. **Check the full guide**: See `ADMIN_PANEL_EDITING_GUIDE.md`
2. **Review examples**: Each section has example content
3. **Test changes**: Make a small change and verify it works
4. **Check browser console**: F12 for error messages

---

**Last Updated**: 2025-10-24
**Status**: ✅ All Sections Ready

