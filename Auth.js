const jwt = require('jsonwebtoken');
const User = require('./User');

//
// 🔑 Generate JWT token
//
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret_key_course_net',
    { expiresIn: '7d' } // token berlaku 7 hari
  );
};

//
// 🔒 Middleware verify JWT
//
const verifyToken = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret_key_course_net'
    );
    req.user = decoded; // menyimpan info id & role user di request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
