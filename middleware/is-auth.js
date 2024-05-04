const { verifyJSONToken, JSONTokenExpiredError } = require('../config/auth');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = verifyJSONToken(token);
  } catch (err) {
    if (err instanceof JSONTokenExpiredError) {
      return res
        .status(401)
        .json({ message: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ message: 'Token invalid.' });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  req.userId = decodedToken.userId;
  next();
};
