import mongoose from "mongoose";


const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Stores filename
  imageUrl: { type: String }, // Stores full URL
  category: { type: String, required: true },
  author: { type: String, required: true },
  datetime: { type: Date, default: Date.now },
  slug: { type: String, unique: true }
});
// ADD THIS SLUG GENERATION CODE:
newsSchema.pre("save", function(next) {
  if (this.isModified("title") && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }
  
  if (!this.slug) {
    this.slug = `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  next()
});

export default mongoose.model("News", newsSchema);