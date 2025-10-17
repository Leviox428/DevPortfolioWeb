import { RateLimiter } from '@/src/lib/classes/RateLimiter';
import { verifyRequest } from '@/src/lib/verifyRequest';
import { adminDb } from '@/src/lib/firebaseAdmin';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
function hashIP(ip: string) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

const limiter = new RateLimiter({ limit: 15, windowMs: 60_000 });

export async function POST(request: Request) {
    try {
        const check = await verifyRequest(request);
        if (!check.authorized) return check.response;
        
        const ip = request.headers.get('x-forwarded-for') || "unknown";
        if (ip === "unknown")  {
            return NextResponse.json(
                { success: false, error: "No IP found" },
                { status: 400 },           
            )             
        }

        if (!limiter.check(ip)) {
            return NextResponse.json(
                { success: false },
                { status: 429 }
            );
        }

        const hashedIP = hashIP(ip);

        const visitorRef = adminDb.collection("visitors").doc(hashedIP);
        const docSnap = await visitorRef.get();
        if (!docSnap.exists) {
            await visitorRef.set(
                {
                    firstSeen: admin.firestore.FieldValue.serverTimestamp(),
                    lastSeen: admin.firestore.FieldValue.serverTimestamp(),
                    visits: 1
                }
            )
        } else {
            await visitorRef.update(
                {
                    lastSeen: admin.firestore.FieldValue.serverTimestamp(),
                    visits: admin.firestore.FieldValue.increment(1),
                }
            )
        }
        return NextResponse.json(
            { success: true },
        )


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