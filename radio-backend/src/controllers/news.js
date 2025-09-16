const News = require('../models/News');

exports.getNews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const news = await News.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await News.countDocuments();

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      items: news
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
