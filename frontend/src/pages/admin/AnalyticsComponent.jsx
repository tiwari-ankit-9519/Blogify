import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSystemAnalytics } from "@/features/adminSlice";
import { UsersIcon, FileTextIcon, MessageSquareIcon } from "lucide-react";

import StatsCard from "./StatsCard";

const AnalyticsComponent = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin.analytics);

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
      <h2 className="text-2xl font-bold dark:text-gray-100 text-gray-800 mb-6">
        Analytics Dashboard
      </h2>

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
          title="Total Likes"
          value={stats.likes}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          }
          color="bg-red-500"
        />
      </div>

      {/* Charts and detailed analytics would go here */}
      {/* For example, a line chart of user growth, blog posts per month, etc. */}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">
          Platform Activity
        </h3>
        {/* Placeholder for activity charts */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center py-12">
          <p className="text-gray-500 dark:text-gray-300">
            Detailed analytics charts coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComponent;
