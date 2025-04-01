/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Share, MessageSquare, ChevronUp, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleBlog,
  toggleLikeBlog,
  checkLikeStatus,
} from "@/features/blogSlice";
import { createComment, deleteComment } from "@/features/createComment";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";

// Import our extracted components
import BlogHeader from "../components/BlogHeader";
import { CommentDialog, Comment } from "../components/CommentComponents ";
import SharePopup from "../components/SharePopup";
import Footer from "@/components/Footer";

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const { singleBlog } = useSelector((state) => state.blogs);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { loading: commentLoading } = useSelector((state) => state.comments);

  // State management for UI elements
  const [scrollProgress, setScrollProgress] = useState(0);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [localComments, setLocalComments] = useState([]);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);

  const isLoading = singleBlog.isLoading;
  const isLikeLoading = singleBlog.likeStatus?.isLoading;
  const likeError = singleBlog.likeStatus?.error;
  const dispatch = useDispatch();

  // Generate the current blog URL for sharing
  const blogUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${slug}`
      : `https://yoursite.com/blog/${slug}`;

  const AUTHENTICATED_POLL_INTERVAL = 10000; // 10 seconds when authenticated
  const UNAUTHENTICATED_POLL_INTERVAL = 30000; // 30 seconds when not authenticated

  const pollTimeoutRef = useRef(null);
  const isLikeOperationInProgress = useRef(false);
  const prevAuthStatusRef = useRef(isAuthenticated);
  const prevUserIdRef = useRef(user?.id);

  useEffect(() => {
    dispatch(fetchSingleBlog(slug))
      .unwrap()
      .then((data) => {
        if (data?.comments) {
          setLocalComments(data.comments);
        }
      })
      .catch((err) => {
        toast.error(err);
      });

    window.scrollTo(0, 0);

    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, slug]);

  useEffect(() => {
    if (singleBlog?.data?.comments) {
      setLocalComments(singleBlog.data.comments);
    }
  }, [singleBlog?.data?.comments]);

  useEffect(() => {
    if (singleBlog.data?.id && !isLikeOperationInProgress.current) {
      dispatch(checkLikeStatus(slug));
    }
  }, [dispatch, slug, singleBlog.data?.id]);

  useEffect(() => {
    if (!slug) return;
    if (
      prevAuthStatusRef.current !== isAuthenticated ||
      prevUserIdRef.current !== user?.id
    ) {
      dispatch(checkLikeStatus(slug));
      prevAuthStatusRef.current = isAuthenticated;
      prevUserIdRef.current = user?.id;
    }

    const schedulePoll = () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }

      const interval = isAuthenticated
        ? AUTHENTICATED_POLL_INTERVAL
        : UNAUTHENTICATED_POLL_INTERVAL;

      pollTimeoutRef.current = setTimeout(() => {
        if (!isLikeOperationInProgress.current) {
          dispatch(checkLikeStatus(slug))
            .then(() => {
              schedulePoll();
            })
            .catch(() => {
              schedulePoll();
            });
        } else {
          schedulePoll();
        }
      }, interval);
    };

    schedulePoll();

    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [dispatch, slug, isAuthenticated, user?.id]);

  useEffect(() => {
    if (likeError) {
      console.error("Like error:", likeError);
    }
  }, [likeError]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleShareClick = () => {
    setSharePopupOpen(true);
  };

  const handleLikeClick = useCallback(() => {
    if (isLikeLoading || isLikeOperationInProgress.current) return;

    if (!isAuthenticated) {
      toast.error("Please log in to like this post");
      return;
    }

    isLikeOperationInProgress.current = true;

    dispatch(toggleLikeBlog(slug))
      .unwrap()
      .catch((error) => {
        toast.error(error || "Failed to update like status");
      })
      .finally(() => {
        isLikeOperationInProgress.current = false;
      });
  }, [dispatch, slug, isAuthenticated, isLikeLoading]);

  const handleAddComment = (content) => {
    if (!isAuthenticated) {
      toast.error("Please log in to comment");
      return;
    }

    dispatch(
      createComment({
        slug,
        content: content,
        postId: singleBlog.data.id,
      })
    )
      .unwrap()
      .then((newComment) => {
        const commentWithUserData = {
          ...newComment,
          user: {
            id: user.id,
            name: user.name,
            profilePicture: user.profilePicture || null,
          },
          replies: [],
          createdAt: new Date().toISOString(),
        };

        setLocalComments((prevComments) => [
          ...prevComments,
          commentWithUserData,
        ]);
        setCommentDialogOpen(false);
        toast.success("Comment added successfully");
      })
      .catch((error) => {
        toast.error(error || "Failed to add comment");
      });
  };

  const handleAddReply = (content) => {
    if (!isAuthenticated) {
      toast.error("Please log in to reply");
      return;
    }

    if (!replyToCommentId) {
      toast.error("Comment ID is missing");
      return;
    }

    dispatch(
      createComment({
        slug,
        content: content,
        postId: singleBlog.data.id,
        parentId: replyToCommentId,
      })
    )
      .unwrap()
      .then((newReply) => {
        const updatedComments = localComments.map((comment) => {
          if (comment.id === replyToCommentId) {
            const replyWithUserData = {
              ...newReply,
              user: {
                id: user.id,
                name: user.name,
                profilePicture: user.profilePicture || null,
              },
              createdAt: new Date().toISOString(),
            };

            return {
              ...comment,
              replies: [...(comment.replies || []), replyWithUserData],
            };
          }
          return comment;
        });

        setLocalComments(updatedComments);
        setReplyDialogOpen(false);
        setReplyToCommentId(null);
        toast.success("Reply added successfully");
      })
      .catch((error) => {
        toast.error(error || "Failed to add reply");
      });
  };

  const handleReplyClick = (commentId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to reply to comments");
      return;
    }

    setReplyToCommentId(commentId);
    setReplyDialogOpen(true);
  };

  const handleDeleteComment = (commentId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to delete comments");
      return;
    }

    dispatch(deleteComment(commentId))
      .unwrap()
      .then(() => {
        setLocalComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
        toast.success("Comment deleted successfully");
      })
      .catch((error) => {
        toast.error(error || "Failed to delete comment");
      });
  };

  const handleDeleteReply = (replyId, parentCommentId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to delete replies");
      return;
    }

    dispatch(deleteComment(replyId))
      .unwrap()
      .then(() => {
        const updatedComments = localComments.map((comment) => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: (comment.replies || []).filter(
                (reply) => reply.id !== replyId
              ),
            };
          }
          return comment;
        });

        setLocalComments(updatedComments);
        toast.success("Reply deleted successfully");
      })
      .catch((error) => {
        toast.error(error || "Failed to delete reply");
      });
  };

  const processContentImages = (htmlContent) => {
    if (
      !htmlContent ||
      !singleBlog?.data?.images ||
      singleBlog.data.images.length === 0
    ) {
      return htmlContent;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const images = doc.querySelectorAll("img[data-image-id]");

    images.forEach((img, index) => {
      if (index < singleBlog.data.images.length) {
        img.src = singleBlog.data.images[index];
      }
    });

    return doc.body.innerHTML;
  };

  const createMarkup = (htmlContent) => {
    const processedContent = processContentImages(htmlContent);
    return {
      __html: DOMPurify.sanitize(processedContent),
    };
  };

  const isLiked = singleBlog.data?.isLikedByCurrentUser || false;
  const likesCount = singleBlog.data?.likesCount || 0;

  if (isLoading && !singleBlog?.data?.id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse space-y-8 w-full">
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-3/4"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      {/* Subtle Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 dark:opacity-30 blur-3xl transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full opacity-10 dark:opacity-20 blur-3xl"></div>
      </div>

      <SharePopup
        isOpen={sharePopupOpen}
        onClose={() => setSharePopupOpen(false)}
        url={blogUrl}
      />

      <div className="fixed hidden sm:block left-6 top-1/2 transform -translate-y-1/2 h-1/3 w-1 bg-zinc-200 dark:bg-zinc-800 rounded-full z-50">
        <div
          className="w-1 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full transition-all duration-200"
          style={{ height: `${scrollProgress}%` }}
        ></div>
      </div>

      <div className="fixed sm:hidden top-0 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress > 20 ? 1 : 0 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-zinc-800 text-zinc-700 dark:text-white shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all z-50"
      >
        <ChevronUp size={20} />
      </motion.button>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        <BlogHeader
          blog={singleBlog.data}
          isLiked={isLiked}
          likesCount={likesCount}
        />

        <div className="hidden md:flex flex-col fixed right-8 top-1/3 bg-white dark:bg-zinc-800 shadow-lg rounded-full p-2 space-y-4 border border-zinc-200 dark:border-zinc-700">
          <button
            className={`p-2 rounded-full transition-colors ${
              isLiked
                ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700"
            } ${isLikeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleLikeClick}
            disabled={isLikeLoading}
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            {isLikeLoading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
            ) : (
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            )}
          </button>
          <button
            className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Comment on post"
            onClick={() => {
              if (!isAuthenticated) {
                toast.error("Please log in to comment");
                return;
              }
              setCommentDialogOpen(true);
            }}
          >
            <MessageSquare size={20} />
          </button>
          <button
            className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Share post"
            onClick={handleShareClick}
          >
            <Share size={20} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="prose prose-lg mx-auto dark:prose-invert max-w-none mb-10 
            prose-headings:font-bold prose-headings:text-zinc-900 dark:prose-headings:text-white 
            prose-p:text-zinc-700 dark:prose-p:text-zinc-300 
            prose-a:text-purple-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline 
            prose-strong:text-zinc-900 dark:prose-strong:text-white
            prose-img:rounded-lg prose-img:shadow-md"
        >
          {/* Use dangerouslySetInnerHTML to render HTML content with processed images */}
          {singleBlog?.data?.content ? (
            <div
              dangerouslySetInnerHTML={createMarkup(singleBlog.data.content)}
            />
          ) : (
            <p>
              This is the blog content. It will render your actual blog content
              here when loaded from the API.
            </p>
          )}
        </motion.div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {singleBlog?.data?.categories?.map((category) => (
            <span
              key={category.categoryId}
              className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1 rounded-full text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              #{category.category.name.toLowerCase().replace(/\s+/g, "")}
            </span>
          ))}
        </div>

        {/* Mobile action buttons */}
        <div className="md:hidden flex justify-between items-center border-t border-b border-zinc-200 dark:border-zinc-800 py-4 my-8">
          <div className="flex gap-4">
            <button
              className={`flex items-center gap-1 ${
                isLiked
                  ? "text-red-500"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400"
              } ${isLikeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleLikeClick}
              disabled={isLikeLoading}
            >
              {isLikeLoading ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin mr-1"></div>
              ) : (
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              )}
              <span>{isLiked ? "Liked" : "Like"}</span>
            </button>
            <button
              className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error("Please log in to comment");
                  return;
                }
                setCommentDialogOpen(true);
              }}
            >
              <MessageSquare size={20} />
              <span>Comment</span>
            </button>
          </div>
          <div>
            <button
              className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={handleShareClick}
            >
              <Share size={20} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* About the Author Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-zinc-800 rounded-xl p-6 mb-8 shadow-lg border border-zinc-200 dark:border-zinc-700"
        >
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
            About the Author
          </h3>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-shrink-0">
              {singleBlog?.data?.author?.image ? (
                <img
                  src={singleBlog.data?.author?.image}
                  alt={singleBlog.data.author.name || "Author"}
                  className="w-24 h-24 rounded-full object-cover border-2 border-purple-200 dark:border-purple-800"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white">
                  <User size={32} />
                </div>
              )}
            </div>

            <div className="flex-grow">
              <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {singleBlog?.data?.author?.name || "Unknown Author"}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                {singleBlog?.data?.author?.bio ||
                  "This author is passionate about sharing knowledge and insights with readers. Follow along for more thought-provoking content on this topic and beyond."}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-zinc-800 rounded-xl p-6 mb-8 shadow-lg border border-zinc-200 dark:border-zinc-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              Comments ({localComments.length || 0})
            </h3>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error("Please log in to comment");
                  return;
                }
                setCommentDialogOpen(true);
              }}
              className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium ${
                commentLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={commentLoading}
            >
              {commentLoading ? "Adding..." : "Add Comment"}
            </button>
          </div>

          {localComments.length > 0 ? (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {localComments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onReply={handleReplyClick}
                  onDelete={handleDeleteComment}
                  onDeleteReply={handleDeleteReply}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </motion.div>

        <div className="max-w-7xl mx-auto mt-10">
          <Footer />
        </div>
      </div>

      <AnimatePresence>
        {commentDialogOpen && (
          <CommentDialog
            isOpen={commentDialogOpen}
            onClose={() => setCommentDialogOpen(false)}
            onSubmit={handleAddComment}
            title="Add a Comment"
            placeholder="Share your thoughts about this post..."
            isLoading={commentLoading}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {replyDialogOpen && (
          <CommentDialog
            isOpen={replyDialogOpen}
            onClose={() => setReplyDialogOpen(false)}
            onSubmit={handleAddReply}
            title="Add a Reply"
            placeholder="Write your reply..."
            isLoading={commentLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogDetailsPage;
