import { adminDb } from "@/src/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        let locale = searchParams.get("locale");
        if (!locale) {
            locale = "en";
        }

        const collection = adminDb.collection("aboutMe");
        const docRef = collection.doc(locale);
        const snapshot = await docRef.get();
        if (!snapshot.exists) {
            return NextResponse.json(
                { text: "" },
                { status: 200 }
            );
        }

        const data = snapshot.data();

        return NextResponse.json(
            { text: data?.text ?? "" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch About Me" },
            { status: 500 }
        );
  }
}

export async function PUT(request: NextRequest) {
    try {
        const { text, locale } = await request.json();

        if (typeof text !== "string" || typeof locale !== "string") {
            return NextResponse.json(
                { message: "Invalid values" },
                { status: 400 }
            );
        }

        const docRef = adminDb.collection("aboutMe").doc(locale);

        await docRef.set(
            {
                text,
                updatedAt: new Date(),
            },
            { merge: true }
        );

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to update About Me" },
            { status: 500 }
        );
    }
}