import { RateLimiter } from "@/src/lib/classes/RateLimiter";
import { adminDb } from "@/src/lib/firebaseAdmin";
import { verifyRequest } from "@/src/lib/verifyRequest";
import { NextResponse } from "next/server";

const limiter = new RateLimiter({ limit: 5, windowMs: 60_000 });

export async function POST(request: Request) {
    try {
        const check = await verifyRequest(request);
        if (!check.authorized) return check.response;

        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!limiter.check(ip)) {
            return NextResponse.json(
                { success: false },
                { status: 429 }
            );
        }

        const data = await request.json();
        await adminDb.collection("forms").add({
            ...data,
            createdAt: new Date().toISOString()
        });

        return NextResponse.json({ success: true });

    } catch(error: unknown) {
        const err = error as Error;
        console.error(err);
        return NextResponse.json(
            {
                success: false,
                error: err.message,
            },
            { status: 500 }
        );
    }
}