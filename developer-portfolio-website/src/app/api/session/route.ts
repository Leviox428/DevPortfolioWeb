import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/src/lib/firebaseAdmin";
import { parse, serialize } from "cookie";

export async function POST(req: NextRequest) {
    try {
        const { authToken } = await req.json();

        const decoded = await adminAuth.verifyIdToken(authToken);
        const cookie = serialize("session", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 1, 
        });

        return new NextResponse(JSON.stringify({ uid: decoded.uid }), {
            headers: { "Set-Cookie": cookie },
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

export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie") || "";
        const cookies = parse(cookie);

        if (!cookies.session) {
            return NextResponse.json({ isAuth: false });
        }

        const decoded = await adminAuth.verifyIdToken(cookies.session);
        return NextResponse.json({ isAuth: true, uid: decoded.uid, authToken: cookies.session });
    } catch (error: unknown) {
        const err = error as Error;
        console.error(err);
        
        return NextResponse.json({ isAuth: false });
    }
}