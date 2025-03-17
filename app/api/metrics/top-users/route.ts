import { NextResponse } from "next/server";
import db from "@/lib/db"; // ✅ Ensure this is the correct database connection

export async function GET() {
  try {
    console.log("📊 Fetching Top Users...");

    // ✅ Query MySQL to get top users by number of queries made
    const topUsers = await db.query(`
      SELECT user_id, COUNT(*) as query_count
      FROM queries
      GROUP BY user_id
      ORDER BY query_count DESC
      LIMIT 5
    `);

    console.log("🏆 Top Users:", topUsers);

    return NextResponse.json({ topUsers: topUsers });
  } catch (error) {
    console.error("❌ Error fetching top users:", error);
    return NextResponse.json(
      { error: "Failed to fetch top users." },
      { status: 500 }
    );
  }
}
