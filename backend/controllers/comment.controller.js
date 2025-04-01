import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const createComment = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { content, parentId } = req.body;
  const authorId = req.userAuthId;

  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { blogId: true },
    });

    if (!parentComment || parentComment.blogId !== blog.id) {
      return res.status(400).json({ message: "Invalid parent comment" });
    }
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      authorId,
      blogId: blog.id,
      parentId: parentId || null,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      replies: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  res.status(201).json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userAuthId;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      author: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isAuthor = comment.author.id === userId;
  const isAdmin = user.role === "ADMIN";

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({ message: "Unauthorized action" });
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  res.status(200).json({ message: "Comment deleted successfully" });
});

export const getCommentReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const replies = await prisma.comment.findMany({
    where: { parentId: commentId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  res.status(200).json(replies);
});
