import { query } from "../../../lib/db"; // ✅ Correct import

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const logs = await query(
      "SELECT * FROM queries ORDER BY timestamp DESC LIMIT 20"
    );
    console.log("Logs:", logs);
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
