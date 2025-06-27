const bcrypt = require("bcrypt");

// Hash a password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare a password with a hash
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generate a random string for tokens
const generateRandomString = (length = 32) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateRandomString,
};
