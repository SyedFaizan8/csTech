import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../prismaClient.js";
import { signJwt } from "../utils/jwt.js";

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = signJwt({ id: user.id, email: user.email });
    // Set httpOnly cookie
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    return res.json({ message: "ok", user: { id: user.id, email: user.email } });
});

// Simple endpoint to create admin for first time (only for dev)
// You may remove in production or protect with env flag
router.post("/seed-admin", async (req, res) => {
    const { email, password, name } = req.body;
    console.log(email, password)
    if (!email || !password) return res.status(400).json({ message: "Missing" });
    const hashed = await bcrypt.hash(password, 10);
    const u = await prisma.adminUser.create({ data: { email, password: hashed, name } });
    res.json(u);
});

export default router;
