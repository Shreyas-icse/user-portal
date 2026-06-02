const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expected format: Bearer <token>

  if (!authHeader || !token) {
    return res.status(401).json({ msg: 'Authorization header malformed or missing (worker)' });
  }

  try {
    // Verify token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to req.worker (not req.user, to avoid conflict)
    req.worker = decoded;

    next(); // Proceed to controller
  } catch (err) {
    console.error('Worker auth middleware error:', err);
    res.status(401).json({ msg: 'Invalid or expired token (worker)' });
  }
};
