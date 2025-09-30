import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.js";

export interface AuthRequest extends Request {
    user?: any;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);
    if (!token) return res.status(401).json({ ok: false, message: "Unauthorized" });
    try {
        const payload = verifyJwt<any>(token);
        req.user = payload;
        next();
    } catch (err: any) {
        console.error("Auth verify failed:", err);
        return res.status(401).json({ ok: false, message: "Invalid token" });
    }
}
