const { User } = require("../models");

// Create a new user
const createUser = async (username, password) => {
  const existing = await User.findOne({ where: { username } });
  if (existing) {
    throw new Error("Username already exists");
  }

  // Create user (password will be hashed by the model hook)
  await User.create({ username, password });
  return { success: true };
};

// Authenticate user
const authenticateUser = async (username, password) => {
  const user = await User.findOne({ where: { username } });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await user.validPassword(password);

  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  return { user };
};

// Get user by ID
const getUserById = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

module.exports = {
  createUser,
  authenticateUser,
  getUserById,
};
