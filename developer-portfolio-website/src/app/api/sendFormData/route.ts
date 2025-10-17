import { adminDb } from "@/src/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import admin from 'firebase-admin';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        await adminDb.collection("forms").add({
            ...data,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
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