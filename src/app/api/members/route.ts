import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { members } from "@/db/schema";
import { getTokenFromHeader } from "@/lib/auth";
import { eq, ilike, or, and, sql, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const auth = getTokenFromHeader(req.headers.get("authorization"));
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const parish = searchParams.get("parish") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(members.legalFirstName, `%${search}%`),
          ilike(members.legalLastName, `%${search}%`),
          ilike(members.baptismalName, `%${search}%`),
          ilike(members.phone, `%${search}%`),
          ilike(members.memberId, `%${search}%`)
        )
      );
    }

    if (status && (status === "active" || status === "inactive" || status === "pending")) {
      conditions.push(eq(members.status, status));
    }

    if (parish) {
      conditions.push(ilike(members.parish, `%${parish}%`));
    }

    const whereClause =
      conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult] = await db
      .select({ total: count() })
      .from(members)
      .where(whereClause);

    const results = await db
      .select()
      .from(members)
      .where(whereClause)
      .orderBy(sql`${members.createdAt} DESC`)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      members: results,
      total: totalResult.total,
      page,
      totalPages: Math.ceil(totalResult.total / limit),
    });
  } catch (error) {
    console.error("Members fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Generate member ID: MS-YYYYMMDD-XXXX
    const dateStr = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const memberId = `MS-${dateStr}-${rand}`;

    const [newMember] = await db
      .insert(members)
      .values({
        memberId,
        legalFirstName: body.legalFirstName,
        legalLastName: body.legalLastName,
        legalMiddleName: body.legalMiddleName || null,
        baptismalName: body.baptismalName || null,
        amharicName: body.amharicName || null,
        dateOfBirth: body.dateOfBirth || null,
        gender: body.gender || null,
        email: body.email || null,
        phone: body.phone || null,
        alternatePhone: body.alternatePhone || null,
        country: body.country || "Ethiopia",
        region: body.region || null,
        zone: body.zone || null,
        woreda: body.woreda || null,
        kebele: body.kebele || null,
        city: body.city || null,
        subcity: body.subcity || null,
        houseNumber: body.houseNumber || null,
        parish: body.parish || null,
        confessionFather: body.confessionFather || null,
        sundaySchool: body.sundaySchool || null,
        serviceArea: body.serviceArea || null,
        emergencyContactName: body.emergencyContactName || null,
        emergencyContactPhone: body.emergencyContactPhone || null,
        emergencyContactRelation: body.emergencyContactRelation || null,
        status: "pending",
        userId: body.userId || null,
      })
      .returning();

    return NextResponse.json({ member: newMember }, { status: 201 });
  } catch (error) {
    console.error("Member creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
