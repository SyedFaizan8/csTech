import express from "express";
import prisma from "../prismaClient.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// GET /api/assignments?agentId=optional
router.get("/", requireAuth, async (req, res) => {
    try {
        const { agentId } = req.query;
        const where = agentId ? { agentId: String(agentId) } : undefined;
        const assignments = await prisma.assignment.findMany({
            where,
            include: { items: true },
            orderBy: { createdAt: "desc" }
        });

        const mapped = assignments.map(a => ({
            id: a.id,
            agentId: a.agentId,
            items: (a.items || []).map(it => ({ id: it.id, firstName: it.firstName, phone: it.phone, notes: it.notes })),
            createdAt: a.createdAt
        }));

        return res.json({ ok: true, assignments: mapped });
    } catch (err: any) {
        console.error("Get assignments error:", err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
});

export default router;
