// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "@/components/BlogCard";
import HeroSection from "@/components/HeroSection";
import {
  fetchLatestBlogs,
  fetchTrendingBlogs,
  fetchAllCategories,
  fetchFilteredBlogs,
} from "@/features/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";

function HomePage() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const [loadingCategoryBlogs, setLoadingCategoryBlogs] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchTrendingBlogs())
      .unwrap()
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchLatestBlogs())
      .unwrap()
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllCategories())
      .unwrap()
      .then(() => {
        setCategoriesLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        setCategoriesLoaded(true);
      });
  }, [dispatch]);

  const { latestBlogs, trendingBlogs, categories } = useSelector(
    (state) => state.blogs
  );
  const { data, isLoading } = latestBlogs;
  const { data: trendingBlogsData, isLoading: trendingBlogsLoading } =
    trendingBlogs;
  const { data: categoriesData, isLoading: categoriesLoading } = categories;

  // Set default category to ReactJS once categories are loaded
  useEffect(() => {
    if (categoriesLoaded && categoriesData?.length > 0 && !selectedCategory) {
      const reactCategory = categoriesData.find(
        (category) => category.name.toLowerCase() === "reactjs"
      );

      if (reactCategory) {
        setSelectedCategory(reactCategory);
      } else if (categoriesData.length > 0) {
        // If ReactJS category doesn't exist, select the first category
        setSelectedCategory(categoriesData[0]);
      }
    }
  }, [categoriesData, categoriesLoaded, selectedCategory]);

  // Fetch blogs by category when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      setLoadingCategoryBlogs(true);
      dispatch(fetchFilteredBlogs(selectedCategory.name))
        .unwrap()
        .then((result) => {
          setCategoryBlogs(result);
          setLoadingCategoryBlogs(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingCategoryBlogs(false);
        });
    }
  }, [dispatch, selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

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

  const CardSkeleton = () => (
    <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-700 h-full">
      <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-700 animate-pulse"></div>
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
  );

  return (
    <div className="w-full bg-gradient-to-br from-white via-purple-50 to-white dark:from-zinc-900 dark:via-zinc-800/20 dark:to-zinc-900 min-h-screen">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 dark:opacity-10 blur-3xl transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full opacity-10 dark:opacity-5 blur-3xl"></div>
      </div>

      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Featured{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Blogs
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto md:mx-0 mb-6"></div>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto md:mx-0">
            Explore our latest articles and immerse yourself in a world of
            knowledge, inspiration, and discovery.
          </p>
        </motion.div>

        {isLoading ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {[1, 2, 3].map((item) => (
              <motion.div key={item} variants={item} className="h-full">
                <CardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {data && data.length > 0 ? (
              data?.map((blog) => (
                <motion.div key={blog.id} variants={item} className="h-full">
                  <BlogCard data={blog} className="h-full" />
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={item}
                className="col-span-3 py-16 text-center"
              >
                <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-700">
                  <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                    No blogs available yet
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Check back soon for new content!
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Browse by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Category
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto md:mx-0 mb-6"></div>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto md:mx-0">
            Find content that interests you most by exploring our various blog
            categories.
          </p>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {categoriesLoading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full animate-pulse"
                ></div>
              ))
          ) : categoriesData && categoriesData.length > 0 ? (
            categoriesData.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className={`px-4 py-2 cursor-pointer text-sm transition-all duration-200 ${
                  selectedCategory?.id === category.id
                    ? "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category.name}
              </Badge>
            ))
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">
              No categories available
            </p>
          )}
        </motion.div>

        {/* Category Blogs */}
        {selectedCategory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between items-center mb-6 mt-10"
            >
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                <span className="text-purple-600 dark:text-purple-400">
                  {selectedCategory.name}
                </span>{" "}
                blogs
              </h3>
              <Link
                to="/all-blogs"
                className="text-purple-600 dark:text-purple-400 flex items-center gap-1 text-sm hover:underline"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {loadingCategoryBlogs ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {[1, 2, 3].map((item) => (
                  <motion.div key={item} variants={item} className="h-full">
                    <CardSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {categoryBlogs && categoryBlogs.length > 0 ? (
                  categoryBlogs.slice(0, 3).map((blog) => (
                    <motion.div
                      key={blog.id}
                      variants={item}
                      className="h-full"
                    >
                      <BlogCard data={blog} className="h-full" />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    variants={item}
                    className="col-span-3 py-8 text-center"
                  >
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-700">
                      <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                        No blogs found in this category
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        Try selecting a different category or check back later!
                      </p>
                      {categoriesData && categoriesData.length > 1 && (
                        <Button
                          onClick={() => setSelectedCategory(categoriesData[0])}
                          variant="outline"
                          className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                        >
                          Try another category
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Trending{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Blogs
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto md:mx-0 mb-6"></div>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto md:mx-0">
            Stay updated with our most popular content that readers are loving
            right now.
          </p>
        </motion.div>

        {trendingBlogsLoading ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {[1, 2, 3].map((item) => (
              <motion.div key={item} variants={item} className="h-full">
                <CardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {trendingBlogsData && trendingBlogsData.length > 0 ? (
              trendingBlogsData?.map((blog) => (
                <motion.div key={blog.id} variants={item} className="h-full">
                  <BlogCard data={blog} className="h-full" />
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={item}
                className="col-span-3 py-16 text-center"
              >
                <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-700">
                  <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                    No trending blogs available
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Check back soon for trending content!
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
