import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  HomeIcon,
  LogOut,
  MenuIcon,
  PenBox,
  User2Icon,
  BookOpen,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ToggleTheme } from "./ToggleTheme";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/features/authSlice";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

const MobileNavigation = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      dispatch(logoutUser());
      navigate("/login");
      toast.success("Logged out successfully");
      setOpen(false);
    } catch (error) {
      console.log("Logout Error:", error);
      toast.error("Logout failed");
    }
    setLoading(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavItem = ({ to, icon, label }) => {
    const active = isActive(to);

    return (
      <Link to={to} className="w-full" onClick={() => setOpen(false)}>
        <div
          className={`flex items-center py-3 px-4 rounded-xl mb-1 transition-all duration-200 ${
            active
              ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 font-medium"
              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
          }`}
        >
          <div
            className={`${
              active
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "bg-zinc-100 dark:bg-zinc-800"
            } p-2 rounded-lg`}
          >
            {icon}
          </div>
          <span className="ml-3 text-base">{label}</span>
          {active && (
            <div className="ml-auto w-1.5 h-5 rounded-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="block md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full w-10 h-10 hover:bg-zinc-100 dark:hover:bg-zinc-800/70"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="p-0 max-w-[85%] border-r border-zinc-200 dark:border-zinc-800 shadow-xl"
        >
          <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
            {/* Header */}
            <SheetHeader className="p-4 flex-row justify-between items-center border-b border-zinc-100 dark:border-zinc-800">
              <SheetTitle className="font-pacifico text-2xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Blogify
              </SheetTitle>
              <div className="flex items-center gap-2">
                <ToggleTheme />
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full w-8 h-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </SheetHeader>

            {/* Navigation */}
            <div className="flex-1 overflow-auto py-4 px-3">
              <div className="mb-3 px-2">
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                  Navigation
                </h3>
              </div>
              <nav className="flex flex-col relative space-y-1">
                {isAuthenticated ? (
                  <>
                    <NavItem
                      to="/"
                      icon={<HomeIcon className="h-5 w-5" />}
                      label="Home"
                    />
                    <NavItem
                      to="/all-blogs"
                      icon={<BookOpen className="h-5 w-5" />}
                      label="All Blogs"
                    />
                    <NavItem
                      to="/create"
                      icon={<PenBox className="h-5 w-5" />}
                      label="Write Blog"
                    />
                    <NavItem
                      to="/profile"
                      icon={<User2Icon className="h-5 w-5" />}
                      label="My Profile"
                    />
                  </>
                ) : (
                  <>
                    <NavItem
                      to="/"
                      icon={<HomeIcon className="h-5 w-5" />}
                      label="Home"
                    />
                    <NavItem
                      to="/all-blogs"
                      icon={<BookOpen className="h-5 w-5" />}
                      label="All Blogs"
                    />
                    <NavItem
                      to="/register"
                      icon={<User2Icon className="h-5 w-5" />}
                      label="Register"
                    />
                    <NavItem
                      to="/login"
                      icon={<User2Icon className="h-5 w-5" />}
                      label="Login"
                    />
                  </>
                )}
              </nav>
            </div>

            {/* Logout button */}
            {isAuthenticated && (
              <div className="px-4 py-4 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl py-6 shadow-sm transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Logging out...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <LogOut className="mr-2 h-5 w-5" />
                      Logout
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* Footer */}
            <SheetFooter className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-start">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                © Made by Ankit Tiwari
              </span>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
