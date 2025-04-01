import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, User2, ArrowUpRight, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";

/**
 * Unified BlogCard component that can handle both regular blog display and user blog display
 *
 * @param {Object} props
 * @param {Object} props.data - Blog data
 * @param {string} props.className - Additional classes
 * @param {boolean} props.isUserBlog - Whether this is a user blog (different data structure)
 * @param {boolean} props.disableNavigation - Whether to disable navigation on click
 */
const BlogCard = ({
  data,
  className,
  isUserBlog = false,
  disableNavigation = false,
}) => {
  const navigate = useNavigate();

  // Handle different data structure based on card type
  const {
    id,
    title,
    content,
    description,
    categories,
    category,
    author,
    coverImage,
    image,
    createdAt,
    date,
    slug,
    published,
  } = data;

  // Format date (handle both date formats)
  const displayDate =
    date ||
    (createdAt &&
      new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }));

  // Get image URL (handle both structures)
  const imageUrl = image || coverImage || "https://via.placeholder.com/400x200";

  // Get category (handle both structures)
  const displayCategory =
    category || (categories && categories[0]?.category?.name);

  // Get description or sanitize content for display
  const sanitizeContent = (htmlContent) => {
    if (!htmlContent) return "";

    const sanitized = DOMPurify.sanitize(htmlContent);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitized;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const displayContent = description || sanitizeContent(content);
  const displayTitle = DOMPurify.sanitize(title);
  const blogLink = `/blog/${slug || id}`;

  const handleClick = () => {
    if (!disableNavigation) {
      navigate(blogLink);
    }
  };

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-zinc-800/20 flex flex-col h-full",
        disableNavigation ? "" : "cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={imageUrl}
          alt={displayTitle}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Display badge for category if available */}
        {displayCategory && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-2.5 py-1">
              {displayCategory}
            </Badge>
          </div>
        )}

        {/* Show draft label if published status is explicitly false */}
        {published === false && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-md">
            Draft
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400 mb-3">
          {displayDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{displayDate}</span>
            </div>
          )}

          {/* Show author if available */}
          {author?.name && (
            <div className="flex items-center gap-1">
              <User2 className="h-3.5 w-3.5" />
              <span>{author.name}</span>
            </div>
          )}
        </div>

        {/* Title with line clamp */}
        <h3 className="text-xl font-bold leading-tight tracking-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 min-h-[3.5rem]">
          {displayTitle}
        </h3>

        {/* Content with line clamp */}
        <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-4 flex-grow">
          {displayContent}
        </p>

        {/* Read More Link */}
        <div className="mt-auto">
          <Link
            to={blogLink}
            className={cn(
              isUserBlog
                ? "inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 w-full"
                : "inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            Read more
            {!isUserBlog && (
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
