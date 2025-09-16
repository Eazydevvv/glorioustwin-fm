import Podcast from '../models/Podcast.js';
import { validationResult } from 'express-validator';

export const createPodcast = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("Request files received:", req.files);
    console.log("Request body:", req.body);

    const { title, description, host, duration, category } = req.body;

    // DEBUG: Check what files were uploaded
    if (req.files) {
      console.log("Cover image file:", req.files.coverImage);
      console.log("Audio file:", req.files.audioFile);
    }

    // Handle file URLs
    let imageUrl = null;
    let audioUrl = null;

   // In controllers/podcasts.controller.js - CHANGE THESE LINES:

if (req.files?.coverImage?.[0]) {
  imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.coverImage[0].filename}`;
}

if (req.files?.audioFile?.[0]) {
  audioUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.audioFile[0].filename}`;
}

    // ... rest of your code

    // Create podcast
    const podcast = new Podcast({
      title,
      description,
      host,
      duration,
      category: category || "General",
      imageUrl,
      audioUrl
    });

    await podcast.save();
    res.status(201).json(podcast);
  } catch (err) {
    console.error('Error creating podcast:', err);
    next(err);
  }
};

export const listPodcasts = async (req, res, next) => {
  try {
    const podcasts = await Podcast.find().sort({ createdAt: -1 });
    res.json({ data: podcasts });
  } catch (err) {
    next(err);
  }
};

export const getPodcast = async (req, res, next) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    res.json(podcast);
  } catch (err) {
    next(err);
  }
};

export const updatePodcast = async (req, res, next) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    const { title, description, host, duration, category } = req.body;

    podcast.title = title ?? podcast.title;
    podcast.description = description ?? podcast.description;
    podcast.host = host ?? podcast.host;
    podcast.duration = duration ?? podcast.duration;
    podcast.category = category ?? podcast.category;

    if (req.file) {
      podcast.imageUrl = `/uploads/${req.file.filename}`;
    }

    await podcast.save();
    res.json(podcast);
  } catch (err) {
    next(err);
  }
};

export const deletePodcast = async (req, res, next) => {
  try {
    const podcast = await Podcast.findByIdAndDelete(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    res.json({ message: 'Podcast deleted successfully' });
  } catch (err) {
    next(err);
  }
};