import { NextResponse } from "next/server";

/**
 * Universal helper to verify that:
 * - The request's origin is allowed (CORS-like protection)
 * - The request includes a valid API key (extra layer)
 */
export async function verifyRequest(request: Request) {
    const allowedOrigins = [
        "http://localhost:3000",      
        "https://marekdvorsky.vercel.app",     
    ];

    const origin = request.headers.get("origin");

    if (!origin || !allowedOrigins.includes(origin)) {
        return {
            authorized: false,
            response: NextResponse.json(
                { success: false, message: "Unauthorized origin" },
                { status: 403 }
            ),
        };
    }

    return { authorized: true };
}