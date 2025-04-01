import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const fetchAllCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
});
