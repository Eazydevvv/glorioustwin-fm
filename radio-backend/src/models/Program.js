import mongoose from 'mongoose';
import { toSlug } from './common.js';


const ProgramSchema = new mongoose.Schema(
{
title: { type: String, required: true, trim: true },
description: { type: String, required: true },
host: { type: String, required: true, trim: true },
startTime: { type: Date, required: true },
endTime: { type: Date, required: true },
imageUrl: { type: String },
status: { type: String, enum: ['scheduled', 'cancelled', 'completed'], default: 'scheduled' },
slug: { type: String, unique: true, index: true }
},
{ timestamps: true }
);


ProgramSchema.pre('save', function (next) {
if (this.isModified('title') || !this.slug) {
this.slug = toSlug(this.title);
}
next();
});


export default mongoose.model('Program', ProgramSchema);