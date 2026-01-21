import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/src/lib/firebaseAdmin";
import { parse, serialize } from "cookie";
import admin from "firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { authToken } = await req.json();

    const decoded = await adminAuth.verifyIdToken(authToken);

    const expiresIn = 60 * 60 * 24 * 1 * 1000; // 1 day

    const sessionCookie = await adminAuth.createSessionCookie(authToken, {
        expiresIn,
    });

    const cookie = serialize("session", sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: expiresIn / 1000, 
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        uid: decoded.uid,
      }),
      {
        headers: {
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Session error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 401 }
    );
  }
}

export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie") || "";
        const cookies = parse(cookie);

        if (!cookies.session) {
            return NextResponse.json({ isAuth: false });
        }

        const decoded = await admin
            .auth()
            .verifySessionCookie(cookies.session, true);


        const customToken = await admin.auth().createCustomToken(decoded.uid);
        
        const userRecord = await adminAuth.getUser(decoded.uid);

        return NextResponse.json({
            isAuth: true,
            uid: decoded.uid,
            fullName: userRecord.displayName,
            customToken: customToken,
            email: decoded.email
        });
    } catch (error: unknown) {
        const err = error as Error;
        console.error(err);
        
        return NextResponse.json({ isAuth: false });
    }
}