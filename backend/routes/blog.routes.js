import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  searchBlog,
  latestBlogs,
  trendingBlogs,
  relatedBlogs,
  getAllPostOfAuthor,
} from "../controllers/blog.controller.js";
import upload from "../config/upload.js";
import { getLikeStatus, toggleLike } from "../controllers/like.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { fetchAllCategories } from "../controllers/categor.controller.js";

const router = Router();

router.post(
  "/create-blog",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  isLoggedIn,
  createBlog
);

router.post("/blog/like/:slug", isLoggedIn, toggleLike);
router.get("/blog/like-status/:slug", isLoggedIn, getLikeStatus);

router.get("/all", getAllBlogs);
router.get("/search", searchBlog);
router.get("/all-category", fetchAllCategories);
router.get("/category-search", searchBlog);
router.get("/blog/:slug", getSingleBlog);
router.get("/latest-blogs", latestBlogs);
router.get("/trending", trendingBlogs);
router.get("/related-blogs/:slug", relatedBlogs);
router.get("/author-blogs", getAllPostOfAuthor);
router.put(
  "/update/:slug",
  isLoggedIn,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateBlog
);

router.delete("/delete/:slug", isLoggedIn, deleteBlog);

export default router;
