import express from "express";
import { isLoggedIn, isAdmin } from "../middlewares/isLoggedIn.js";
import * as adminControllers from "../controllers/admin.controller.js";

const router = express.Router();

router.use(isLoggedIn, isAdmin);

// User Management Routes
router.get("/users", adminControllers.getAllUsers);
router.get("/users/:userId", adminControllers.getUserById);
router.put("/users/:userId", adminControllers.updateUser);
router.delete("/users/:userId", adminControllers.deleteUser);

// Blog Management Routes
router.get("/blogs", adminControllers.getAllBlogsAdmin);
router.get("/blogs/:blogId", adminControllers.getBlogById);
router.put("/blogs/:blogId/publish", adminControllers.toggleBlogPublish);
router.delete("/blogs/:blogId", adminControllers.deleteBlog);

// Category Management Routes
router.get("/categories", adminControllers.getAllCategories);
router.get("/categories/:categoryId", adminControllers.getCategoryById);
router.post("/categories", adminControllers.createCategory);
router.put("/categories/:categoryId", adminControllers.updateCategory);
router.delete("/categories/:categoryId", adminControllers.deleteCategory);

// Comment Management Routes
router.get("/comments", adminControllers.getAllComments);
router.get("/comments/:commentId", adminControllers.getCommentById);
router.delete("/comments/:commentId", adminControllers.deleteComment);

// Analytics Route
router.get("/analytics", adminControllers.getSystemAnalytics);

export default router;
