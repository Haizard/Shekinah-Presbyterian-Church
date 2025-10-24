# Admin Panel Content Editing Guide

## Overview

All major content sections on your church website are now fully editable through the admin panel. This guide shows you how to customize each section with your church's specific information.

---

## Accessing the Admin Panel

1. **Log In**
   - URL: `http://localhost:3000/admin` (or your production URL)
   - Email: `admin@shekinah.org`
   - Password: `admin123`

2. **Navigate to Content Manager**
   - Click on "Content Management" in the sidebar
   - Click on "Content" to open the Content Manager

---

## Editable Sections

### 1. "How We Serve" Section

**Location**: Home page, scroll down to "How We Serve" section

**What You Can Edit**:
- Section title
- Introduction text
- Multiple service areas with:
  - Name/Title
  - Description
  - Icon (from predefined list)
  - Image

**How to Edit**:
1. In Content Manager, find "How We Serve" in the list
2. Click the **Edit** button (pencil icon)
3. Update the section title and introduction
4. Add or remove service areas:
   - Click "Add Ministry Area" to add new areas
   - Click "Remove" to delete areas
5. For each area, fill in:
   - **Name**: e.g., "Community Outreach", "Youth Ministry"
   - **Description**: Describe what this ministry does
   - **Icon**: Select from available icons
   - **Image**: Upload an image (optional)
6. Click "Save Ministry Areas"

**Example Content**:
```
Title: How We Serve

Service Area 1:
- Name: Community Outreach
- Description: We provide food, clothing, and support to those in need in our community.
- Icon: Helping Hands

Service Area 2:
- Name: Youth Ministry
- Description: Engaging programs for children and teens to grow in faith and fellowship.
- Icon: Community
```

---

### 2. "Our Motto" Section

**Location**: About page, scroll down to "Our Motto" section

**What You Can Edit**:
- Section title
- Motto text (the main quote)
- Bible verse reference (optional)
- Explanation (with HTML formatting support)
- Section image (optional)

**How to Edit**:
1. In Content Manager, find "Our Motto" in the list
2. Click the **Edit** button
3. Update the following fields:
   - **Section Title**: e.g., "Our Motto"
   - **Motto Text**: Your church's main motto
   - **Bible Verse Reference**: e.g., "Matthew 28:19-20" (optional)
   - **Explanation**: Detailed explanation of your motto
   - **Image**: Upload an image (optional)
4. Click "Save Motto"

**HTML Formatting Tips**:
- Bold text: `<strong>text</strong>`
- Italic text: `<em>text</em>`
- Lists: `<ul><li>Item 1</li><li>Item 2</li></ul>`
- Paragraphs: `<p>Your text here</p>`

**Example Content**:
```
Motto Text: The True Word, The True Gospel, and True Freedom

Verse Reference: Matthew 9:35

Explanation:
<p>This motto shapes everything we do. We are committed to:</p>
<ul>
  <li><strong>The True Word</strong> - Teaching God's Word faithfully</li>
  <li><strong>The True Gospel</strong> - Proclaiming Christ clearly</li>
  <li><strong>True Freedom</strong> - Helping people experience freedom in Christ</li>
</ul>
```

---

### 3. "Our Story" Section

**Location**: About page, "Our Story" section

**What You Can Edit**:
- Section title
- Story content (with HTML formatting support)
- Section image

**How to Edit**:
1. In Content Manager, find "Our Story" in the list
2. Click the **Edit** button
3. Update the following fields:
   - **Section Title**: e.g., "Our Story"
   - **Content**: Your church's history and story
   - **Image**: Upload an image (optional)
4. Click "Save Our Story"

**Example Content**:
```
Title: Our Story

Content:
<p>Our church was founded in 1995 with a vision to serve our community and spread the Gospel of Jesus Christ.</p>
<p>Over the past 25+ years, we have grown from a small group of believers to a thriving congregation of over 500 members.</p>
<p>Our journey has been marked by God's faithfulness, and we continue to trust Him as we move forward in ministry.</p>
```

---

### 4. "Our Beliefs" Section

**Location**: About page, "Our Beliefs" section (if implemented)

**What You Can Edit**:
- Section title
- Introduction text
- Multiple core beliefs with:
  - Belief title
  - Belief description
- Section image

**How to Edit**:
1. In Content Manager, find "Our Beliefs" in the list
2. Click the **Edit** button
3. Update the following fields:
   - **Section Title**: e.g., "Our Beliefs"
   - **Introduction**: Brief intro to your beliefs
   - **Core Beliefs**: Add or remove beliefs
4. For each belief, fill in:
   - **Title**: e.g., "God's Love", "Salvation Through Christ"
   - **Description**: Explain this belief
5. Click "Save Beliefs"

**Example Content**:
```
Title: Our Beliefs

Introduction: We believe in the core truths of the Christian faith as revealed in Scripture.

Belief 1:
- Title: God's Love
- Description: God loves all people and desires a relationship with each person.

Belief 2:
- Title: Salvation Through Christ
- Description: Jesus Christ is the Son of God who died for our sins and rose again.

Belief 3:
- Title: The Holy Spirit
- Description: The Holy Spirit empowers believers to live for Christ and serve others.
```

---

### 5. "Ministries Intro" Text

**Location**: Ministries page, top section

**Current Status**: Generic, church-neutral text
- "We believe that every believer is called to serve..."

**Note**: This text is currently generic and works for any church. To customize it further, you can edit it through the Content Manager if needed.

---

## Step-by-Step: Editing a Section

### Example: Editing "How We Serve"

1. **Log in to Admin Panel**
   - Go to `http://localhost:3000/admin`
   - Enter your credentials

2. **Open Content Manager**
   - Click "Content Management" → "Content"

3. **Find the Section**
   - Look for "How We Serve" in the table
   - Or use the filter dropdown to select "How We Serve"

4. **Click Edit**
   - Click the pencil icon in the Actions column

5. **Update Content**
   - Change the service area names and descriptions
   - Add new areas or remove existing ones
   - Upload images if desired

6. **Save Changes**
   - Click "Save Ministry Areas"
   - You'll see a success message

7. **Verify on Website**
   - Go to the Home page
   - Scroll to "How We Serve" section
   - Your changes should appear immediately

---

## Tips for Best Results

### Content Guidelines

1. **Keep it concise**: Use clear, easy-to-read language
2. **Use HTML formatting**: Make content visually appealing with bold, italics, and lists
3. **Add images**: Images make sections more engaging
4. **Proofread**: Check for spelling and grammar before saving

### Image Guidelines

1. **Recommended size**: 1200x800 pixels or larger
2. **File format**: JPG, PNG, or WebP
3. **File size**: Keep under 5MB for faster loading
4. **Quality**: Use high-quality images

### HTML Formatting Examples

```html
<!-- Bold text -->
<strong>Important text</strong>

<!-- Italic text -->
<em>Emphasized text</em>

<!-- Unordered list -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Ordered list -->
<ol>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ol>

<!-- Paragraph -->
<p>Your paragraph text here.</p>

<!-- Line break -->
<br>

<!-- Heading -->
<h3>Subheading</h3>
```

---

## Troubleshooting

### Changes Not Appearing

1. **Hard refresh your browser**: Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear browser cache**: Go to browser settings and clear cache
3. **Check database**: Verify content was saved by viewing it in Content Manager

### Image Upload Issues

1. **Check file size**: Ensure image is under 5MB
2. **Check file format**: Use JPG, PNG, or WebP
3. **Check permissions**: Ensure you have admin access
4. **Try again**: Sometimes uploads fail due to network issues

### Form Validation Errors

1. **Fill all required fields**: Fields marked with * are required
2. **Check content format**: For structured sections, ensure proper JSON format
3. **Check for special characters**: Some characters may cause issues

---

## Support

If you encounter any issues:

1. Check the browser console for error messages (F12)
2. Review the admin panel error messages
3. Ensure you're logged in with admin credentials
4. Try refreshing the page

---

**Last Updated**: 2025-10-24
**Status**: ✅ All Sections Editable

