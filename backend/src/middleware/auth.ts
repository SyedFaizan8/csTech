import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export interface AuthRequest extends Request {
    user?: any;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        const payload = verifyJwt<any>(token);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
