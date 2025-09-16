import express from "express";
import News from "../models/News.js";  // ✅ use import, not require

const router = express.Router();

// Sample News Data (fallback for testing)
const newsData = [
  {
    id: 1,
    title: "Breaking News: AI takes over",
    summary: "AI is now smarter than humans...",
    content: "Full article content goes here...",
    image: "https://via.placeholder.com/300",
    date: "2025-08-28",
    category: "Technology",
    author: "Admin",
  },
  {
    id: 2,
    title: "Sports Update",
    summary: "The local team wins the match...",
    content: "Full article content goes here...",
    image: "https://via.placeholder.com/300",
    date: "2025-08-27",
    category: "Sports",
    author: "Reporter",
  },
];


// GET /api/news
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedData = newsData.slice(startIndex, endIndex).map((item) => ({
    _id: item.id, // 🔄 change id -> _id
    ...item,
  }));

  res.json(paginatedData); // 🔄 return array directly
});


// POST /api/news (store in DB)
router.post("/", async (req, res) => {
  try {
    const { title, summary, content, image, category, author } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ message: "Title, summary and content are required" });
    }

    const news = new News({
      title,
      summary,
      content,
      image,
      category,
      author,
    });

    await news.save();
    res.status(201).json({ message: "News created successfully", news });
  } catch (error) {
    res.status(500).json({ message: "Error creating news", error: error.message });
  }
});

export default router;
