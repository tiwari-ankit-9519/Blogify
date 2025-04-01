import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSystemAnalytics } from "@/features/adminSlice";
import {
  UsersIcon,
  FileTextIcon,
  TagIcon,
  MessageSquareIcon,
} from "lucide-react";

import StatsCard from "./StatsCard";

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const { stats, popularBlogs, activeUsers, recentComments, loading } =
    useSelector((state) => state.admin.analytics);

  useEffect(() => {
    dispatch(getSystemAnalytics());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading analytics...
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.users}
          icon={<UsersIcon size={20} className="text-white" />}
          color="bg-blue-500"
        />
        <StatsCard
          title="Total Blogs"
          value={stats.blogs}
          icon={<FileTextIcon size={20} className="text-white" />}
          color="bg-green-500"
        />
        <StatsCard
          title="Total Comments"
          value={stats.comments}
          icon={<MessageSquareIcon size={20} className="text-white" />}
          color="bg-yellow-500"
        />
        <StatsCard
          title="Total Categories"
          value={stats.categories}
          icon={<TagIcon size={20} className="text-white" />}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Blogs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
            Popular Blogs
          </h3>
          <div className="space-y-4">
            {popularBlogs.map((blog) => (
              <div
                key={blog.id}
                className="border-b dark:border-gray-700 pb-3 last:border-0"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium dark:text-gray-200">
                    {blog.title}
                  </h4>
                  <div className="flex space-x-3 text-sm">
                    <span className="flex items-center text-blue-600 dark:text-blue-400">
                      <MessageSquareIcon size={14} className="mr-1" />
                      {blog._count.comments}
                    </span>
                    <span className="flex items-center text-red-500 dark:text-red-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {blog._count.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
            Active Users
          </h3>
          <div className="space-y-4">
            {activeUsers.map((user) => (
              <div
                key={user.id}
                className="border-b dark:border-gray-700 pb-3 last:border-0"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 mr-3">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium dark:text-gray-200">
                        {user.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3 text-sm">
                    <span className="flex items-center text-green-600 dark:text-green-400">
                      <FileTextIcon size={14} className="mr-1" />
                      {user._count.blogs}
                    </span>
                    <span className="flex items-center text-blue-600 dark:text-blue-400">
                      <MessageSquareIcon size={14} className="mr-1" />
                      {user._count.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
            Recent Comments
          </h3>
          <div className="space-y-4">
            {recentComments.map((comment) => (
              <div
                key={comment.id}
                className="border-b dark:border-gray-700 pb-3 last:border-0"
              >
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 mr-3 mt-1">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium dark:text-gray-200">
                        {comment.author.name}
                      </h4>
                      <span className="mx-2 text-gray-400">•</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        on post "{comment.blog.title}"
                      </p>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {comment.content.length > 100
                        ? `${comment.content.substring(0, 100)}...`
                        : comment.content}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
