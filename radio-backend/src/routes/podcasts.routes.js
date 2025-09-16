import { Router } from "express";
import multer from "multer";
import { body } from "express-validator";
import {
  listPodcasts,
  getPodcast,
  createPodcast,
  updatePodcast,
  deletePodcast,
} from "../controllers/podcasts.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Replace your current Multer configuration with this:

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // PROPERLY handle both image and audio files
    if (file.fieldname === 'coverImage') {
      cb(null, 'podcast-image-' + uniqueSuffix + '.jpg');
    } else if (file.fieldname === 'audioFile') {
      cb(null, 'podcast-audio-' + uniqueSuffix + '.mp3');
    } else {
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for audio files
  },
  fileFilter: (req, file, cb) => {
    // ACCEPT both images and audio
    if (file.fieldname === 'coverImage') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for cover!'), false);
      }
    } else if (file.fieldname === 'audioFile') {
      // ACCEPT audio files (mp3, wav, etc.)
      if (file.mimetype.startsWith('audio/') || file.mimetype === 'audio/mpeg') {
        cb(null, true);
      } else {
        cb(new Error('Only audio files are allowed!'), false);
      }
    } else {
      cb(new Error(`Unexpected field: ${file.fieldname}`), false);
    }
  }
});

// Public routes
router.get("/", listPodcasts);
router.get("/:id", getPodcast);

// Protected routes
router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 }
  ]),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("host").notEmpty().withMessage("Host is required"),
    body("duration").notEmpty().withMessage("Duration is required"),
  ],
  createPodcast
);

router.put("/:id", requireAuth, upload.single("coverImage"), updatePodcast);
router.delete("/:id", requireAuth, deletePodcast);

export default router;