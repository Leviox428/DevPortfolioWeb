import { adminAuth, adminDb } from "@/src/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import type { Query } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {

    try { 
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        let query: Query = adminDb.collection("reviews");

        if (userId) {
            query = query.where("userId", "==", userId);
        }

        const snapshot = await query.get();
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

        if (!author || typeof author !== "string") {
            return NextResponse.json({ error: "Invalid author" }, { status: 400 });
        }

        if (!content || typeof content !== "string" || content.length < 10) {
            return NextResponse.json({ error: "Invalid content" }, { status: 400 });
        }

        if (!stars || typeof stars !== "number" || stars < 1 || stars > 5) {
            return NextResponse.json({ error: "Invalid stars" }, { status: 400 });
        }


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

export async function PATCH(request: NextRequest) {
    try {
        const firebaseToken = request.headers.get("Auth");
        if (!firebaseToken) return NextResponse.json({ error: "Missing Firebase ID token" }, { status: 401 });

        const decoded = await adminAuth.verifyIdToken(firebaseToken);
        const { reviewId, content, stars } = await request.json();

        if (!reviewId || typeof reviewId !== "string") return NextResponse.json({ error: "Invalid reviewId" }, { status: 400 });
        if (content && (typeof content !== "string" || content.length < 10)) return NextResponse.json({ error: "Invalid content" }, { status: 400 });
        if (stars && (typeof stars !== "number" || stars < 1 || stars > 5)) return NextResponse.json({ error: "Invalid stars" }, { status: 400 });

        const reviewRef = adminDb.collection("reviews").doc(reviewId);
        const doc = await reviewRef.get();
        if (!doc.exists) return NextResponse.json({ error: "Review not found" }, { status: 404 });

        const reviewData = doc.data();
        if (reviewData?.userId !== decoded.uid) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        const updatedData: any = {};
        updatedData.content = content;
        updatedData.stars = stars;
        updatedData.updatedAt = new Date().toISOString();

        await reviewRef.update(updatedData);

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const err = error as Error;
        console.error(err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const firebaseToken = request.headers.get("Auth");
        if (!firebaseToken) return NextResponse.json({ error: "Missing Firebase ID token" }, { status: 401 });

        const decoded = await adminAuth.verifyIdToken(firebaseToken);
        const { reviewId } = await request.json();

        if (!reviewId || typeof reviewId !== "string") return NextResponse.json({ error: "Invalid reviewId" }, { status: 400 });

        const reviewRef = adminDb.collection("reviews").doc(reviewId);
        const doc = await reviewRef.get();
        if (!doc.exists) return NextResponse.json({ error: "Review not found" }, { status: 404 });

        const reviewData = doc.data();
        if (reviewData?.userId !== decoded.uid) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        await reviewRef.delete();

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const err = error as Error;
        console.error(err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}