import { NextRequest } from "next/server";
import { adminAuth } from "./firebaseAdmin";

export async function verifyUser(req: NextRequest): Promise<string | null> {
  const sessionCookie = req.cookies.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded.uid;
  } catch (err) {
    console.error("Firebase session verification failed:", err);
    return null;
  }
}