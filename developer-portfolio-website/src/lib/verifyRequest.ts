import { NextResponse } from "next/server";

/**
 * Universal helper to verify that:
 * - The request's origin is allowed (CORS-like protection)
 * - The request includes a valid API key (extra layer)
 */
export async function verifyRequest(request: Request) {
    const allowedOrigins = [
        "http://localhost:3000",      
        "https://yourdomain.com",     
    ];

    const origin = request.headers.get("origin");
    const apiKey = request.headers.get("x-api-key");

    if (!origin || !allowedOrigins.includes(origin)) {
        return {
            authorized: false,
            response: NextResponse.json(
                { success: false, message: "Unauthorized origin" },
                { status: 403 }
            ),
        };
    }

    if (apiKey !== process.env.API_SECRET_KEY) {
        return {
            authorized: false,
            response: NextResponse.json(
                { success: false, message: "Invalid API key" },
                { status: 401 }
            ),
        };
    }
    return { authorized: true };
}