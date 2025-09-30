import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../prismaClient.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// Create agent
router.post("/", requireAuth, async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) return res.status(400).json({ ok: false, message: "Missing fields" });
        const hashed = await bcrypt.hash(password, 10);
        const agent = await prisma.agent.create({ data: { name, email, phone, password: hashed } });
        // Do not return password
        const safe = { id: agent.id, name: agent.name, email: agent.email, phone: agent.phone };
        return res.json({ ok: true, agent: safe });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ ok: false, message: err.message || "Create failed" });
    }
});

// List agents
router.get("/", requireAuth, async (req, res) => {
    try {
        const agents = await prisma.agent.findMany({ orderBy: { createdAt: "desc" } });
        const safe = agents.map(a => ({ id: a.id, name: a.name, email: a.email, phone: a.phone }));
        res.json({ ok: true, agents: safe });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
});

export default router;
