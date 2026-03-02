import { NextResponse } from "next/server";
import { leadPayloadSchema } from "@/lib/validators";

const RATE_LIMIT_MAX_REQUESTS = (() => {
  const value = Number(process.env.LEADS_RATE_LIMIT_MAX);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 8;
})();

const RATE_LIMIT_WINDOW_MS = (() => {
  const value = Number(process.env.LEADS_RATE_LIMIT_WINDOW_MS);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 60_000;
})();

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getSupabaseLeadsUrl() {
  const configuredUrl = process.env.SUPABASE_LEADS_API_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.includes("/rest/v1/leads")
      ? configuredUrl
      : `${configuredUrl.replace(/\/$/, "")}/rest/v1/leads`;
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim();

  if (!supabaseUrl) {
    return "";
  }

  return `${supabaseUrl.replace(/\/$/, "")}/rest/v1/leads`;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();

    if (firstIp) return firstIp;
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(clientIp: string) {
  const now = Date.now();

  for (const [ip, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(ip);
    }
  }

  const current = rateLimitStore.get(clientIp);

  if (!current) {
    rateLimitStore.set(clientIp, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  rateLimitStore.set(clientIp, current);
  return false;
}

function extractPayloadAndHoneypot(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { payload: body, honeypot: "" };
  }

  const data = body as Record<string, unknown>;
  const honeypot = typeof data.website === "string" ? data.website.trim() : "";
  const payload = { ...data };
  delete payload.website;

  return { payload, honeypot };
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Muitas tentativas. Tente novamente em instantes.",
        },
        { status: 429 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Payload inválido." },
        { status: 400 },
      );
    }

    const { payload, honeypot } = extractPayloadAndHoneypot(body);

    if (honeypot.length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const parsed = leadPayloadSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Payload inválido." },
        { status: 400 },
      );
    }

    const leadsApiUrl = getSupabaseLeadsUrl();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!leadsApiUrl || !serviceRoleKey) {
      console.error("[ONDESC][LEAD][CONFIG_ERROR] Missing Supabase config.");
      return NextResponse.json(
        { ok: false, error: "Serviço temporariamente indisponível." },
        { status: 500 },
      );
    }

    const response = await fetch(leadsApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "[ONDESC][LEAD][SUPABASE_ERROR]",
        "Failed to insert lead. Status:",
        response.status,
        "Body:",
        errorBody,
      );
      return NextResponse.json(
        { ok: false, error: "Não foi possível registrar seu lead agora." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[ONDESC][LEAD][ERROR]", error);
    return NextResponse.json(
      { ok: false, error: "Erro interno." },
      { status: 500 },
    );
  }
}
