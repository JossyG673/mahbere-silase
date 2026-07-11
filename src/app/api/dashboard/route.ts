import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { members, contributions } from "@/db/schema";
import { getTokenFromHeader } from "@/lib/auth";
import { eq, count, sum, gte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const auth = getTokenFromHeader(req.headers.get("authorization"));
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalResult] = await db.select({ total: count() }).from(members);
    const [activeResult] = await db
      .select({ total: count() })
      .from(members)
      .where(eq(members.status, "active"));
    const [pendingResult] = await db
      .select({ total: count() })
      .from(members)
      .where(eq(members.status, "pending"));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [monthlyContrib] = await db
      .select({ total: sum(contributions.amount) })
      .from(contributions)
      .where(gte(contributions.createdAt, thirtyDaysAgo));

    return NextResponse.json({
      totalMembers: totalResult.total,
      activeMembers: activeResult.total,
      pendingApprovals: pendingResult.total,
      monthlyContributions: monthlyContrib.total || "0",
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
