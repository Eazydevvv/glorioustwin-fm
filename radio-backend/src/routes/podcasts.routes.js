// src/routes/podcasts.routes.js
import { Router } from "express";
import multer from "multer";
import {
  listPodcasts,
  getPodcast,
  createPodcast,
  updatePodcast,
  deletePodcast
} from "../controllers/podcasts.controller.js";

const router = Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Routes
router.get("/", listPodcasts);                         // List with pagination & search
router.get("/:slug", getPodcast);                      // Get one by slug
router.post("/", upload.single("image"), createPodcast);  // Create with image
router.put("/:slug", upload.single("image"), updatePodcast); // Update with image
router.delete("/:slug", deletePodcast);                // Delete

export default router;
