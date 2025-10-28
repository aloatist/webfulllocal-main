import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/tours/permissions";

const querySchema = z.object({
  direction: z.enum(["INBOUND", "OUTBOUND"]).optional(),
  status: z.enum(["SUCCESS", "FAILED", "RETRYING"]).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
});

export async function GET(
  request: Request,
  context: { params: { channelId: string } },
) {
  const auth = await requireEditor();
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { channelId } = context.params;

  try {
    const url = new URL(request.url);
    const parsed = querySchema.parse(Object.fromEntries(url.searchParams));

    const channel = await prisma.integrationChannel.findUnique({
      where: { id: channelId },
      select: { id: true },
    });

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const logs = await prisma.channelSyncLog.findMany({
      where: {
        channelId,
        direction: parsed.direction,
        status: parsed.status,
      },
      orderBy: { createdAt: "desc" },
      take: parsed.limit ?? 50,
    });

    return NextResponse.json({ data: logs });
  } catch (error) {
    console.error("Failed to fetch sync logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
