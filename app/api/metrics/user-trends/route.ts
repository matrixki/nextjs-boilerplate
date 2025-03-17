import { NextResponse } from "next/server";
import db from "@/lib/db"; // ✅ Ensure this is your MySQL connection

export async function GET() {
  try {
    console.log("📊 Fetching User Query Trends...");

    // ✅ Query MySQL to get the number of queries made by each user over time
    const userTrends = await db.query(`
      SELECT user_id, DATE(timestamp) as date, COUNT(*) as query_count
      FROM queries
      GROUP BY user_id, DATE(timestamp)
      ORDER BY date ASC, query_count DESC
    `);

    console.log("📈 User Query Trends:", userTrends);

    return NextResponse.json({ userTrends: userTrends });
  } catch (error) {
    console.error("❌ Error fetching user query trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch user trends." },
      { status: 500 }
    );
  }
}
