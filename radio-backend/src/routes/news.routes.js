import { Router } from "express";
import multer from "multer";
import { body } from "express-validator";
import {
  listNews,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  getAllNews,
} from "../controllers/news.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Save to uploads folder
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'news-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});
// Public reads
router.get("/", listNews);     // paginated (responds {page,limit,total,items})
router.get("/all", getAllNews); // full list (array)
router.get("/:slug", getNews);

// Protected writes
router.post(
  "/",
  requireAuth,
  upload.single("image"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("summary").notEmpty().withMessage("Summary is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("author").notEmpty().withMessage("Author is required"),
  ],
  createNews
);

router.put("/:slug", requireAuth, upload.single("image"), updateNews);
router.delete("/:slug", requireAuth, deleteNews);

export default router;
