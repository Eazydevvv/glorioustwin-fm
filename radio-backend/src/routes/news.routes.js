// src/routes/news.routes.js
import { Router } from "express";
import multer from "multer";
import {
  listNews,
  getNews,
  createNews,
  updateNews,
  deleteNews
} from "../controllers/news.controller.js";

const router = Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Routes
router.get("/", listNews);                // List with pagination & search
router.get("/:slug", getNews);            // Get one by slug
router.post("/", upload.single("image"), createNews);  // Create with image
router.put("/:slug", upload.single("image"), updateNews); // Update with image
router.delete("/:slug", deleteNews);      // Delete

export default router;
