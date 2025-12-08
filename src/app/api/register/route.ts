import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

import { limiter } from "@/lib/rate-limit";

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

        // 5 requests per minute (prevents automated account creation spam)
        if (!limiter.check(5, ip + "_register")) {
            return NextResponse.json(
                { message: "Rate limit exceeded" },
                { status: 429 }
            );
        }

        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = db.findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = db.createUser({
            username,
            email,
            password_hash: hashedPassword,
        });

        return NextResponse.json(
            { message: "User created successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
