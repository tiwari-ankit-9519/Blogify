import { Router } from "express";
import {
  createUser,
  loginUser,
  updateUserProfile,
  userProfile,
} from "../controllers/auth.controller.js";
import upload from "../config/upload.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = Router();

router.post("/register", upload.single("image"), createUser);
router.post("/login", loginUser);
router.get("/profile", isLoggedIn, userProfile);
router.put(
  "/update-profile",
  isLoggedIn,
  upload.single("image"),
  updateUserProfile
);

export default router;
