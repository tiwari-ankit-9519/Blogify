import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  HomeIcon,
  LogOut,
  PenBox,
  Power,
  User2Icon,
  UserPlus,
  BookOpen,
} from "lucide-react";
import { ToggleTheme } from "./ToggleTheme";
import MobileNavigation from "./MobileNavigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/features/authSlice";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const navigate = useNavigate();
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

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 md:px-8 lg:px-[9.5%]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="font-pacifico text-2xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Blogify
          </span>
        </Link>

        <div className="items-center gap-6 font-inter hidden md:flex">
          <Link
            to="/"
            className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-2"
          >
            <HomeIcon className="w-4 h-4" />
            Home
          </Link>

          <Link
            to="/all-blogs"
            className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            All Blogs
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/create">
                <Button
                  variant="ghost"
                  className="rounded-full flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  <PenBox className="w-4 h-4" />
                  Write
                </Button>
              </Link>

              <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-700"></div>

              <div className="flex items-center gap-3">
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <User2Icon className="w-5 h-5" />
                  </Button>
                </Link>

                <Button
                  onClick={handleLogout}
                  className="rounded-full bg-red-500/90 hover:bg-red-600 text-white px-4"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Logging out...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/register">
                <Button
                  variant="ghost"
                  className="rounded-full flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Button>
              </Link>

              <Link to="/login">
                <Button className="rounded-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Power className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            </div>
          )}

          <div className="pl-1">
            <ToggleTheme />
          </div>
        </div>

        <div className="md:hidden">
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
