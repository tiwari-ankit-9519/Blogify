/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Heart, MessageSquare } from "lucide-react";

const BlogHeader = ({ blog, isLiked = false, likesCount = 0 }) => {
  return (
    <>
      {/* Navigation breadcrumb */}
      <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        <Link to="/" className="hover:text-purple-600 transition-colors">
          Home
        </Link>
        <ChevronRight
          size={16}
          className="mx-2 text-zinc-400 dark:text-zinc-600"
        />
        <Link
          to="/all-blogs"
          className="hover:text-purple-600 transition-colors"
        >
          Blogs
        </Link>
        <ChevronRight
          size={16}
          className="mx-2 text-zinc-400 dark:text-zinc-600"
        />
        <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-xs">
          {blog?.title || "Loading..."}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {blog?.categories?.map((category) => (
            <span
              key={category.categoryId}
              className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium"
            >
              {category.category.name}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
          {blog?.title || "Loading..."}
        </h1>

        <div className="flex items-center">
          <img
            src={blog?.author?.image || "https://i.pravatar.cc/150?u=sandy"}
            alt={blog?.author?.name || "Author"}
            className="w-12 h-12 rounded-full mr-4 border-2 border-white dark:border-zinc-800 shadow-sm"
          />
          <div>
            <p className="font-medium text-zinc-800 dark:text-white">
              {blog?.author?.name || "Author"}
            </p>
            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-sm">
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {blog?.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "March 24, 2025"}
              </span>

              {/* Social Stats */}
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Heart
                    size={14}
                    className={isLiked ? "text-red-500" : "text-zinc-400"}
                  />
                  {likesCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  {blog?.commentsCount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Featured Image with enhanced presentation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mb-10 rounded-xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800 group"
      >
        <img
          src={blog?.coverImage || "/react-logo.png"}
          alt={blog?.title || "Blog Image"}
          className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent dark:from-black opacity-0 dark:opacity-40"></div>
      </motion.div>
    </>
  );
};

export default BlogHeader;
