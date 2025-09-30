// backend/src/routes/agents.ts
import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../prismaClient.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// create agent
router.post("/", requireAuth, async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) return res.status(400).json({ ok: false, message: "Missing fields" });
        const hashed = await bcrypt.hash(password, 10);
        const agent = await prisma.agent.create({ data: { name, email, phone, password: hashed } });
        const safe = { id: agent.id, name: agent.name, email: agent.email, phone: agent.phone };
        return res.json({ ok: true, agent: safe });
    } catch (err: any) {
        console.error("Create agent error:", err);
        return res.status(400).json({ ok: false, message: err.message || "Create failed" });
    }
});

// list agents
router.get("/", requireAuth, async (req, res) => {
    try {
        const agents = await prisma.agent.findMany({ orderBy: { createdAt: "desc" } });
        const safe = agents.map(a => ({ id: a.id, name: a.name, email: a.email, phone: a.phone }));
        return res.json({ ok: true, agents: safe });
    } catch (err: any) {
        console.error("List agents error:", err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
});

// delete agent (cleanup assignments & unassign list items)
router.delete("/:id", requireAuth, async (req, res) => {
    const agentId = req.params.id;
    try {
        // find assignments for this agent
        const assignments = await prisma.assignment.findMany({ where: { agentId } });
        const assignmentIds = assignments.map(a => a.id);

        if (assignmentIds.length > 0) {
            // clear assignmentId on list items
            await prisma.listItem.updateMany({
                where: { assignmentId: { in: assignmentIds } as any },
                data: { assignmentId: null }
            });

            // delete assignment records
            await prisma.assignment.deleteMany({ where: { agentId } });
        }

        // delete the agent
        await prisma.agent.delete({ where: { id: agentId } });

        return res.json({ ok: true, message: "Agent and related assignments deleted" });
    } catch (err: any) {
        console.error("Delete agent error:", err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
});

export default router;
