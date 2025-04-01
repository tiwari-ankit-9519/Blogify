import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

const prisma = new PrismaClient();

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, provider, providerId, image } = req.body;
  let profileImage = req.file ? req.file.path : null;
  const newProvider = provider?.toUpperCase();

  if (newProvider && providerId) {
    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required for OAuth users",
      });
    }
  } else {
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please fill in all required fields",
      });
    }
  }

  let existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (newProvider && existingUser.provider === newProvider) {
      const token = generateToken(existingUser.id);
      return res.status(200).json({
        status: "success",
        message: "Login successful",
        token,
        user: existingUser,
      });
    }

    return res.status(400).json({
      status: "error",
      message: "User already exists with this email",
    });
  }

  let hashedPassword = null;
  let finalName = name || `User-${Date.now()}`;

  if (newProvider && providerId) {
    finalName = name || `User-${Date.now()}`;
    profileImage = image || profileImage;
  } else {
    hashedPassword = bcrypt.hashSync(password, 10);
  }

  const newUser = await prisma.user.create({
    data: {
      name: finalName,
      email,
      password: hashedPassword,
      image: profileImage,
      provider: newProvider || null,
      providerId: providerId || null,
    },
  });

  const token = generateToken(newUser.id);

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    token,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, provider, providerId } = req.body;

  const newProvider = provider?.toUpperCase();

  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Email is required",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  if (newProvider && providerId) {
    if (user.provider !== newProvider || user.providerId !== providerId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OAuth credentials",
      });
    }

    const token = generateToken(user.id);
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user,
    });
  }

  if (!password) {
    return res.status(400).json({
      status: "error",
      message: "Password is required",
    });
  }

  if (!user.password) {
    return res.status(400).json({
      status: "error",
      message:
        "This account was registered using Google. Please log in using Google.",
    });
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return res.status(401).json({
      status: "error",
      message: "Invalid password",
    });
  }

  const token = generateToken(user.id);

  const { password: userPassword, ...userWithoutPassword } = user;

  res.status(200).json({
    status: "success",
    message: "Login successful",
    token,
    user: userWithoutPassword,
  });
});

export const userProfile = asyncHandler(async (req, res) => {
  const userId = req.userAuthId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      blogs: true,
      comments: true,
      likes: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  const { password, ...userWithoutPassword } = user;

  res.status(200).json({
    status: "success",
    message: "User profile retrieved successfully",
    user: userWithoutPassword,
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.userAuthId;
  const { name, email, password, bio } = req.body;

  const image = req.file ? req.file.path : null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      blogs: true,
      comments: true,
      likes: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  if (email && user.provider === "GOOGLE") {
    return res.status(400).json({
      status: "error",
      message: "Google-authenticated users cannot change their email",
    });
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = bcrypt.hashSync(password, 10);
  if (image) updateData.image = image;
  if (bio) updateData.bio = bio;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      status: "error",
      message: "No valid fields to update",
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  res.status(200).json({
    status: "success",
    message: "User profile updated successfully",
    user: updatedUser,
  });
});
