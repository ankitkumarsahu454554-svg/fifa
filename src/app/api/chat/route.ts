import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { messages, system } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
      system?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Request body must include a non-empty `messages` array." },
        { status: 400 }
      );
    }

    const anthropicBody: Record<string, unknown> = {
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages,
    };
    if (system) {
      anthropicBody.system = system;
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(anthropicBody),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return NextResponse.json(
        { error: `Anthropic API error (${anthropicRes.status}): ${errText}` },
        { status: anthropicRes.status }
      );
    }

    const data = await anthropicRes.json();

    // Extract the text content from Claude's response
    const text =
      data.content?.[0]?.type === "text"
        ? data.content[0].text
        : "No text response received.";

    return NextResponse.json({ text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Server error: ${message}` },
      { status: 500 }
    );
  }
}
