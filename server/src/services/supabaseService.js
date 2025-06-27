const supabase = require('../../config/supabase');

// Test Supabase connection
async function testConnection() {
  try {
    // Test basic connection by getting auth user (will be null if not authenticated)
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(`Supabase connection error: ${error.message}`);
    }
    
    return { success: true, message: 'Supabase connection working!', user: user };
  } catch (error) {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }
}

/**
 * Get current authenticated user
 */
async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw new Error(`Error fetching current user: ${error.message}`);
  }
  
  return user;
}

/**
 * Get all users from auth.users (admin function)
 * Note: This requires admin privileges in Supabase
 */
async function getAllUsers() {
  // This would require admin API access
  // For now, we'll return an empty array since we can't access auth.users directly
  return [];
}

/**
 * Get a user by ID from auth.users (admin function)
 */
async function getUserById(id) {
  // This would require admin API access
  // For now, we'll return null
  return null;
}

/**
 * Create a new user using Supabase Auth
 */
async function createUser(userData) {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        username: userData.username
      }
    }
  });

  if (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }

  return data.user;
}

/**
 * Update current user metadata
 */
async function updateUser(updates) {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  });

  if (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }

  return data.user;
}

/**
 * Delete current user
 */
async function deleteUser() {
  const { error } = await supabase.auth.admin.deleteUser();
  
  if (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }

  return true;
}

/**
 * Example: Fetch data from any table
 */
async function fetchData(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
    throw error;
  } else {
    console.log('Data:', data);
    return data;
  }
}

module.exports = {
  testConnection,
  getCurrentUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  fetchData
}; 