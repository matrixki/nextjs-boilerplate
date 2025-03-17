import { NextResponse } from "next/server";
import db from "@/lib/db"; // ✅ Ensure this is the correct database connection

export async function GET() {
  try {
    console.log("📊 Fetching Response Effectiveness...");

    // ✅ Count total queries
    const totalQueryResult = await db.query(`
      SELECT COUNT(*) as total FROM queries
    `);

    // ✅ Count queries that were resolved (i.e., the user did NOT send another message within 10 minutes)
    const resolvedQueryResult = await db.query(`
      SELECT COUNT(*) as resolved FROM queries q1
      WHERE NOT EXISTS (
        SELECT 1 FROM queries q2
        WHERE q1.user_id = q2.user_id
        AND q2.timestamp > q1.timestamp
        AND TIMESTAMPDIFF(MINUTE, q1.timestamp, q2.timestamp) <= 10
      )
    `);

    // ✅ Extract values from the first object in the array
    const total = totalQueryResult.length > 0 ? totalQueryResult[0].total : 0;
    const resolved =
      resolvedQueryResult.length > 0 ? resolvedQueryResult[0].resolved : 0;
    const effectiveness =
      total > 0 ? ((resolved / total) * 100).toFixed(2) : "0.00";

    console.log(
      `📊 Total Queries: ${total}, Resolved: ${resolved}, Effectiveness: ${effectiveness}%`
    );

    return NextResponse.json({ total, resolved, effectiveness });
  } catch (error) {
    console.error("❌ Error fetching response effectiveness:", error);
    return NextResponse.json(
      { error: "Failed to fetch response effectiveness." },
      { status: 500 }
    );
  }
}
