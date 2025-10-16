import { RateLimiter } from "@/src/lib/classes/RateLimiter";
import { verifyRequest } from "@/src/lib/verifyRequest";
import { NextResponse } from "next/server";

import * as nodemailer from "nodemailer";

const limiter = new RateLimiter({ limit: 5, windowMs: 60_000 });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function POST(request: Request) {
    try {
        const check = await verifyRequest(request);
        if (!check.authorized) return check.response;

        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!limiter.check(ip)) {
            return NextResponse.json(
                { success: false },
                { status: 429 }
            );
        }
        
        const { subject, email, message } = await request.json();
        await transporter.sendMail({
            to: process.env.GMAIL_USER,
            subject: subject,
            text: message,
            html: `
                <div style="
                    background-color: #18181b;
                    color: #fff;
                    border: 2px solid #fff;
                    border-radius: 12px;
                    padding: 16px;
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                ">
                    <p style="color: #fff; font-size: 16px; line-height: 1.5;">
                        <strong>Email:</strong> ${email}
                    </p>
                    <p style="color: #fff; font-size: 16px;">
                        <strong>Message:</strong>
                    </p>
                    <p style="color: #fff; font-size: 16px; line-height: 1.5;">
                        ${message}
                    </p>
                </div>
            `,
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