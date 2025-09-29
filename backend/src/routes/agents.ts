import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../prismaClient.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Create agent
router.post("/", requireAuth, async (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) return res.status(400).json({ message: "Missing fields" });
    const hashed = await bcrypt.hash(password, 10);
    try {
        const agent = await prisma.agent.create({
            data: { name, email, phone, password: hashed }
        });
        res.json(agent);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// List agents
router.get("/", requireAuth, async (req, res) => {
    const agents = await prisma.agent.findMany();
    res.json(agents);
});

// Update & delete similar — shortened for brevity
export default router;
