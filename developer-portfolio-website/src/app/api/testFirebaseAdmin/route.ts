import { NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebaseAdmin";
import { verifyRequest } from "@/src/lib/verifyRequest";

export async function GET(request: Request) {
    try {
        const check = await verifyRequest(request);
        if (!check.authorized) return check.response;
        
        const snapshot = await adminDb.collection("test").limit(1).get();

        return NextResponse.json({
            success: true,
            message: "Firebase Admin initialized successfully",
            docCount: snapshot.size,
        });
    } catch (error: unknown) {
        const err = error as Error;
        console.error("Firebase Admin init failed", err);
        return NextResponse.json(
            {
                success: false,
                message: "Firebase Admin initialization failed",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
