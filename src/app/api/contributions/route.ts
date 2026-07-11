import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contributions, members } from "@/db/schema";
import { getTokenFromHeader } from "@/lib/auth";
import { eq, sql, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const auth = getTokenFromHeader(req.headers.get("authorization"));
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const memberId = searchParams.get("memberId");

    let query;
    if (auth.role === "admin" && !memberId) {
      query = db
        .select({
          contribution: contributions,
          memberName: sql<string>`${members.legalFirstName} || ' ' || ${members.legalLastName}`,
          memberMemberId: members.memberId,
        })
        .from(contributions)
        .leftJoin(members, eq(contributions.memberId, members.id))
        .orderBy(desc(contributions.createdAt))
        .limit(100);
    } else {
      const filterMemberId = memberId || "";
      query = db
        .select({
          contribution: contributions,
          memberName: sql<string>`${members.legalFirstName} || ' ' || ${members.legalLastName}`,
          memberMemberId: members.memberId,
        })
        .from(contributions)
        .leftJoin(members, eq(contributions.memberId, members.id))
        .where(eq(contributions.memberId, filterMemberId))
        .orderBy(desc(contributions.createdAt));
    }

    const results = await query;

    return NextResponse.json({ contributions: results });
  } catch (error) {
    console.error("Contributions error:", error);
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

    const receiptNumber = `RCP-${Date.now().toString(36).toUpperCase()}`;

    const [contribution] = await db
      .insert(contributions)
      .values({
        memberId: body.memberId,
        amount: body.amount.toString(),
        currency: body.currency || "ETB",
        type: body.type,
        description: body.description || null,
        paymentStatus: body.paymentStatus || "pending",
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
        receiptNumber,
      })
      .returning();

    return NextResponse.json({ contribution }, { status: 201 });
  } catch (error) {
    console.error("Contribution creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
