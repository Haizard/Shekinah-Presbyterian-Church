const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'shekinah_presbyterian_church_secret_key', {
    expiresIn: '30d',
  });
};

module.exports = { generateToken };
