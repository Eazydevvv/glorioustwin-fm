import News from '../models/News.js';
import { validationResult } from 'express-validator';
import { buildPagination, makeFileUrl } from './utils.js';


export const listNews = async (req, res, next) => {
    try {
        const { page, limit, skip } = buildPagination(req);
        const { q, category } = req.query;
        const filter = {};
        if (q) filter.$text = { $search: q };
        if (category) filter.category = category;


        const [items, total] = await Promise.all([
            News.find(filter).sort({ datetime: -1 }).skip(skip).limit(limit),
            News.countDocuments(filter)
        ]);


        res.json({ page, limit, total, items });
    } catch (err) { next(err); }
};


export const getNews = async (req, res, next) => {
    try {
        const item = await News.findOne({ slug: req.params.slug });
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json(item);
    } catch (err) { next(err); }
};


export const createNews = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


        const imageUrl = makeFileUrl(req, req.file?.filename);


        const item = await News.create({
            title: req.body.title,
            summary: req.body.summary,
            content: req.body.content,
            datetime: new Date(req.body.datetime),
            category: req.body.category,
            author: req.body.author,
            imageUrl
        });


        res.status(201).json(item);
    } catch (err) { next(err); }
};


export const updateNews = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


        const imageUrl = req.file ? makeFileUrl(req, req.file.filename) : undefined;


        const item = await News.findOne({ slug: req.params.slug });
        if (!item) return res.status(404).json({ message: 'Not found' });


        item.title = req.body.title ?? item.title;
        item.summary = req.body.summary ?? item.summary;
        item.content = req.body.content ?? item.content;
        item.datetime = req.body.datetime ? new Date(req.body.datetime) : item.datetime;
        item.category = req.body.category ?? item.category;
        item.author = req.body.author ?? item.author;
        if (imageUrl) item.imageUrl = imageUrl;


        await item.save();
        res.json(item);
    } catch (err) { next(err); }
};


export const deleteNews = async (req, res, next) => {
    try {
        const item = await News.findOneAndDelete({ slug: req.params.slug });
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (err) { next(err); }
};