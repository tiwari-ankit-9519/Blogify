import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { useSelector } from "react-redux";
import AuthCallback from "./components/AuthCallback";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import CreateBlog from "./pages/CreateBlog";
import BlogDetailsPage from "./pages/BlogDetails";
import ErrorPage from "./components/ErrorPage";
import AllBlogs from "./pages/AllBlogs";

// Admin Components
import AdminDashboard from "@/pages/admin/AdminDashboard";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isAdmin = isAuthenticated && user?.role === "ADMIN";
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div>
      {/* Only show Navbar on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/blog/:slug" element={<BlogDetailsPage />} />
        <Route path="/all-blogs" element={<AllBlogs />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Auth Routes */}
        <Route
          path="/register"
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        />

        {/* Authenticated User Routes */}
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/create"
          element={isAuthenticated ? <CreateBlog /> : <Navigate to="/login" />}
        />

        {/* Admin Routes - Using AdminDashboard with nested routes */}
        <Route
          path="/admin/*"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        {/* 404 Route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
