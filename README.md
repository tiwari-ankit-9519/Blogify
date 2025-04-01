# Blog Management System

A full-stack web application for blog management with a robust admin dashboard, user authentication, and content management capabilities.

## 🚀 Features

### 📝 Blog Management
- Create, read, update, and delete blog posts
- Rich content editing with image uploads
- Categories and tags for better organization
- Blog post publishing and draft management
- Like system for engagement tracking

### 👥 User Management
- User registration and authentication
- Social login integration (via Clerk)
- User profile management with image uploads
- Role-based access control (User, Admin)

### 💬 Comments
- Comment on blog posts
- Nested replies to comments
- Comment moderation for administrators

### 🎛️ Admin Dashboard
- Modern, responsive admin interface
- Comprehensive analytics and statistics
- User management with role editing
- Content moderation tools
- Category management
- Comment moderation

## 🛠️ Technology Stack

### Frontend
- **React** - UI library
- **Redux** - State management
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Prisma** - ORM for database access
- **Clerk** - Authentication provider

## 🏗️ Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # Admin dashboard components
│   │   │   │   ├── shared/      # Shared admin UI components
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── BlogsManagement.jsx
│   │   │   │   ├── CategoriesManagement.jsx
│   │   │   │   ├── CommentsManagement.jsx
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── DashboardOverview.jsx
│   │   │   │   └── UsersManagement.jsx
│   │   │   └── ... # Other components
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── BlogDetails.jsx
│   │   │   ├── AllBlogs.jsx
│   │   │   └── ... # Other pages
│   │   ├── redux/
│   │   │   ├── adminSlice.js    # Admin state management
│   │   │   └── ... # Other slices
│   │   └── utils/
│   │       └── axiosInstance.js  # API client configuration
│   │
├── backend/
│   ├── config/
│   │   └── upload.js            # File upload configuration
│   ├── controllers/
│   │   ├── admin.controller.js  # Admin functionality handlers
│   │   ├── auth.controller.js   # Authentication handlers
│   │   ├── blog.controller.js   # Blog functionality handlers
│   │   └── comment.controller.js# Comment functionality handlers
│   ├── middlewares/
│   │   ├── errorMiddleware.js   # Error handling middleware
│   │   └── isLoggedIn.js        # Authentication middleware
│   ├── routes/
│   │   ├── admin.routes.js      # Admin API routes
│   │   ├── auth.routes.js       # Authentication routes
│   │   ├── blog.routes.js       # Blog-related routes
│   │   └── comment.routes.js    # Comment-related routes
│   └── index.js                 # Entry point for the backend application
```

## 🔄 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/update-profile` - Update user profile

### 📝 Blog Management
- `POST /api/blogs/create-blog` - Create a new blog post
- `GET /api/blogs/all` - Get all blogs
- `GET /api/blogs/blog/:slug` - Get a specific blog post
- `PUT /api/blogs/update/:slug` - Update a blog post
- `DELETE /api/blogs/delete/:slug` - Delete a blog post
- `GET /api/blogs/search` - Search for blogs
- `GET /api/blogs/latest-blogs` - Get latest blogs
- `GET /api/blogs/trending` - Get trending blogs
- `GET /api/blogs/related-blogs/:slug` - Get related blogs
- `POST /api/blogs/blog/like/:slug` - Toggle like on a blog
- `GET /api/blogs/blog/like-status/:slug` - Get like status for blog

### 💬 Comments
- `POST /api/comments/blogs/:slug/comments` - Create a comment
- `DELETE /api/comments/comments/:commentId` - Delete a comment
- `GET /api/comments/comments/:commentId/replies` - Get comment replies

### 👑 Admin Routes
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:userId` - Get user by ID
- `PUT /api/admin/users/:userId` - Update user
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/blogs` - Get all blogs (admin view)
- `GET /api/admin/blogs/:blogId` - Get blog by ID
- `PUT /api/admin/blogs/:blogId/publish` - Toggle blog publish status
- `DELETE /api/admin/blogs/:blogId` - Delete blog
- `GET /api/admin/categories` - Get all categories
- `GET /api/admin/categories/:categoryId` - Get category by ID
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:categoryId` - Update category
- `DELETE /api/admin/categories/:categoryId` - Delete category
- `GET /api/admin/comments` - Get all comments
- `GET /api/admin/comments/:commentId` - Get comment by ID
- `DELETE /api/admin/comments/:commentId` - Delete comment
- `GET /api/admin/analytics` - Get system analytics

## 📊 Admin Dashboard

The admin dashboard provides a comprehensive interface for managing the entire blog platform:

### 📈 Overview
- Key metrics and statistics
- Recent activity tracking
- Popular content insights

### 👥 User Management
- View and filter all users
- Change user roles
- Delete users when necessary
- User content engagement metrics

### 📚 Blog Management
- View all blog posts
- Filter by status (published/draft) and category
- Publish/unpublish content
- Delete inappropriate content

### 🏷️ Category Management
- Create and manage blog categories
- Track category usage statistics
- Edit category names

### 💬 Comment Moderation
- Review all comments
- Delete inappropriate content
- View comment context and associated blogs

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Database (PostgreSQL recommended)

### Live Backend
The backend API is already hosted at:
```
https://blog-website-production-7c9c.up.railway.app/api
```

### Live Backend
The frontend is already hosted at:
```
https://graceful-swan-6fba70.netlify.app/
```

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd frontend
   npm install
   ```

4. Configure environment variables (create .env files in both directories)
   - Backend .env:
     ```
     PORT=5000
     DATABASE_URL=<your-database-connection-string>
     JWT_SECRET=<your-jwt-secret>
     CLERK_SECRET_KEY=<your-clerk-secret-key>
     ```
   - Frontend .env:
     ```
     VITE_API_URL=https://blog-website-production-7c9c.up.railway.app/api
     VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
     ```

5. Start the backend
   ```bash
   cd backend
   npm run dev
   ```

6. Start the frontend
   ```bash
   cd frontend
   npm run dev
   ```

## 🛡️ Security Features

- JWT authentication
- Role-based access control
- Middleware protection for secure routes
- Password encryption
- CORS protection
- Error handling middleware

## 🎨 UI/UX Features

- Responsive design for all devices
- Modern, clean aesthetics with Tailwind CSS
- Intuitive navigation throughout the application
- Loading states with appropriate feedback
- Error handling with user-friendly messages
- Confirmation dialogs for destructive actions

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
