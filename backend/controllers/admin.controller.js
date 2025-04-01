import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

// User Management
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search?.toString() || "", mode: "insensitive" } },
          {
            email: { contains: search?.toString() || "", mode: "insensitive" },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { blogs: true, comments: true, likes: true } },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({
      where: {
        OR: [
          { name: { contains: search?.toString() || "", mode: "insensitive" } },
          {
            email: { contains: search?.toString() || "", mode: "insensitive" },
          },
        ],
      },
    }),
  ]);

  res.status(200).json({
    data: users,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      provider: true,
      createdAt: true,
      updatedAt: true,
      blogs: {
        select: {
          id: true,
          title: true,
          published: true,
        },
      },
      _count: { select: { blogs: true, comments: true, likes: true } },
    },
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role, name, email } = req.body;

  if (role && !["ADMIN", "USER"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role specified");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role, name, email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  res.status(200).json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId === req.userAuthId) {
    res.status(400);
    throw new Error("Cannot delete yourself");
  }

  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { authorId: userId } }),
    prisma.like.deleteMany({ where: { userId: userId } }),
    prisma.blog.deleteMany({ where: { authorId: userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  res
    .status(200)
    .json({ message: "User and all associated data deleted successfully" });
});

// Blog Management
export const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, category, search } = req.query;

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where: {
        published:
          status === "published"
            ? true
            : status === "draft"
            ? false
            : undefined,
        categories: category
          ? { some: { category: { id: category } } }
          : undefined,
        title: { contains: search?.toString() || "", mode: "insensitive" },
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        categories: { include: { category: true } },
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.blog.count({
      where: {
        published:
          status === "published"
            ? true
            : status === "draft"
            ? false
            : undefined,
        categories: category
          ? { some: { category: { id: category } } }
          : undefined,
        title: { contains: search?.toString() || "", mode: "insensitive" },
      },
    }),
  ]);

  res.status(200).json({
    data: blogs,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getBlogById = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    include: {
      author: { select: { id: true, name: true, email: true } },
      categories: { include: { category: true } },
      comments: {
        include: {
          author: { select: { id: true, name: true } },
        },
      },
      likes: {
        include: {
          user: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.status(200).json(blog);
});

export const toggleBlogPublish = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    select: { published: true },
  });

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const updatedBlog = await prisma.blog.update({
    where: { id: blogId },
    data: { published: !blog.published },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

  res.status(200).json(updatedBlog);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { blogId } }),
    prisma.like.deleteMany({ where: { blogId } }),
    prisma.blogCategory.deleteMany({ where: { blogId } }),
    prisma.blog.delete({ where: { id: blogId } }),
  ]);

  res
    .status(200)
    .json({ message: "Blog and all associated data deleted successfully" });
});

// Category Management
export const getAllCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where: {
        name: { contains: search?.toString() || "", mode: "insensitive" },
      },
      include: {
        _count: { select: { blogs: true } },
      },
      orderBy: { name: "asc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.category.count({
      where: {
        name: { contains: search?.toString() || "", mode: "insensitive" },
      },
    }),
  ]);

  res.status(200).json({
    data: categories,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      blogs: {
        select: {
          blog: {
            select: {
              id: true,
              title: true,
              published: true,
              createdAt: true,
            },
          },
        },
      },
      _count: { select: { blogs: true } },
    },
  });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json(category);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const existingCategory = await prisma.category.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });

  if (existingCategory) {
    res.status(409);
    throw new Error("Category with this name already exists");
  }

  const category = await prisma.category.create({
    data: { name },
    select: { id: true, name: true },
  });

  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  const existingCategory = await prisma.category.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      NOT: { id: categoryId },
    },
  });

  if (existingCategory) {
    res.status(409);
    throw new Error("Category with this name already exists");
  }

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { name },
    select: { id: true, name: true },
  });

  res.status(200).json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  await prisma.$transaction([
    prisma.blogCategory.deleteMany({ where: { categoryId } }),
    prisma.category.delete({ where: { id: categoryId } }),
  ]);

  res.status(200).json({
    message: "Category and all blog associations deleted successfully",
  });
});

// Comment Management
export const getAllComments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, search } = req.query;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: {
        content: { contains: search?.toString() || "", mode: "insensitive" },
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        blog: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.comment.count({
      where: {
        content: { contains: search?.toString() || "", mode: "insensitive" },
      },
    }),
  ]);

  res.status(200).json({
    data: comments,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      author: { select: { id: true, name: true, email: true } },
      blog: { select: { id: true, title: true } },
    },
  });

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  res.status(200).json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  await prisma.comment.delete({
    where: { id: commentId },
  });

  res.status(200).json({ message: "Comment deleted successfully" });
});

// Analytics
export const getSystemAnalytics = asyncHandler(async (req, res) => {
  const [users, blogs, comments, likes, categories] = await Promise.all([
    prisma.user.count(),
    prisma.blog.count(),
    prisma.comment.count(),
    prisma.like.count(),
    prisma.category.count(),
  ]);

  const [popularBlogs, activeUsers, recentComments] = await Promise.all([
    prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { likes: { _count: "desc" } },
      take: 5,
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        _count: { select: { blogs: true, comments: true, likes: true } },
      },
      orderBy: [
        { blogs: { _count: "desc" } },
        { comments: { _count: "desc" } },
      ],
      take: 5,
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        author: { select: { name: true } },
        blog: { select: { title: true } },
      },
    }),
  ]);

  res.status(200).json({
    stats: { users, blogs, comments, likes, categories },
    popularBlogs,
    activeUsers,
    recentComments,
  });
});
