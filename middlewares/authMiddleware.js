const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).send('Access Denied');

  // Check if the token is in Bearer format
  const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, 'SECRET_KEY');
    req.user = verified; // Attach verified payload to request
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};
