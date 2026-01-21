import { adminDb } from "@/src/lib/firebaseAdmin";
import { NextRequest } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
    try {
        const locale = request.headers.get("x-locale") ?? "en";
        const fileBuffer = await request.arrayBuffer();

        const blob = await put(
            locale === "sk" ? "resume-sk.pdf" : "resume-en.pdf",
            fileBuffer,
            {
                access: "public",
                contentType: "application/pdf",
                allowOverwrite: true
            }
            );

        await adminDb.collection("cv").doc(locale).set(
        {
            url: blob.url,
            updatedAt: new Date(),
        },
        { merge: true }
        );

        return Response.json({ url: blob.url });
    } catch (err: any) {
        return new Response("Error: " + err.message, { status: 500 });
    }
}

export async function GET(
  request: NextRequest,
) {

    const { searchParams } = new URL(request.url);
    let locale = searchParams.get("locale");
    if (!locale) {
        locale = "en";
    }

    const doc = await adminDb.collection("cv").doc(locale).get();

    if (!doc.exists) {
        return Response.json({ error: "CV not found" }, { status: 404 });
    }

    const { url } = doc.data() as { url?: string };

    if (!url) {
        return Response.json({ error: "CV URL missing" }, { status: 500 });
    }
    console.log(url);
    return Response.json({ url });
}