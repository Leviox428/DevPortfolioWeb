import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

/**
 * Universal helper to verify that:
 * - The request's origin is allowed (CORS-like protection)
 * - The request includes a valid JWT token (extra layer)
 */
const allowedOrigins = [
    "http://localhost:3000",      
    "https://marekdvorsky.vercel.app",     
];

export async function verifyRequest(request: Request) {
    const origin = request.headers.get("origin");

    if (!origin || !allowedOrigins.includes(origin)) {
        return {
            authorized: false,
            response: NextResponse.json(
                { success: false, message: "Unauthorized origin" },
                { status: 401 }
            ),
        };
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
            authorized: false,
            response: NextResponse.json(
                { success: false, message: "Missing or invalid Authorization header" },
                { status: 402 }
            ),
        };
    }
    console.log(authHeader);
    const token = authHeader.substring(7); 
    try {
        const secret = new TextEncoder().encode(process.env.API_SECRET!);
        await jwtVerify(token, secret);
        return { authorized: true };
    } catch (err) {
        console.error("JWT verification failed:", err);
        return {
            authorized: false,
            response: NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 403 }
            ),
        };
    }
}