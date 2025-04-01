// src/components/admin/shared/Pagination.jsx
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center px-3 py-1 rounded-md ${
          currentPage === 1
            ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        }`}
      >
        <ChevronLeftIcon size={16} className="mr-1" /> Previous
      </button>

      <div className="flex space-x-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        }`}
      >
        Next <ChevronRightIcon size={16} className="ml-1" />
      </button>
    </div>
  );
};

export default Pagination;
