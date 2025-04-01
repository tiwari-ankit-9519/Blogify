import React from "react";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({
  statusCode = 404,
  title = "Page Not Found",
  message = "We couldn't find the page you're looking for.",
}) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  const refresh = () => {
    window.location.reload();
  };

  return (
    <div className="relative w-full min-h-screen flex items-center bg-gradient-to-br from-white via-purple-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full opacity-30 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full opacity-20 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            {statusCode}
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto mb-8"
        >
          {message}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Button
            onClick={goBack}
            variant="outline"
            className="group relative overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-500 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
              Go Back
            </span>
          </Button>
          <Button
            onClick={goHome}
            className="group flex items-center justify-center text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            <Home className="mr-2 h-4 w-4" />
            Home Page
          </Button>
          <Button
            onClick={refresh}
            variant="outline"
            className="group relative overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-500 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center">
              <RefreshCw className="mr-2 h-4 w-4 group-hover:animate-spin" />
              Refresh
            </span>
          </Button>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 max-w-md mx-auto"
        >
          <div className="relative w-full p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mt-4 mb-2">
              Lost your way?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm">
              Don't worry, it happens to the best of us. You can return to the
              previous page, go back to the homepage, or try refreshing the
              page.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
