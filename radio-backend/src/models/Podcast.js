import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    host: { type: String, required: true },
    duration: { type: String, required: true },
    category: { type: String, default: "General" },
    imageUrl: { type: String },
    audioUrl: { type: String, required: true },
    slug: { type: String, unique: true } // This is causing the error
  },
  { timestamps: true }
);

// ADD SLUG GENERATION CODE:
podcastSchema.pre("save", function(next) {
  if (this.isModified("title") && this.title) {
    // Generate slug from title
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-") // Replace multiple - with single -
      .trim("-"); // Trim - from start and end
  }
  
  // If slug is still empty (title was empty or slug generation failed)
  if (!this.slug) {
    // Generate a random unique slug as fallback
    this.slug = `podcast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  next();
});

export default mongoose.model("Podcast", podcastSchema);