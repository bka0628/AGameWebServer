const { sign, verify } = require('jsonwebtoken');

const KEY = 'secret';

const createJSONToken = (userId) => {
  return sign({ userId }, KEY, { expiresIn: '1h' });
};

const verifyJSONToken = (token) => {
  return verify(token, KEY);
};

const JSONTokenExpiredError = () => {
  return jwt.TokenExpiredError;
};

exports.createJSONToken = createJSONToken;
exports.verifyJSONToken = verifyJSONToken;
exports.JSONTokenExpiredError = JSONTokenExpiredError;
