import mongoose from 'mongoose';
import { toSlug } from './common.js';


const NewsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        summary: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        imageUrl: { type: String },
        datetime: { type: Date, required: true },
        category: { type: String, required: true, trim: true },
        author: { type: String, required: true, trim: true },
        slug: { type: String, unique: true, index: true }
    },
    { timestamps: true }
);


NewsSchema.pre('save', function (next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = toSlug(this.title);
    }
    next();
});


export default mongoose.model('News', NewsSchema);