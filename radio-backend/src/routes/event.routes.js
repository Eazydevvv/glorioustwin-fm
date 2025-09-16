import express from "express";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from "../controllers/event.controller.js";

const router = express.Router();

router.post("/", createEvent);   // Create Event
router.get("/", getEvents);      // Get all Events
router.get("/:id", getEventById); // Get single Event
router.put("/:id", updateEvent);  // Update Event
router.delete("/:id", deleteEvent); // Delete Event

export default router;
