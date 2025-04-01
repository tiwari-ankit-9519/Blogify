import express from "express";
import {
  createComment,
  deleteComment,
  getCommentReplies,
} from "../controllers/comment.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.post("/blogs/:slug/comments", isLoggedIn, createComment);
router.delete("/comments/:commentId", isLoggedIn, deleteComment);
router.get("/comments/:commentId/replies", getCommentReplies);

export default router;
