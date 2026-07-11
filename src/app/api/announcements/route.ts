import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { getTokenFromHeader } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const results = await db
      .select()
      .from(announcements)
      .where(eq(announcements.isActive, true))
      .orderBy(desc(announcements.priority), desc(announcements.createdAt))
      .limit(10);

    return NextResponse.json({ announcements: results });
  } catch (error) {
    console.error("Announcements error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getTokenFromHeader(req.headers.get("authorization"));
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const [announcement] = await db
      .insert(announcements)
      .values({
        titleEn: body.titleEn,
        titleAm: body.titleAm || null,
        contentEn: body.contentEn || null,
        contentAm: body.contentAm || null,
        isActive: true,
        priority: body.priority || 0,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      })
      .returning();

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error("Announcement creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
