import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftCircle,
  Loader,
  BookOpenText,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";

import BlogCard from "@/components/BlogCard";
import ProfileCard from "@/components/ProfileCard"; // Make sure this points to your new ProfileCard
import { userProfile } from "@/features/authSlice";

function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePreviousPageClick = () => {
    navigate(-1);
  };

  // Fetch user profile on component mount
  useEffect(() => {
    dispatch(userProfile());
  }, [dispatch]);

  const { user, loading } = useSelector((state) => state.auth);

  // Format date for profile display
  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Format the blog data from the API response
  const blogs =
    user?.blogs?.map((blog) => ({
      id: blog.id,
      title: blog.title,
      description: blog.content.substring(0, 120) + "...",
      image: blog.coverImage,
      slug: blog.slug,
      date: new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      published: blog.published,
    })) || [];

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="flex flex-col items-center gap-4 text-zinc-600 dark:text-zinc-400">
          <Loader className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-lg font-medium animate-pulse">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Removed Toaster component */}

      {/* Back button and page title */}
      <div className="mb-12">
        <button
          onClick={handlePreviousPageClick}
          className="group flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        >
          <ArrowLeftCircle className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-3xl md:text-4xl font-bold mt-4 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
          My Profile
        </h1>
      </div>

      <div className="flex flex-col gap-16">
        {/* Profile card section */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-2xl">
            <ProfileCard user={user} formattedDate={formattedDate} />
          </div>
        </div>

        {/* Blogs section */}
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-8">
            <BookOpenText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl md:text-3xl font-bold">My Blogs</h2>
          </div>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="transform hover:-translate-y-1 transition-transform duration-200"
                >
                  <BlogCard data={blog} isUserBlog={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-xl p-8 text-center">
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                You haven't published any blogs yet.
              </p>
              <button
                onClick={() => navigate("/create-blog")}
                className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Your First Blog
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
