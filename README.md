# Project Management Tool - Admin Frontend

A modern React-based project management application with comprehensive user management for administrators.

## 🚀 Features

- **Admin Authentication** - Secure login with JWT tokens
- **User Management** - Create, view, update, and delete users
- **Role Management** - Assign and remove roles from users
- **Admin Dashboard** - Overview of users and roles
- **Project Management** - Create and manage projects
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

- **React 19** - Latest React with modern features
- **Redux Toolkit** - State management with RTK Query
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client with interceptors
- **Vite** - Fast build tool and dev server

## 📁 Project Structure

```
src/
├── components/
│   ├── Admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── UserManagement.jsx
│   │   └── UserForm.jsx
│   ├── Auth/
│   │   └── LoginForm.jsx
│   ├── Layout/
│   │   └── Navbar.jsx
│   └── Projects/
│       ├── ProjectForm.jsx
│       └── ProjectsList.jsx
├── store/
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── usersSlice.js
│   │   ├── projectsSlice.js
│   │   └── tasksSlice.js
│   └── index.js
├── services/
│   └── api.js
└── App.jsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pms-frontend-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📚 Documentation

- Development Guide: [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)
- AI Prompt Library: [docs/AI_PROMPT_LIBRARY.md](docs/AI_PROMPT_LIBRARY.md)

## 📋 API Endpoints

The application expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/validate` - Validate JWT token

### User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/roles` - Get all roles
- `POST /api/users/{userId}/roles/{roleId}` - Assign role to user
- `DELETE /api/users/{userId}/roles/{roleId}` - Remove role from user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## 🔐 Authentication

The app uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in API requests via axios interceptors.

## 👥 Admin Features

### User Management
- **Create Users** - Add new users with full details
- **Edit Users** - Update user information and passwords
- **Delete Users** - Remove users from the system
- **User Status** - Activate/deactivate users
- **Role Assignment** - Assign and remove roles from users

### Role Management
- **View Roles** - See all available roles
- **Role Assignment** - Assign roles to users
- **Role Removal** - Remove roles from users

### Dashboard
- **User Statistics** - Total users, active users, roles
- **Role Overview** - Users by role distribution
- **Recent Users** - Latest user activity

## 🎨 Styling

Currently using inline styles for simplicity. Consider adding a CSS framework like Tailwind CSS or Material-UI for production use.

## 🚧 Next Steps

- [ ] Add role-based access control (RBAC)
- [ ] Implement user profile management
- [ ] Add audit logs for user actions
- [ ] Integrate with a UI framework
- [ ] Add real-time notifications
- [ ] Implement file uploads
- [ ] Add project templates
- [ ] Create team collaboration features
- [ ] Add user activity tracking
- [ ] Implement password reset functionality

## 📝 License

This project is licensed under the MIT License.
