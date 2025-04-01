import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

const prisma = new PrismaClient();

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await prisma.blog.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      coverImage: true,
      images: true,
      published: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      _count: {
        select: {
          likes: true,
          comments: {
            where: {
              parentId: null,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!blogs || blogs.length === 0) {
    return res.status(404).json({ message: "No blogs found" });
  }

  const structuredBlogs = blogs.map((blog) => {
    const commentMap = new Map();
    const structuredComments = [];

    blog.comments.forEach((comment) => {
      comment.replies = [];
      commentMap.set(comment.id, comment);

      if (!comment.parentId) {
        structuredComments.push(comment);
      }
    });

    blog.comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(comment);
        }
      }
    });

    return {
      ...blog,
      comments: structuredComments,
      likesCount: blog._count.likes,
      commentsCount: blog._count.comments,
      _count: undefined,
    };
  });

  res.status(200).json(structuredBlogs);
});

export const getSingleBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.userAuthId;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      content: true,
      coverImage: true,
      images: true,
      published: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      _count: {
        select: {
          likes: true,
          comments: {
            where: {
              parentId: null,
            },
          },
        },
      },
      likes: userId
        ? {
            where: {
              userId: userId,
            },
            select: {
              id: true,
            },
          }
        : false,
    },
  });

  if (!blog) {
    return res.status(404).json({ message: "No blog found" });
  }

  const commentMap = new Map();
  const structuredComments = [];

  blog.comments.forEach((comment) => {
    comment.replies = [];
    commentMap.set(comment.id, comment);

    if (!comment.parentId) {
      structuredComments.push(comment);
    }
  });

  blog.comments.forEach((comment) => {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(comment);
      }
    }
  });

  const response = {
    ...blog,
    comments: structuredComments,
    likesCount: blog._count.likes,
    commentsCount: blog._count.comments,
    likes: undefined,
    _count: undefined,
  };

  res.status(200).json(response);
});

export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, published, categories } = req.body;
  const authorId = req.userAuthId;

  if (!authorId) {
    return res.status(401).json({ message: "Login to create a blog" });
  }

  const coverImage = req.files?.coverImage
    ? req.files.coverImage[0].path
    : null;
  const images = req.files?.images
    ? req.files.images.map((file) => file.path)
    : [];

  if (!title || !content || !categories) {
    return res
      .status(400)
      .json({ message: "Title, content, and category(ies) are required." });
  }

  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.blog.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  let categoryNames;
  if (typeof categories === "string") {
    categoryNames = categories.split(",").map((c) => c.trim());
  } else if (Array.isArray(categories)) {
    categoryNames = categories;
  } else {
    return res.status(400).json({
      message: "Categories must be a comma-separated string or array.",
    });
  }

  const existingCategories = await prisma.category.findMany({
    where: { name: { in: categoryNames } },
  });

  const existingCategoryNames = existingCategories.map((c) => c.name);
  const newCategories = categoryNames.filter(
    (name) => !existingCategoryNames.includes(name)
  );

  if (newCategories.length > 0) {
    await prisma.category.createMany({
      data: newCategories.map((name) => ({ name })),
      skipDuplicates: true,
    });
  }

  const allCategories = await prisma.category.findMany({
    where: { name: { in: categoryNames } },
  });
  const categoryIds = allCategories.map((c) => c.id);

  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      coverImage,
      images,
      published: Boolean(published) || false,
      slug,
      author: { connect: { id: authorId } },
      categories: {
        create: categoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      },
    },
    include: {
      author: true,
      categories: { include: { category: true } },
      comments: true,
      likes: true,
    },
  });

  res.status(201).json(blog);
});

export const searchBlog = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  const blogs = await prisma.blog.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        {
          categories: {
            some: {
              category: { name: { contains: query, mode: "insensitive" } },
            },
          },
        },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
      categories: { include: { category: true } },
      comments: true,
      likes: true,
    },
  });

  if (!blogs.length) {
    return res
      .status(404)
      .json({ message: "No blogs found matching your search" });
  }

  res.status(200).json(blogs);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { title, content, published } = req.body;
  const authorId = req.userAuthId;
  const { slug } = req.params;

  if (!authorId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!blog) return res.status(404).json({ message: "Blog not found" });
  if (blog.authorId !== authorId)
    return res.status(403).json({ message: "Unauthorized" });

  let newSlug = blog.slug;
  if (title) {
    newSlug = slugify(title, { lower: true, strict: true });
    let counter = 1;
    while (true) {
      const existing = await prisma.blog.findUnique({
        where: { slug: newSlug },
      });
      if (!existing || existing.id === blog.id) break;
      newSlug = `${slugify(title, { lower: true, strict: true })}-${counter++}`;
    }
  }

  const updatedBlog = await prisma.blog.update({
    where: { slug },
    data: {
      title: title || blog.title,
      content: content || blog.content,
      published: published !== undefined ? Boolean(published) : blog.published,
      slug: newSlug,
      coverImage: req.files?.coverImage?.[0]?.path || blog.coverImage,
      images: req.files?.images
        ? req.files.images.map((f) => f.path)
        : blog.images,
    },
  });

  res.status(200).json(updatedBlog);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.userAuthId;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (blog.authorId !== userId && user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // Delete related records explicitly
  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { blogId: blog.id } }),
    prisma.like.deleteMany({ where: { blogId: blog.id } }),
    prisma.categoriesOnBlogs.deleteMany({ where: { blogId: blog.id } }),
    prisma.blog.delete({ where: { slug } }),
  ]);

  res.status(200).json({ message: "Blog deleted successfully" });
});

export const latestBlogs = asyncHandler(async (req, res) => {
  const latestBlogs = await prisma.blog.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
      categories: { include: { category: true } },
      comments: true,
      likes: true,
    },
    take: 3,
  });

  res.status(200).json(latestBlogs);
});

export const trendingBlogs = asyncHandler(async (req, res) => {
  const trendingBlogs = await prisma.blog.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
      categories: { include: { category: true } },
      comments: true,
      likes: true,
    },
    take: 3,
    orderBy: [{ likes: { _count: "desc" } }, { comments: { _count: "desc" } }],
  });

  res.status(200).json(trendingBlogs);
});

export const relatedBlogs = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { categories: true },
  });

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const categoryIds = blog.categories.map((cat) => cat.categoryId);

  const relatedBlogs = await prisma.blog.findMany({
    where: {
      slug: { not: slug },
      published: true,
      categories: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
      categories: { include: { category: true } },
      comments: true,
      likes: true,
    },
  });

  if (!relatedBlogs.length) {
    return res.status(404).json({ message: "No related blogs found" });
  }

  res.status(200).json(relatedBlogs);
});

export const getAllPostOfAuthor = asyncHandler(async (req, res) => {
  const { id } = req.query;
  const authorBlogs = await prisma.blog.findMany({
    where: { authorId: id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
      categories: { include: { category: true } },
      comments: true,
      likes: true,
    },
  });

  res.status(200).json(authorBlogs);
});

export const fetchBlogsCategoryWise = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const blogs = await prisma.blog.findMany({
    where: {
      categories: {
        some: {
          category: {
            name: name,
          },
        },
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
      categories: { include: { category: true } },
      comments: true,
      likes: true,
    },
  });

  res.status(200).json(blogs);
});
