import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllComments, deleteComment } from "@/features/adminSlice";
import { SearchIcon, TrashIcon } from "lucide-react";

import ConfirmationModal from "./ConfirmationModal";
import Pagination from "./Pagination";

const CommentsManagement = () => {
  const dispatch = useDispatch();
  const {
    data: comments,
    meta,
    loading,
    error,
  } = useSelector((state) => state.admin.comments);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  useEffect(() => {
    dispatch(
      getAllComments({ page: currentPage, limit: 10, search: searchTerm })
    );
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(getAllComments({ page: 1, limit: 10, search: searchTerm }));
  };

  const confirmDeleteComment = (commentId) => {
    setSelectedCommentId(commentId);
    setShowDeleteModal(true);
  };

  const handleDeleteComment = () => {
    dispatch(deleteComment(selectedCommentId)).then(() => {
      setShowDeleteModal(false);
      dispatch(
        getAllComments({ page: currentPage, limit: 10, search: searchTerm })
      );
    });
  };

  if (loading && comments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading comments...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Comments Management
        </h2>
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search comments..."
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

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"
          >
            <div className="flex justify-between">
              <div className="flex items-start mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                  {comment.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {comment.author.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {comment.author.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => confirmDeleteComment(comment.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            </div>
            <div className="mt-2 pt-2 border-t dark:border-gray-700">
              <Link
                to={`/admin/blogs/${comment.blog.id}`}
                className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
              >
                On: {comment.blog.title}
              </Link>
            </div>
          </div>
        ))}
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
        onConfirm={handleDeleteComment}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </div>
  );
};

export default CommentsManagement;
