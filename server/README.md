# Full-Stack Signup App Setup Guide

## 1. Install PostgreSQL Locally
- Download and install PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- During setup, set a password for the `postgres` user and remember it.

## 2. Create the Database
- Open the PostgreSQL shell or use a GUI (like pgAdmin).
- Run:
  ```sql
  CREATE DATABASE your_db_name;
  CREATE USER your_db_user WITH PASSWORD 'your_db_password';
  GRANT ALL PRIVILEGES ON DATABASE your_db_name TO your_db_user;
  ```
- Replace `your_db_name`, `your_db_user`, and `your_db_password` as desired.

## 3. Configure Environment Variables
- In the `server/` directory, create a `.env` file:
  ```env
  DB_HOST=localhost
  DB_NAME=your_db_name
  DB_USER=your_db_user
  DB_PASS=your_db_password
  PORT=3000
  ```

## 4. Install Dependencies
- In the project root:
  ```sh
  cd server
  npm install
  cd ../client
  npm install
  ```

## 5. Run the Backend
- In `server/`:
  ```sh
  npm run dev
  # or
  node index.js
  ```

## 6. Run the Frontend
- In `client/`:
  ```sh
  npm run dev
  ```
- The app will be at [http://localhost:5173](http://localhost:5173)

## 7. Verify Connection and Signup
- Open the app in your browser.
- Try signing up with a new username and password.
- If successful, you will see a success message.
- Duplicate usernames will show an error.

## Notes
- The backend seeds a sample user: `testuser` / `testpass` on first run if the user table is empty.
- Passwords are securely hashed with bcrypt.
- CORS is enabled for the frontend dev server. 