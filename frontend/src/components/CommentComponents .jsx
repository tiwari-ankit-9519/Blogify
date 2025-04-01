/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  X,
  Send,
  Trash2,
  Reply,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Confirmation Dialog Component
export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-md m-4 shadow-2xl"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="text-red-500 dark:text-red-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 rounded-lg font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Comment Dialog Component
export const CommentDialog = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialContent = "",
  placeholder,
  isLoading,
}) => {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-lg m-4 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X size={20} />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-24 mb-4"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit"}{" "}
            {!isLoading && <Send size={16} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Comment Component
export const Comment = ({
  comment,
  onReply,
  onDelete,
  onDeleteReply,
  currentUserId,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // This will store the ID of the comment/reply to delete
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isReplyDelete, setIsReplyDelete] = useState(false); // To distinguish between comment and reply deletion

  // Check if the current user is the author of this comment
  // Support different data structures that might come from the API
  const authorId = comment.authorId || comment.user?.id || comment.author?.id;
  const isAuthor = currentUserId && authorId && currentUserId === authorId;

  // Get the author name from various possible structures
  const authorName = comment.user?.name || comment.author?.name || "Anonymous";

  // Format the time since the comment was created
  const timeAgo = comment.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    : "recently";

  // Handler for opening confirmation dialog for comment deletion
  const handleDeleteClick = (commentId) => {
    setConfirmDeleteId(commentId);
    setIsReplyDelete(false);
    setIsConfirmDialogOpen(true);
  };

  // Handler for opening confirmation dialog for reply deletion
  const handleDeleteReplyClick = (replyId, parentCommentId) => {
    setConfirmDeleteId({ replyId, parentCommentId });
    setIsReplyDelete(true);
    setIsConfirmDialogOpen(true);
  };

  // Handler for confirming deletion
  const handleConfirmDelete = () => {
    if (isReplyDelete) {
      onDeleteReply(confirmDeleteId.replyId, confirmDeleteId.parentCommentId);
    } else {
      onDelete(confirmDeleteId);
    }
    setIsConfirmDialogOpen(false);
    setConfirmDeleteId(null);
  };

  return (
    <>
      <div className="border-b border-zinc-200 dark:border-zinc-700 py-4 last:border-0">
        <div className="flex items-start gap-3">
          {/* Avatar - use fallback if no image */}
          {comment.user?.profilePicture || comment.author?.image ? (
            <img
              src={comment.user?.profilePicture || comment.author?.image}
              alt={authorName}
              className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-lg">
              {authorName !== "Anonymous" ? authorName[0].toUpperCase() : "?"}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-zinc-800 dark:text-white">
                {authorName}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {timeAgo}
                </span>

                {/* Delete button - only visible if user is the author */}
                {isAuthor && (
                  <button
                    onClick={() => handleDeleteClick(comment.id)}
                    className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                    aria-label="Delete comment"
                    title="Delete comment"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            <p className="mt-1 text-zinc-600 dark:text-zinc-300">
              {comment.content}
            </p>

            <button
              onClick={() => onReply(comment.id)}
              className="mt-2 text-sm text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
            >
              <Reply size={14} />
              Reply
            </button>
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 ml-12 flex items-center gap-1"
            >
              {showReplies ? "Hide" : "Show"} {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
              <ChevronRight
                size={14}
                className={`transform transition-transform ${
                  showReplies ? "rotate-90" : ""
                }`}
              />
            </button>

            {showReplies && (
              <div className="ml-12 mt-3 space-y-3 border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
                {comment.replies.map((reply) => {
                  // Check if current user is author of this reply
                  const replyAuthorId = reply.authorId || reply.user?.id;
                  const isReplyAuthor =
                    currentUserId &&
                    replyAuthorId &&
                    currentUserId === replyAuthorId;

                  // Format the time since the reply was created
                  const replyTimeAgo = reply.createdAt
                    ? formatDistanceToNow(new Date(reply.createdAt), {
                        addSuffix: true,
                      })
                    : "recently";

                  return (
                    <div key={reply.id} className="flex items-start gap-3">
                      {/* Reply Avatar - use fallback if no image */}
                      {reply.user?.profilePicture ? (
                        <img
                          src={reply.user.profilePicture}
                          alt={reply.user.name}
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-sm">
                          {reply.user?.name
                            ? reply.user.name[0].toUpperCase()
                            : "?"}
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-zinc-800 dark:text-white text-sm">
                            {reply.user?.name || "Anonymous"}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {replyTimeAgo}
                            </span>

                            {/* Delete reply button - only show if user is the author */}
                            {isReplyAuthor && (
                              <button
                                onClick={() =>
                                  handleDeleteReplyClick(reply.id, comment.id)
                                }
                                className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                                aria-label="Delete reply"
                                title="Delete reply"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Comment"
        message={
          isReplyDelete
            ? "Are you sure you want to delete this reply? This action cannot be undone."
            : "Are you sure you want to delete this comment? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};
