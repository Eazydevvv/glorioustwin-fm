import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String },
  image: { type: String },
  category: { type: String, enum: ["concert", "seminar", "show", "festival", "other"], default: "other" }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;
