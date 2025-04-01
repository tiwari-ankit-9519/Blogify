/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBlogs,
  searchBlogs,
  fetchFilteredBlogs,
  fetchAllCategories,
} from "@/features/blogSlice";
import { Search, Filter, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BlogCard from "@/components/BlogCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Footer from "@/components/Footer";

function AllBlogs() {
  const dispatch = useDispatch();
  const {
    data: blogs,
    isLoading,
    error,
  } = useSelector((state) => state.blogs.blogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const categoriesFromState = useSelector(
    (state) => state.blogs.categories.data
  );

  useEffect(() => {
    if (categoriesFromState && categoriesFromState.length > 0) {
      setAllCategories(categoriesFromState);
    } else if (blogs && blogs.length > 0) {
      // Fallback: extract categories from blogs
      const categories = blogs.flatMap(
        (blog) => blog.categories?.map((cat) => cat.category) || []
      );

      // Get unique categories by id
      const uniqueCategories = Array.from(
        new Map(categories.map((cat) => [cat.id, cat])).values()
      );

      setAllCategories(uniqueCategories);
    }
  }, [blogs, categoriesFromState]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchBlogs(searchQuery));
    } else {
      dispatch(fetchAllBlogs());
    }
  };

  // Clear search and reset to all blogs
  const clearSearch = () => {
    setSearchQuery("");
    dispatch(fetchAllBlogs());
  };

  // Toggle category filter
  const toggleCategory = (category) => {
    const isActive = activeCategories.some((cat) => cat.id === category.id);

    if (isActive) {
      setActiveCategories(
        activeCategories.filter((cat) => cat.id !== category.id)
      );
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };

  // Apply category filters
  useEffect(() => {
    if (activeCategories.length > 0) {
      const categoryName = activeCategories[0].name;
      dispatch(fetchFilteredBlogs(categoryName));
    } else if (activeCategories.length === 0 && blogs.length === 0) {
      dispatch(fetchAllBlogs());
    }
  }, [activeCategories, dispatch, blogs.length]);

  const clearFilters = () => {
    setActiveCategories([]);
    dispatch(fetchAllBlogs());
  };

  return (
    <div className="w-full bg-gradient-to-br from-white via-purple-50 to-white dark:from-zinc-900 dark:via-zinc-800/20 dark:to-zinc-900 min-h-screen">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 dark:opacity-10 blur-3xl transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full opacity-10 dark:opacity-5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            All{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Blogs
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto md:mx-0 mb-6"></div>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto md:mx-0">
            Discover insightful stories, helpful guides, and thought-provoking
            content from our expert writers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm"
        >
          <form onSubmit={handleSearch} className="flex-1 flex relative">
            <Input
              type="text"
              placeholder="Search for blogs..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pr-10 focus-visible:ring-purple-500 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X size={16} />
              </button>
            )}
            <Button
              type="submit"
              size="icon"
              className="ml-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Search size={18} />
            </Button>
          </form>

          {/* Category Filters */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span className="hidden md:inline">Filter</span>
                  {activeCategories.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                    >
                      {activeCategories.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allCategories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => toggleCategory(category)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    {category.name}
                    {activeCategories.some((cat) => cat.id === category.id) && (
                      <span className="text-purple-600 dark:text-purple-400">
                        <Check size={16} />
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
                {allCategories.length === 0 && (
                  <DropdownMenuItem disabled>
                    No categories available
                  </DropdownMenuItem>
                )}
                {activeCategories.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={clearFilters}
                      className="text-red-500 dark:text-red-400"
                    >
                      Clear Filters
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Active Filters Display (visible on larger screens) */}
        {!isMobile && activeCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden md:flex flex-wrap gap-2 items-center mb-6"
          >
            {activeCategories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 flex items-center gap-1 cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                {category.name}
                <X size={14} />
              </Badge>
            ))}
            {activeCategories.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-zinc-500 dark:text-zinc-400 h-7 px-2"
              >
                Clear All
              </Button>
            )}
          </motion.div>
        )}

        {/* Active Filters Display (visible on mobile) */}
        {isMobile && activeCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {activeCategories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 flex items-center gap-1 cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                {category.name}
                <X size={14} />
              </Badge>
            ))}
            {activeCategories.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-zinc-500 dark:text-zinc-400 h-7 px-2"
              >
                Clear All
              </Button>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {[1, 2, 3, 4, 5, 6].map((itemKey) => (
              <motion.div key={itemKey} variants={item} className="h-full">
                <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-700 h-full">
                  <div className="aspect-[16/9] w-full bg-zinc-200 dark:bg-zinc-700 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-3 w-3/4"></div>
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-4"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-2 w-full"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-2 w-5/6"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-4/6"></div>
                    <div className="mt-6 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse"></div>
                      <div className="ml-3">
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-24 mb-1"></div>
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm"
          >
            <div className="mb-4 text-red-500 dark:text-red-400">
              <span className="text-5xl">😕</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
              Something went wrong
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-4">{error}</p>
            <Button
              onClick={() => dispatch(fetchAllBlogs())}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && blogs?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm"
          >
            <div className="mb-4 text-zinc-400 dark:text-zinc-500">
              <span className="text-5xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
              No blogs found
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-4">
              {searchQuery
                ? "No results match your search criteria."
                : "There are no blogs available at the moment."}
            </p>
            {searchQuery && (
              <Button
                onClick={clearSearch}
                variant="outline"
                className="mr-2 border-zinc-300 dark:border-zinc-700"
              >
                Clear Search
              </Button>
            )}
            <Button
              onClick={() => dispatch(fetchAllBlogs())}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              View All Blogs
            </Button>
          </motion.div>
        )}

        {/* Blog Grid */}
        {!isLoading && !error && blogs?.length > 0 && (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {blogs.map((blog) => (
                <motion.div key={blog.id} variants={item} className="h-full">
                  <BlogCard data={blog} className="h-full" />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </div>
  );
}

export default AllBlogs;
