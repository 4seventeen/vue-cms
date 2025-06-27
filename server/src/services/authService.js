const supabase = require('../../config/supabase');
const jwt = require('jsonwebtoken');

// Create a new user using Supabase Auth
const createUser = async (email, password) => {
  try {
    console.log('=== SIGNUP ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('Supabase URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing');
    console.log('Supabase Key:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing');
    
    // Use Supabase Auth to create user
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    console.log('Supabase response data:', data);
    console.log('Supabase response error:', error);

    if (error) {
      console.error('Signup error:', error);
      throw new Error(error.message);
    }

    console.log('User created successfully:', data.user?.id);
    console.log('=== SIGNUP SUCCESS ===');
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Signup exception:', error);
    console.log('=== SIGNUP FAILED ===');
    throw new Error(error.message);
  }
};

// Authenticate user using Supabase Auth
const authenticateUser = async (email, password) => {
  try {
    console.log('=== SIGNIN ATTEMPT ===');
    console.log('Email:', email);
    
    // Use Supabase Auth to sign in (following Supabase docs)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    console.log('Supabase signin response data:', data);
    console.log('Supabase signin response error:', error);

    if (error) {
      console.error('Supabase auth error:', error);
      throw new Error(error.message);
    }

    console.log('User authenticated successfully:', data.user?.id);
    console.log('=== SIGNIN SUCCESS ===');
    
    // Return the Supabase session and user data
    return { 
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error('Authentication exception:', error);
    console.log('=== SIGNIN FAILED ===');
    throw new Error(error.message);
  }
};

module.exports = {
  createUser,
  authenticateUser,
};
