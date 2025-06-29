require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/caseRoutes');
const supabaseRoutes = require('./src/routes/supabase');
const supabase = require('./config/supabase');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', caseRoutes);
app.use('/api/supabase', supabaseRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Test Supabase connection by checking auth service
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log('Supabase connection test:', error.message);
      console.log('Note: This is normal if no user is authenticated');
    } else {
      console.log('✅ Supabase connected successfully');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔗 Auth endpoints:`);
      console.log(`   - POST /api/signup - Create new user`);
      console.log(`   - POST /api/signin - Sign in user`);
      console.log(`   - GET  /api/user - Get current user (protected)`);
      console.log(`🔗 Case endpoints:`);
      console.log(`   - GET    /api/cases - Get user's cases`);
      console.log(`   - GET    /api/cases/:id - Get specific case`);
      console.log(`   - POST   /api/cases - Create new case`);
      console.log(`   - PUT    /api/cases/:id - Update case description`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

start(); 