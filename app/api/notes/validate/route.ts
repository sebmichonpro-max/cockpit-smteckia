import { NextRequest, NextResponse } from "next/server";

// Relaie côté serveur vers NOTES_WEBHOOK_URL : garde l'URL du webhook Make
// hors du bundle client, et évite un appel bloqué par CORS depuis le navigateur.
export async function POST(request: NextRequest) {
  const webhookUrl = process.env.NOTES_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({ ok: false, reason: "not-configured" });
  }

  const body = await request.json();

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contenu: body.contenu,
        projet_tag: body.projet_tag,
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
