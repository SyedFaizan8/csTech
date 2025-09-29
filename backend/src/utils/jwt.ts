import jwt, { SignOptions, Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = (process.env.JWT_SECRET || "change_me") as Secret;

export function signJwt(
    payload: object,
    expiresIn: SignOptions["expiresIn"] = "7d"
): string {
    const opts: SignOptions = { expiresIn };
    // jwt.sign accepts payload as string | object | Buffer
    return jwt.sign(payload as string | object | Buffer, JWT_SECRET, opts);
}

export function verifyJwt<T>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
}
