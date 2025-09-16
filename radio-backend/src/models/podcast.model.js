import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    host: { type: String },
    duration: { type: String }, // e.g. "45:20"
    image: { type: String }, // Cloudflare image link
    audioUrl: { type: String, required: true }, // Cloudflare audio file link
  },
  { timestamps: true }
);

export default mongoose.model("Podcast", podcastSchema);
