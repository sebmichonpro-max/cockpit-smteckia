import { NextRequest, NextResponse } from "next/server";

// Une note peut être poussée vers différents outils externes ; chaque cible a
// sa propre URL de webhook Make, tenue hors du bundle client.
const PUSH_WEBHOOK_ENV: Record<string, string> = {
  claude: "PUSH_CLAUDE_WEBHOOK_URL",
  perplexity: "PUSH_PERPLEXITY_WEBHOOK_URL",
  notion: "PUSH_NOTION_WEBHOOK_URL",
  airtable: "PUSH_AIRTABLE_WEBHOOK_URL",
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const target = body.target as string;
  const envVar = PUSH_WEBHOOK_ENV[target];

  if (!envVar) {
    return NextResponse.json({ ok: false, reason: "invalid-target" }, { status: 400 });
  }

  const webhookUrl = process.env[envVar];

  if (!webhookUrl) {
    return NextResponse.json({ ok: false, reason: "not-configured" });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contenu: body.contenu,
        projet_tag: body.projet_tag,
        target,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, reason: "error" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, reason: "error" }, { status: 502 });
  }
}
