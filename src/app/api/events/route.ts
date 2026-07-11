import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { getTokenFromHeader } from "@/lib/auth";
import { gte, desc } from "drizzle-orm";

export async function GET() {
  try {
    const results = await db
      .select()
      .from(events)
      .where(gte(events.eventDate, new Date()))
      .orderBy(events.eventDate)
      .limit(20);

    return NextResponse.json({ events: results });
  } catch (error) {
    console.error("Events error:", error);
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

    const [event] = await db
      .insert(events)
      .values({
        titleEn: body.titleEn,
        titleAm: body.titleAm || null,
        descriptionEn: body.descriptionEn || null,
        descriptionAm: body.descriptionAm || null,
        eventDate: new Date(body.eventDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location || null,
        eventType: body.eventType || "community",
        isLiturgical: body.isLiturgical || false,
      })
      .returning();

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Event creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
