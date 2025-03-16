import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    // ✅ Get form data from request
    const formData = await req.formData();

    // ✅ Forward request to backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ File Upload API Error:", error);
    return NextResponse.json(
      { error: "Failed to upload file." },
      { status: 500 }
    );
  }
}
