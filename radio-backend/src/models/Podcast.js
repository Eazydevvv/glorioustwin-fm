import mongoose from 'mongoose';
import { toSlug } from './common.js';


const PodcastSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        host: { type: String, required: true, trim: true },
        duration: { type: Number, required: true, min: 0 }, // seconds
        imageUrl: { type: String },
        audioUrl: { type: String }, // optional if you later host audio
        slug: { type: String, unique: true, index: true }
    },
    { timestamps: true }
);


PodcastSchema.pre('save', function (next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = toSlug(this.title);
    }
    next();
});


export default mongoose.model('Podcast', PodcastSchema);