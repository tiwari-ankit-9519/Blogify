import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginBgImage from "../assets/Tablet login-amico.png";
import { Loader, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/features/authSlice";
import toast from "react-hot-toast";
import GoogleSignInButton from "@/components/GoogleSignInButton";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(loginUser(userData))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        console.log(res?.user?.role);
        if (res?.user?.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] lg:flex bg-gradient-to-br from-white via-purple-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 overflow-hidden">
      {/* Subtle Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full opacity-30 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full opacity-20 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Login Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 p-6 lg:p-12 flex items-center justify-center relative z-10"
      >
        <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Blogify
              </span>{" "}
              👋
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300 mb-6">
              Sign in to continue your learning journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-zinc-500" />
                Email
              </Label>
              <Input
                name="email"
                type="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full rounded-lg border-zinc-300 dark:border-zinc-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="flex items-center gap-2 mb-2"
              >
                <Lock className="w-4 h-4 text-zinc-500" />
                Password
              </Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={userData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border-zinc-300 dark:border-zinc-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-purple-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader className="animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-300 mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-purple-600 hover:underline font-semibold"
              >
                Register Now
              </Link>
            </p>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <hr className="w-full border-zinc-300 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-zinc-800 px-4 text-zinc-500">
                OR
              </span>
            </div>
          </div>

          <GoogleSignInButton />
        </div>
      </motion.div>

      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative"
      >
        <div className="w-full max-w-xl">
          <img
            src={loginBgImage}
            alt="Login Illustration"
            className="w-full h-auto object-contain transform transition-transform duration-300 hover:scale-105"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
