"use server";

import jwt from "jsonwebtoken";

export async function generateToken(): Promise<string> {
    const token = jwt.sign({ ts: Date.now() }, process.env.API_SECRET!, {
        expiresIn: "10m",
    });
    return token;
} 