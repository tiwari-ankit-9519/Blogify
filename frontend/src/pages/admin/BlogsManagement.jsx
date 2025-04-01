import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAllBlogsAdmin,
  toggleBlogPublish,
  deleteBlog,
  getAllCategories,
} from "@/features/adminSlice";
import { SearchIcon, MessageSquareIcon } from "lucide-react";

import ConfirmationModal from "./ConfirmationModal";
import Pagination from "./Pagination";

const BlogsManagement = () => {
  const dispatch = useDispatch();
  const {
    data: blogs,
    meta,
    loading,
    error,
  } = useSelector((state) => state.admin.blogs);
  const { data: categories } = useSelector((state) => state.admin.categories);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  useEffect(() => {
    // Fetch categories for the dropdown
    dispatch(getAllCategories({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAllBlogsAdmin({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
        category: categoryFilter,
      })
    );
  }, [dispatch, currentPage, searchTerm, statusFilter, categoryFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(
      fetchAllBlogsAdmin({
        page: 1,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
        category: categoryFilter,
      })
    );
  };

  const handleTogglePublish = (blogId) => {
    dispatch(toggleBlogPublish(blogId));
  };

  const confirmDeleteBlog = (blogId) => {
    setSelectedBlogId(blogId);
    setShowDeleteModal(true);
  };

  const handleDeleteBlog = () => {
    dispatch(deleteBlog(selectedBlogId)).then(() => {
      setShowDeleteModal(false);
      dispatch(
        fetchAllBlogsAdmin({
          page: currentPage,
          limit: 10,
          search: searchTerm,
          status: statusFilter,
          category: categoryFilter,
        })
      );
    });
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading blogs...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Blog Management
        </h2>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Category filter dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories &&
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>

          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
            >
              <SearchIcon size={20} />
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Blog
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Categories
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4">
                  <div className="flex items-start">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {blog.title.length > 50
                          ? blog.title.substring(0, 50) + "..."
                          : blog.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Created: {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {blog.author.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {blog.author.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {blog.author.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {blog.categories.map((cat) => (
                      <span
                        key={cat.category.id}
                        className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                      >
                        {cat.category.name}
                      </span>
                    ))}
                    {blog.categories.length === 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        No categories
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-4">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      blog.published
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    }`}
                  >
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleTogglePublish(blog.id)}
                    className={`mr-3 ${
                      blog.published
                        ? "text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                        : "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    }`}
                  >
                    {blog.published ? "Unpublish" : "Publish"}
                  </button>
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => confirmDeleteBlog(blog.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={meta.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteBlog}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This will also delete all associated comments and likes. This action cannot be undone."
      />
    </div>
  );
};

export default BlogsManagement;
