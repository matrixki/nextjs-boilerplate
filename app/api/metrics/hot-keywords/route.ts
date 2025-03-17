import { NextResponse } from "next/server";
import { pineconeIndex } from "@/lib/pinecone";

export async function GET() {
  try {
    console.log("🔥 Fetching hot keywords from Pinecone...");

    // ✅ Query Pinecone for top stored queries
    const result = await pineconeIndex.query({
      vector: new Array(1536).fill(0), // Dummy vector for broad query
      topK: 10,
      includeMetadata: true,
    });

    // ✅ Extract keywords from metadata & filter out empty values
    const hotKeywords = result.matches
      .map((match) => match?.metadata?.text?.toString().trim()) // Ensure no empty values
      .filter((keyword) => keyword); // Remove undefined/null entries

    // ✅ Remove duplicates using Set()
    const uniqueKeywords = [...new Set(hotKeywords)];

    console.log("🔥 Unique Hot Keywords:", uniqueKeywords);

    return NextResponse.json({ hotKeywords: uniqueKeywords });
  } catch (error) {
    console.error("❌ Pinecone Hot Keywords Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch hot keywords." },
      { status: 500 }
    );
  }
}
