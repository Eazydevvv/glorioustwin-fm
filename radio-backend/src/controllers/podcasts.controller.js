import Podcast from '../models/Podcast.js';
import { validationResult } from 'express-validator';
import { buildPagination, makeFileUrl } from './utils.js';

/**
 * Podcasts controller
 * - robust search using regex (fallback to text index is recommended for production)
 * - pagination
 * - image handling via multer (req.file)
 */

// List all podcasts with search + pagination
export const listPodcasts = async (req, res, next) => {
  try {
    const { page, limit, skip } = buildPagination(req);
    const { q, host } = req.query;

    const filter = {};

    // Search logic
    if (q) {
      // Try text search if index exists
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { host: { $regex: q, $options: 'i' } }
      ];
    }

    if (host) {
      filter.host = { $regex: host, $options: 'i' };
    }

    const total = await Podcast.countDocuments(filter);
    const podcasts = await Podcast.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      total,
      data: podcasts
    });
  } catch (err) {
    next(err);
  }
};

// Get a single podcast by ID
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

// Create a podcast
export const createPodcast = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, host, duration } = req.body;

    const podcast = new Podcast({
      title,
      description,
      host,
      duration,
      image: req.file ? makeFileUrl(req, req.file.filename) : null
    });

    await podcast.save();
    res.status(201).json(podcast);
  } catch (err) {
    next(err);
  }
};

// Update a podcast
export const updatePodcast = async (req, res, next) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    const { title, description, host, duration } = req.body;

    podcast.title = title ?? podcast.title;
    podcast.description = description ?? podcast.description;
    podcast.host = host ?? podcast.host;
    podcast.duration = duration ?? podcast.duration;

    if (req.file) {
      podcast.image = makeFileUrl(req, req.file.filename);
    }

    await podcast.save();
    res.json(podcast);
  } catch (err) {
    next(err);
  }
};

// Delete a podcast
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
