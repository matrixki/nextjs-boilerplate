import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { message, userId } = await req.json(); // ✅ Extract userId

    if (!message || !userId) {
      return NextResponse.json(
        { error: "User ID and message are required." },
        { status: 400 }
      );
    }

    // ✅ Use NEXT_PUBLIC_BACKEND_URL but ensure it's available
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined in .env.local");
    }

    // ✅ Send request to backend
    const response = await axios.post(`${backendUrl}/api/chat`, {
      message,
      userId, // ✅ Ensure we send userId
    });

    return NextResponse.json(response.data); // ✅ Return bot response
  } catch (error: any) {
    console.error("❌ Proxy API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to process message." },
      { status: 500 }
    );
  }
}
