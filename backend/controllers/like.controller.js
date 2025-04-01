import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const toggleLike = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.userAuthId;

  const result = await prisma.$transaction(async (tx) => {
    const blog = await tx.blog.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!blog) throw new Error("Blog not found");

    const existingLike = await tx.like.findFirst({
      where: {
        userId,
        blogId: blog.id,
      },
      select: { id: true },
    });

    if (existingLike) {
      await tx.like.delete({
        where: { id: existingLike.id },
      });
      return { action: "removed", blogId: blog.id };
    }

    await tx.like.create({
      data: {
        userId,
        blogId: blog.id,
      },
    });
    return { action: "added", blogId: blog.id };
  });

  const likesCount = await prisma.like.count({
    where: { blogId: result.blogId },
  });

  res.status(200).json({
    status: "success",
    data: {
      liked: result.action === "added",
      likesCount,
    },
  });
});

export const getLikeStatus = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.userAuthId;

  if (!userId) {
    return res.status(200).json({
      status: "success",
      data: {
        liked: false,
        likesCount: 0,
      },
    });
  }

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!blog) {
    return res.status(404).json({
      status: "error",
      message: "Blog not found",
    });
  }

  // Check if the user has liked this blog
  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      blogId: blog.id,
    },
  });

  // Count total likes for this blog
  const likesCount = await prisma.like.count({
    where: { blogId: blog.id },
  });

  res.status(200).json({
    status: "success",
    data: {
      liked: !!existingLike,
      likesCount,
    },
  });
});
