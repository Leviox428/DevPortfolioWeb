import { adminAuth, adminDb } from "@/src/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {    
        const snapshot = await adminDb.collection("reviews").get();
        const reviews = snapshot.docs.map((doc) => doc.data());
        return NextResponse.json(reviews);
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

export async function POST(request: NextRequest) {
    try {
        const firebaseToken = request.headers.get("Auth");

        if (!firebaseToken) {
            return NextResponse.json({ error: "Missing Firebase ID token" }, { status: 401 });
        }

        const decoded = await adminAuth.verifyIdToken(firebaseToken);

        const { author, content, stars } = await request.json();
        const review = {
            author,
            content,
            stars,
            userId: decoded.uid,
            createdAt: new Date().toISOString(),
        };

        const docRef = await adminDb.collection("reviews").add(review);
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