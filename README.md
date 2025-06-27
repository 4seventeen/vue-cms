# Vue CMS - Monorepo

<<<<<<< Updated upstream
=======
A modern Vue.js CMS with Express backend, featuring a clean, modular, and scalable architecture.

## 🏗️ Project Structure

```
vue-cms/
├── client/               # Vue 3 SPA Frontend
│   ├── src/
│   │   ├── assets/       # Static files (images, fonts, etc.)
│   │   ├── components/
│   │   │   ├── common/   # Reusable UI components
│   │   │   └── case/     # Case-specific components
│   │   ├── views/        # Page-level Vue components
│   │   ├── router/       # Vue Router configuration
│   │   ├── services/     # API service layer
│   │   ├── utils/        # Helper functions
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
├── server/               # Express + PostgreSQL Backend
│   ├── src/
│   │   ├── config/       # Database and environment configs
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API route definitions
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Helper functions
│   │   └── index.js      # App entry point
│   └── package.json
└── package.json          # Root package.json with scripts
```

## 🛠️ Tech Stack

### Frontend

- **Vue.js 3** - Progressive JavaScript framework
- **Vuetify 3** - Material Design component library
- **Vue Router 4** - Official router for Vue.js
- **Axios** - HTTP client for API calls

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database operations
- **bcrypt** - Password hashing
- **JWT** - JSON Web Tokens for authentication

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vue-cms
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Environment Setup**

   Create `.env` file in the `server/` directory:

   ```env
   PORT=3000
   DATABASE_URL=postgresql://username:password@localhost:5432/vue_cms
   JWT_SECRET=your-secret-key-here
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb vue_cms
   ```

### Development

**Start both frontend and backend in development mode:**

```bash
npm run dev
```

**Start only frontend:**

```bash
npm run dev:client
```

**Start only backend:**

```bash
npm run dev:server
```

### Production

**Build frontend:**

```bash
npm run build
```

**Start production server:**

```bash
npm start
```

## 📁 Architecture Overview

### Frontend Architecture

- **Views**: Page-level components (Home, About, Signin, Signup, Dashboard)
- **Components**: Reusable UI components organized by purpose
- **Services**: API communication layer using Axios
- **Router**: Vue Router configuration with navigation guards
- **Utils**: Helper functions and utilities

### Backend Architecture

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and data processing
- **Models**: Database schema definitions using Sequelize
- **Routes**: API endpoint definitions
- **Middleware**: Authentication, validation, and error handling
- **Utils**: Helper functions for encryption, validation, etc.

## 🔐 Authentication

The application uses JWT-based authentication:

1. **Signup**: Creates new user with hashed password
2. **Signin**: Validates credentials and returns JWT token
3. **Protected Routes**: Require valid JWT token in Authorization header

## 🎯 Key Features

- ✅ Clean, modular monorepo structure
- ✅ Separation of concerns (MVC pattern)
- ✅ Reusable components and services
- ✅ JWT authentication
- ✅ PostgreSQL database with Sequelize ORM
- ✅ Modern Vue 3 Composition API
- ✅ Material Design UI with Vuetify
- ✅ Responsive design
- ✅ Production-ready configuration

## 🧪 Testing

To run tests (when implemented):

```bash
npm test
```

## 📦 Deployment

### Frontend Deployment

The Vue.js frontend can be deployed to:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Backend Deployment

The Express.js backend can be deployed to:

- Heroku
- AWS EC2
- DigitalOcean
- Railway
- Any Node.js hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code structure and comments

---

**Happy Coding! 🚀**
>>>>>>> Stashed changes
