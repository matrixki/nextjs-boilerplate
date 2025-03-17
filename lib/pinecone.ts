import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY) {
  throw new Error("❌ Missing Pinecone API credentials in .env.local");
}

// ✅ Initialize Pinecone Client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// ✅ Select the Index (Replace with your actual index name)
export const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);

export default pinecone;
