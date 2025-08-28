// src/routes/index.js
import express from "express";
import newsRoutes from "./news.routes.js";
import podcastRoutes from "./podcasts.routes.js";

const router = express.Router();

// attach routes
router.use("/news", newsRoutes);
router.use("/podcasts", podcastRoutes);

export default router;
