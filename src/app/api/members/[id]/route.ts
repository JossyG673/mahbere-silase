import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { members } from "@/db/schema";
import { getTokenFromHeader } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = getTokenFromHeader(req.headers.get("authorization"));
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1);

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Members can only view their own profile unless admin
    if (auth.role !== "admin" && member.userId !== auth.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Member fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = getTokenFromHeader(req.headers.get("authorization"));
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const [updated] = await db
      .update(members)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ member: updated });
  } catch (error) {
    console.error("Member update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = getTokenFromHeader(req.headers.get("authorization"));
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(members).where(eq(members.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Member delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
