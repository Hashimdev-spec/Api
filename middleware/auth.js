const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'you are not an admin so no access for you! ' });
  next();
};

module.exports = { authenticate, authorizeAdmin };
