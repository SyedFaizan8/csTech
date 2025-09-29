import express from "express";
import multer from "multer";
import { parse as csvParseSync } from "csv-parse/sync";
import fs from "fs/promises";
import path from "path";
import xlsx from "xlsx";
import prisma from "../prismaClient.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

type ItemRow = { firstName: string; phone: string; notes?: string };

async function parseFile(filepath: string, originalName: string): Promise<ItemRow[]> {
    const ext = path.extname(originalName).toLowerCase();

    if (ext === ".xlsx" || ext === ".xls") {
        // XLSX parse
        const wb = xlsx.readFile(filepath);
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = xlsx.utils.sheet_to_json(sheet, { defval: "" }) as any[];
        return json.map((r) => ({
            firstName: String(r.FirstName || r.firstName || r.fname || r.name || "").trim(),
            phone: String(r.Phone || r.phone || r.PhoneNumber || "").trim(),
            notes: String(r.Notes || r.notes || "").trim(),
        }));
    } else {
        // CSV parse (sync)
        const text = await fs.readFile(filepath, "utf8");
        const records = csvParseSync(text, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        }) as any[];

        return records.map((r) => ({
            firstName: String(r.FirstName || r.firstName || r.fname || r.name || "").trim(),
            phone: String(r.Phone || r.phone || r.PhoneNumber || "").trim(),
            notes: String(r.Notes || r.notes || "").trim(),
        }));
    }
}

function distribute(items: any[], agents: { id: string }[]) {
    const total = items.length;
    const m = agents.length;
    const base = Math.floor(total / m);
    let remainder = total % m;
    const assignments: { agentId: string; items: any[] }[] = [];
    let index = 0;

    for (let i = 0; i < m; i++) {
        const count = base + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        const slice = items.slice(index, index + count);
        assignments.push({ agentId: agents[i].id, items: slice });
        index += count;
    }
    return assignments;
}

router.post("/", requireAuth, upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "File required" });

    const allowed = [".csv", ".xlsx", ".xls"];
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
        // remove temp file
        await fs.unlink(req.file.path).catch(() => { });
        return res.status(400).json({ message: "Only csv, xlsx, xls allowed" });
    }

    try {
        const items = await parseFile(req.file.path, req.file.originalname);

        // Validate: require firstName and phone
        const invalid = items.filter((it) => !it.firstName || !it.phone);
        if (invalid.length > 0) {
            await fs.unlink(req.file.path).catch(() => { });
            return res.status(400).json({ message: "Some rows missing FirstName or Phone" });
        }

        // Save list items
        const createdItems = await Promise.all(
            items.map((it) =>
                prisma.listItem.create({
                    data: { firstName: it.firstName, phone: it.phone, notes: it.notes || "" },
                })
            )
        );

        // Grab first 5 agents (require at least 5)
        const agents = await prisma.agent.findMany({ take: 5 });
        if (agents.length < 5) {
            await fs.unlink(req.file.path).catch(() => { });
            return res.status(400).json({ message: "Need at least 5 agents to distribute" });
        }

        const assignments = distribute(createdItems, agents);

        // Persist assignments (for Mongo embedded array, use set)
        const savedAssignments = [];
        for (const a of assignments) {
            const assignment = await prisma.assignment.create({
                data: {
                    agentId: a.agentId,
                    items: {
                        connect: a.items.map((it: any) => ({ id: it.id })) // <-- connect existing ListItem records
                    }, // works with embedded ListItem[] in Prisma+Mongo
                },
            });
            savedAssignments.push(assignment);
        }

        await fs.unlink(req.file.path).catch(() => { });
        return res.json({ message: "Distributed", assignments: savedAssignments });
    } catch (err: any) {
        await fs.unlink(req.file?.path || "").catch(() => { });
        console.error("Upload error:", err);
        return res.status(500).json({ message: err.message || "Server error" });
    }
});

export default router;
