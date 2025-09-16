import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/signup", register); // Add this line to support both endpoints
router.post("/login", login);

export default router;