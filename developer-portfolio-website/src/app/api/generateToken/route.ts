import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {

    const token = jwt.sign(
        { ts: Date.now() },
        process.env.API_SECRET!,
        { expiresIn: "10m" }
    );

    return NextResponse.json(
        { token }
    );
}