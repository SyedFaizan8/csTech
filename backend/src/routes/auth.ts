import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prismaClient.js";
import { signJwt } from "../utils/jwt.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// Admin login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ ok: false, message: "Missing credentials" });

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ ok: false, message: "Invalid credentials" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ ok: false, message: "Invalid credentials" });

        const token = signJwt({ id: user.id, email: user.email });
        res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });

        return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
});

// ME - returns current user
router.get("/me", requireAuth, async (req: any, res) => {
    try {
        const user = await prisma.adminUser.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ ok: false, message: "Not found" });
        return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
});

// Simple endpoint to create admin for first time (only for dev)
// You may remove in production or protect with env flag
router.post("/seed-admin", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) return res.status(400).json({ ok: false, message: "Missing email or password" });

        const exists = await prisma.adminUser.findFirst({ where: { email } })
        if (exists) {
            return res.status(400).json({ ok: false, message: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const u = await prisma.adminUser.create({ data: { email, password: hashed, name } });
        return res.status(201).json({ ok: true, user: { id: u.id, email, name: name ?? null } });
    } catch (e) {
        console.log(e)
        return res.status(500).json({ ok: false, message: "Server error" });
    }
});

// LOGOUT
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ ok: true });
});

export default router;