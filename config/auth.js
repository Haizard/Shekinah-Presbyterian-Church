const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, email = null) => {
  // Create payload with id and email if available
  const payload = {
    id: id.toString(), // Convert ObjectId to string
  };

  // Add email to payload if provided
  if (email) {
    payload.email = email;
  }

  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'shekinah_presbyterian_church_secret_key',
    {
      expiresIn: '30d',
    }
  );
};

module.exports = { generateToken };
