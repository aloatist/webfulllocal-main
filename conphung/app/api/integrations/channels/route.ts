import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/tours/permissions";

const querySchema = z.object({
  provider: z.string().optional(),
  status: z.string().optional(),
});

export async function GET(request: Request) {
  const auth = await requireEditor();
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const url = new URL(request.url);
    const parsed = querySchema.parse(Object.fromEntries(url.searchParams));

    const channels = await prisma.integrationChannel.findMany({
      where: {
        provider: parsed.provider,
        status: parsed.status as
          | undefined
          | "ACTIVE"
          | "INACTIVE"
          | "ERROR",
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ data: channels });
  } catch (error) {
    console.error("Failed to list integration channels:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
