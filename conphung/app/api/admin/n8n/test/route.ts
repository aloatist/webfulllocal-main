import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/tours/permissions";
import { sendN8nEvent } from "@/lib/integrations/n8n-client";

type TestPayload = {
  operation?: string;
  payload?: Record<string, unknown>;
  webhookUrl?: string;
};

export async function POST(request: Request) {
  const auth = await requireEditor();
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as TestPayload;
    const operation = body.operation?.trim() || "admin-test";

    const payload = {
      ...(body.payload ?? {}),
      triggeredBy: auth.user.email ?? auth.user.id,
    };

    const result = await sendN8nEvent(operation, payload, {
      webhookUrl: body.webhookUrl,
      context: {
        trigger: "admin-test",
        userId: auth.user.id,
        email: auth.user.email,
      },
    });

    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (error) {
    console.error("Failed to send n8n test event:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
