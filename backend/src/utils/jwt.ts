import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_me";

export function signJwt(payload: object, expiresIn = "7d") {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt<T>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
}
