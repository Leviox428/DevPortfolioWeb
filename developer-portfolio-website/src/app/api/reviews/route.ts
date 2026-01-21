import { adminAuth, adminDb } from "@/src/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import type { Query } from "firebase-admin/firestore";
import { verifyUser } from "@/src/lib/verifyUser";

export async function GET(request: NextRequest) {
    try { 
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        let query: Query = adminDb.collection("reviews");

        if (userId) {
            const uid = await verifyUser(request);
            if (!uid) {
                return NextResponse.json(
                    { success: false, message: "Unauthorized" },
                    { status: 401 }
                );
            }

            query = query.where("userId", "==", userId);
        }

        const snapshot = await query.get();
        const reviews = snapshot.docs.map((doc) => ({
            id: doc.id,          
            ...doc.data()
        }));

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
    const uid = await verifyUser(request);
    if (!uid) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { fullName, content, stars } = await request.json();

        if (!fullName || typeof fullName !== "string") {
            return NextResponse.json({ error: "Invalid author" }, { status: 400 });
        }

        if (!content || typeof content !== "string" || content.length < 10) {
            return NextResponse.json({ error: "Invalid content" }, { status: 400 });
        }

        if (!stars || typeof stars !== "number" || stars < 1 || stars > 5) {
            return NextResponse.json({ error: "Invalid stars" }, { status: 400 });
        }

        const review = {
            fullName,
            content,
            stars,
            userId: uid,
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
    const uid = await verifyUser(request);
    
    if (!uid) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { reviewId, content, stars } = await request.json();
        if (!reviewId || typeof reviewId !== "string") return NextResponse.json({ error: "Invalid reviewId" }, { status: 400 });
        if (content && (typeof content !== "string" || content.length < 10)) return NextResponse.json({ error: "Invalid content" }, { status: 400 });
        if (stars && (typeof stars !== "number" || stars < 1 || stars > 5)) return NextResponse.json({ error: "Invalid stars" }, { status: 400 });

        const reviewRef = adminDb.collection("reviews").doc(reviewId);
        const doc = await reviewRef.get();
        if (!doc.exists) return NextResponse.json({ error: "Review not found" }, { status: 404 });

        const reviewData = doc.data();
        if (reviewData?.userId !== uid) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

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
    const uid = await verifyUser(request);
    
    if (!uid) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { reviewId } = await request.json();

        if (!reviewId || typeof reviewId !== "string") return NextResponse.json({ error: "Invalid reviewId" }, { status: 400 });

        const reviewRef = adminDb.collection("reviews").doc(reviewId);
        const doc = await reviewRef.get();
        if (!doc.exists) return NextResponse.json({ error: "Review not found" }, { status: 404 });

        const reviewData = doc.data();
        if (reviewData?.userId !== uid) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        await reviewRef.delete();

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const err = error as Error;
        console.error(err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}