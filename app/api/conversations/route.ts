export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required." }), {
      status: 400,
    });
  }

  try {
    const backendResponse = await fetch(
      `https://slack-bot.matrixki.com/api/conversations?userId=${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await backendResponse.json();
    console.log("📦 Fetched chat history:", data);

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data." }), {
      status: 500,
    });
  }
}
