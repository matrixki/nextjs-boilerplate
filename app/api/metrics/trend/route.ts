import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    console.log("📊 Fetching query trends...");

    // ✅ Get daily query counts (Last 30 days)
    const queryTrends = await db.query(`
      SELECT 
        DATE(timestamp) AS date, 
        COUNT(*) AS query_count
      FROM queries
      WHERE timestamp >= NOW() - INTERVAL 30 DAY
      GROUP BY date
      ORDER BY date ASC;
    `);

    // ✅ Get top keywords per day (Last 30 days)
    const keywordTrends = await db.query(`
      SELECT 
        DATE(timestamp) AS date, 
        user_message AS keyword, 
        COUNT(*) AS count
      FROM queries
      WHERE timestamp >= NOW() - INTERVAL 30 DAY
      GROUP BY date, keyword
      ORDER BY date ASC, count DESC
      LIMIT 50;
    `);

    console.log("📊 Query Trends:", queryTrends);
    console.log("📊 Keyword Trends:", keywordTrends);

    return NextResponse.json({
      queryTrends,
      keywordTrends,
    });
  } catch (error) {
    console.error("❌ Trend API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trends." },
      { status: 500 }
    );
  }
}
