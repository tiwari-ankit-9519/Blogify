import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BarChart,
  UsersIcon,
  FileTextIcon,
  TagIcon,
  MessageSquareIcon,
  HomeIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Moon,
  Sun,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { logoutUser } from "@/features/authSlice";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/themeProvider";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signOut } = useAuth();
  const { session } = useAuth();
  const { setTheme } = useTheme();

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      if (!session) {
        console.log("User is signed out");
      }
      dispatch(logoutUser());
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (err) {
      console.log(err);
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { path: "/admin", icon: <HomeIcon size={20} />, label: "Overview" },
    { path: "/admin/users", icon: <UsersIcon size={20} />, label: "Users" },
    { path: "/admin/blogs", icon: <FileTextIcon size={20} />, label: "Blogs" },
    {
      path: "/admin/categories",
      icon: <TagIcon size={20} />,
      label: "Categories",
    },
    {
      path: "/admin/comments",
      icon: <MessageSquareIcon size={20} />,
      label: "Comments",
    },
    {
      path: "/admin/analytics",
      icon: <BarChart size={20} />,
      label: "Analytics",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold">Blog Admin</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-800"
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon size={20} />
            ) : (
              <ChevronRightIcon size={20} />
            )}
          </button>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 ${
                location.pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-gray-800 dark:hover:bg-gray-800"
              } transition-colors`}
            >
              <span className="mr-3">{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}

          {/* Theme Toggle */}
          {isSidebarOpen ? (
            <div className="px-4 py-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="focus-within:ring-0 focus-visible:ring-0 focus:outline-none bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600"
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <button
              onClick={() =>
                setTheme(
                  document.documentElement.classList.contains("dark")
                    ? "light"
                    : "dark"
                )
              }
              className="flex items-center justify-center p-3 w-full hover:bg-gray-800 transition-colors"
            >
              <span className="dark:hidden">
                <Sun size={20} />
              </span>
              <span className="hidden dark:block">
                <Moon size={20} />
              </span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 w-full text-left hover:bg-gray-800 dark:hover:bg-gray-800 transition-colors mt-10 text-red-400"
          >
            <span className="mr-3">
              <LogOutIcon size={20} />
            </span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700/20">
          <div className="px-4 py-3 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {menuItems.find((item) => item.path === location.pathname)
                ?.label || "Dashboard"}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span className="text-gray-700 dark:text-gray-300">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
