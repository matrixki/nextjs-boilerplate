import { NextResponse } from "next/server";
import db from "@/lib/db"; // ✅ Ensure this imports the correct database connection
import axios from "axios";

export async function GET() {
  try {
    console.log("📊 Fetching yesterday's Slack messages for summarization...");

    // ✅ Query **only messages from yesterday**
    const messages = await db.query(
      `
      SELECT text FROM messages 
      WHERE DATE(timestamp) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      ORDER BY timestamp ASC
    `
    );

    if (messages.length === 0) {
      return NextResponse.json({
        summary: "No Slack messages found from yesterday.",
      });
    }

    // ✅ Combine messages into a single text block
    const messageText = messages.map((msg) => msg.text).join("\n");

    // ✅ Call OpenAI API to generate a summary
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Summarize the following Slack messages from yesterday concisely.",
          },
          { role: "user", content: messageText },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.choices[0].message.content;

    console.log("✅ Yesterday's Slack Messages Summary:", summary);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("❌ Error summarizing Slack messages:", error);
    return NextResponse.json(
      { error: "Failed to summarize Slack messages." },
      { status: 500 }
    );
  }
}
