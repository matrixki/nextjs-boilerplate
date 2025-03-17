import { NextResponse } from "next/server";
import db from "@/lib/db";

const TEAM_ID = "T08HPG8PQ0L"; // ✅ Replace with your actual Slack Team ID

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword");

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required." },
        { status: 400 }
      );
    }

    console.log(`🔍 Searching Slack messages for keyword: "${keyword}"`);

    // ✅ Query Slack messages containing the keyword
    const messages = await db.query(
      `
      SELECT text, slack_message_id, channel FROM messages
      WHERE text LIKE ?
      ORDER BY timestamp DESC
      LIMIT 50
    `,
      [`%${keyword}%`] // 🔍 Partial match for keyword search
    );

    console.log("🔍 Search Results:", messages);
    // ✅ Generate Slack links
    const formattedMessages = messages.map((msg: any) => ({
      text: msg.text,
      timestamp: msg.timestamp,
      slackLink: `https://app.slack.com/archives/${
        msg.channel
      }/p${msg.slack_message_id.replace(".", "")}`, // ✅ Correct Slack Deep Link
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("❌ Error searching Slack messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results." },
      { status: 500 }
    );
  }
}
