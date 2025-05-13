# Finance Role Documentation

This document explains how to set up and use the Finance role in the Church Management System.

## Overview

The Finance role is a specialized user role that has access only to finance-related features in the system. Users with the Finance role can:

- View and manage financial transactions
- Generate financial reports
- Manage budgets
- Access finance-related data across all church branches

## Setting Up a Finance User

### Method 1: Using the Admin Panel (Coming Soon)

In the future, administrators will be able to create Finance users directly from the admin panel.

### Method 2: Using the Script

1. Make sure MongoDB is running
2. Open a terminal in the project root directory
3. Run the following command:

```bash
node scripts/create-finance-user.js
```

This will create a finance user with the following credentials:
- Email: finance@shekinah.org
- Password: finance123

### Method 3: Manual Registration

1. Register a new user through the registration form
2. Access the MongoDB database directly
3. Update the user's role to 'finance'

Example MongoDB command:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "finance" } }
)
```

## Accessing Finance Features

1. Log in with a finance user account
2. You will be directed to the Finance Dashboard
3. The sidebar will only show finance-related menu items

## Finance User Permissions

Finance users can:
- View all financial transactions
- Add new transactions
- Edit existing transactions
- Delete transactions
- Generate financial reports
- View financial data across all branches

Finance users cannot:
- Access member management features
- Access group management features
- Access content management features
- Create or manage church branches
- Access system administration features

## Technical Implementation

The Finance role is implemented using:

1. A role field in the User model
2. A finance middleware that checks for the finance role
3. A FinanceLayout component that shows only finance-related menu items
4. Role-based routing in the frontend

## Troubleshooting

If you encounter issues with the Finance role:

1. Verify that the user has the correct role in the database
2. Check that the JWT token includes the role information
3. Ensure that the finance middleware is applied to all finance-related routes
4. Verify that the frontend is correctly checking the user's role

## Security Considerations

- Finance users have access to sensitive financial data
- Always use strong passwords for finance user accounts
- Regularly audit finance user activities
- Consider implementing additional security measures like two-factor authentication
