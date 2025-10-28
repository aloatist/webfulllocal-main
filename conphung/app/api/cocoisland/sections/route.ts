import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import {
  getCocoIslandConfig,
  saveCocoIslandConfig,
} from "@/lib/cocoisland/sections";
import { cocoIslandConfigSchema } from "@/lib/cocoisland/schema";
import { ZodError } from "zod";

export async function GET() {
  try {
    const config = await getCocoIslandConfig();
    return NextResponse.json({ data: config });
  } catch (error) {
    console.error("Failed to load Coco Island config", error);
    return NextResponse.json(
      { error: "Không thể tải cấu hình Coco Island" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !["ADMIN", "EDITOR"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const payload = cocoIslandConfigSchema.parse(json);

    const saved = await saveCocoIslandConfig(payload, {
      updatedById: session.user.id,
    });

    return NextResponse.json({ data: saved });
  } catch (error) {
    console.error("Failed to update Coco Island config", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Dữ liệu gửi lên không hợp lệ", issues: error.issues },
        { status: 422 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể cập nhật cấu hình" },
      { status: 400 },
    );
  }
}
