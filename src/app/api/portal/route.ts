import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { members, contributions, serviceHistory } from "@/db/schema";
import { getTokenFromHeader } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const auth = getTokenFromHeader(req.headers.get("authorization"));
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find member by userId
    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.userId, auth.userId))
      .limit(1);

    if (!member) {
      return NextResponse.json({ member: null, contributions: [], serviceHistory: [] });
    }

    const memberContributions = await db
      .select()
      .from(contributions)
      .where(eq(contributions.memberId, member.id))
      .orderBy(desc(contributions.createdAt))
      .limit(50);

    const memberServiceHistory = await db
      .select()
      .from(serviceHistory)
      .where(eq(serviceHistory.memberId, member.id))
      .orderBy(desc(serviceHistory.serviceDate))
      .limit(50);

    return NextResponse.json({
      member,
      contributions: memberContributions,
      serviceHistory: memberServiceHistory,
    });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
