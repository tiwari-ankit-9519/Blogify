import { config } from "dotenv";
config();

import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { clerkMiddleware } from "@clerk/express";

const prisma = new PrismaClient();

export const isLoggedIn = async (req, res, next) => {
  try {
    if (req.auth && req.auth.userId) {
      req.userAuthId = req.auth.userId;
      return next();
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    req.userAuthId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Not authorized" });
  }
};

export const isAdmin = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userAuthId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    res.status(403);
    throw new Error("Unauthorized: Admin access required");
  }
  next();
};

export const clerkAuth = clerkMiddleware();
