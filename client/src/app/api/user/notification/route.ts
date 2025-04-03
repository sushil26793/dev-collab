import { cookies } from "next/headers";
import { NextResponse } from "next/server";



export async function GET() {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("user")?.value;
    if (!authCookie) {
        return NextResponse.json({ message: "Unauthorized - no valid token found" }, { status: 401 })
    }

    return NextResponse.json({ success: true })
}