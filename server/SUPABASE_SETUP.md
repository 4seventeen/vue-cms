# Supabase Database Setup Guide

## Overview
Your application has been configured to work with Supabase (which is built on PostgreSQL). The configuration supports both Supabase and local PostgreSQL for development flexibility.

## Environment Variables

Create a `.env` file in your `server` directory with the following variables:

```env
# Supabase Database Configuration
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
SUPABASE_DB_HOST=db.[YOUR-PROJECT-REF].supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=[YOUR-PASSWORD]

# Fallback to old PostgreSQL config (optional)
DB_NAME=your_database_name
DB_USER=your_username
DB_PASS=your_password
DB_HOST=localhost

# Environment
NODE_ENV=development

# JWT Secret (if you're using authentication)
JWT_SECRET=your_jwt_secret_here
```

## Getting Supabase Connection Details

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > Database
4. Find your connection details:
   - Host: `db.[YOUR-PROJECT-REF].supabase.co`
   - Database name: `postgres`
   - Port: `5432`
   - User: `postgres`
   - Password: (found in the database settings)

## Key Changes Made

1. **SSL Support**: Added SSL configuration for production environments
2. **Environment Variables**: Updated to use Supabase-specific variables with fallbacks
3. **Port Configuration**: Added explicit port configuration (default: 5432)

## Testing the Connection

Run your server and check if the database connection is successful:

```bash
cd server
npm run dev
```

## Notes

- The configuration will automatically use SSL in production environments
- You can still use local PostgreSQL for development by setting the fallback variables
- Supabase is PostgreSQL-compatible, so no changes to your models or queries are needed 