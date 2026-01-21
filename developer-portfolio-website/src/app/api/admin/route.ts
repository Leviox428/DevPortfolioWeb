import { adminDb } from "@/src/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const snapshot = await adminDb
        .collection("admins")
        .where("email", "==", email)
        .limit(1)
        .get();

    const exists = !snapshot.empty;

    return NextResponse.json({
        success: true,
        isAdmin: exists,
    });
  } catch (error: unknown) {
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