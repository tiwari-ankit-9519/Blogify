import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Tag } from "lucide-react";

function UserBlogCard({ data }) {
  return (
    <div className="bg-white dark:bg-zinc-800/50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={data.image || "https://via.placeholder.com/400x200"}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {data.published === false && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md">
            Draft
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs mb-2">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{data.date}</span>
          </div>
          {data.category && (
            <div className="flex items-center">
              <Tag className="w-3 h-3 mr-1" />
              <span>{data.category}</span>
            </div>
          )}
        </div>

        <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-200 mb-2 line-clamp-2">
          {data.title}
        </h3>

        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-3 flex-1">
          {data.description}
        </p>

        <Link
          to={`/blog/${data.slug || data.id}`}
          className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 mt-auto w-full"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

export default UserBlogCard;
