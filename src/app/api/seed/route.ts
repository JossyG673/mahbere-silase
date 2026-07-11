import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, members, contributions, events, announcements, serviceHistory } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { count } from "drizzle-orm";

export async function POST() {
  try {
    // Check if already seeded
    const [userCount] = await db.select({ total: count() }).from(users);
    if (userCount.total > 0) {
      return NextResponse.json({ message: "Already seeded" });
    }

    // Create admin user
    const adminHash = await hashPassword("admin123");
    const [adminUser] = await db
      .insert(users)
      .values({
        email: "admin@mahiberesilassie.org",
        passwordHash: adminHash,
        role: "admin",
      })
      .returning();

    // Create member user
    const memberHash = await hashPassword("member123");
    const [memberUser] = await db
      .insert(users)
      .values({
        email: "member@example.com",
        passwordHash: memberHash,
        role: "member",
      })
      .returning();

    // Create sample members
    const sampleMembers = [
      {
        memberId: "MS-20240101-A1B2",
        userId: memberUser.id,
        legalFirstName: "Abebe",
        legalLastName: "Kebede",
        legalMiddleName: "Tadesse",
        baptismalName: "Gebremedhin",
        amharicName: "አበበ ከበደ",
        dateOfBirth: "1985-03-15",
        gender: "Male",
        email: "member@example.com",
        phone: "+251-911-234567",
        city: "Addis Ababa",
        subcity: "Bole",
        region: "Addis Ababa",
        parish: "የሰበታ ዋታ ቅድስት ሥላሴ ቤ/ክ",
        confessionFather: "Abba Gebriel",
        status: "active" as const,
        emergencyContactName: "Tigist Kebede",
        emergencyContactPhone: "+251-922-345678",
        emergencyContactRelation: "Spouse",
      },
      {
        memberId: "MS-20240115-C3D4",
        legalFirstName: "Tigist",
        legalLastName: "Mengistu",
        baptismalName: "Mariam",
        amharicName: "ትግስት መንግስቱ",
        dateOfBirth: "1990-07-22",
        gender: "Female",
        email: "tigist@example.com",
        phone: "+251-912-345678",
        city: "Addis Ababa",
        subcity: "Kirkos",
        region: "Addis Ababa",
        parish: "የሰበታ ዋታ ቅድስት ሥላሴ ቤ/ክ",
        status: "active" as const,
        emergencyContactName: "Dawit Mengistu",
        emergencyContactPhone: "+251-933-456789",
        emergencyContactRelation: "Brother",
      },
      {
        memberId: "MS-20240201-E5F6",
        legalFirstName: "Dawit",
        legalLastName: "Haile",
        baptismalName: "Tekle",
        amharicName: "ዳዊት ኃይሌ",
        dateOfBirth: "1978-11-08",
        gender: "Male",
        email: "dawit@example.com",
        phone: "+251-913-456789",
        city: "Bahir Dar",
        region: "Amhara",
        parish: "የሰበታ ዋታ ቅድስት ሥላሴ ቤ/ክ",
        status: "active" as const,
        emergencyContactName: "Sara Haile",
        emergencyContactPhone: "+251-944-567890",
        emergencyContactRelation: "Wife",
      },
      {
        memberId: "MS-20240210-G7H8",
        legalFirstName: "Hana",
        legalLastName: "Solomon",
        baptismalName: "Eleni",
        amharicName: "ሃና ሰለሞን",
        dateOfBirth: "1995-01-20",
        gender: "Female",
        email: "hana@example.com",
        phone: "+251-914-567890",
        city: "Hawassa",
        region: "Sidama",
        parish: "የሰበታ ዋታ ቅድስት ሥላሴ ቤ/ክ",
        status: "pending" as const,
      },
      {
        memberId: "MS-20240220-I9J0",
        legalFirstName: "Yohannes",
        legalLastName: "Tesfaye",
        baptismalName: "Yohannes",
        amharicName: "ዮሐንስ ተስፋየ",
        dateOfBirth: "1982-05-30",
        gender: "Male",
        email: "yohannes@example.com",
        phone: "+251-915-678901",
        city: "Addis Ababa",
        subcity: "Yeka",
        region: "Addis Ababa",
        parish: "የሰበታ ዋታ ቅድስት ሥላሴ ቤ/ክ",
        status: "inactive" as const,
      },
    ];

    const insertedMembers = await db
      .insert(members)
      .values(sampleMembers)
      .returning();

    // Create sample contributions
    const contribData = [
      {
        memberId: insertedMembers[0].id,
        amount: "500.00",
        type: "tsedeq",
        paymentStatus: "paid" as const,
        receiptNumber: "RCP-001",
        paymentDate: new Date("2024-01-15"),
      },
      {
        memberId: insertedMembers[0].id,
        amount: "1000.00",
        type: "donation",
        paymentStatus: "paid" as const,
        receiptNumber: "RCP-002",
        paymentDate: new Date("2024-02-15"),
      },
      {
        memberId: insertedMembers[1].id,
        amount: "500.00",
        type: "tsedeq",
        paymentStatus: "paid" as const,
        receiptNumber: "RCP-003",
        paymentDate: new Date("2024-01-20"),
      },
      {
        memberId: insertedMembers[2].id,
        amount: "750.00",
        type: "tithe",
        paymentStatus: "pending" as const,
        receiptNumber: "RCP-004",
      },
      {
        memberId: insertedMembers[1].id,
        amount: "2000.00",
        type: "donation",
        paymentStatus: "paid" as const,
        receiptNumber: "RCP-005",
        paymentDate: new Date("2024-03-01"),
      },
    ];

    await db.insert(contributions).values(contribData);

    // Create sample events
    const now = new Date();
    const eventData = [
      {
        titleEn: "Sunday Liturgy Service",
        titleAm: "የእሁድ ቅዳሴ",
        descriptionEn: "Weekly Sunday Liturgy and Holy Communion at Sebeta Wata Kidist Silassie Church.",
        descriptionAm: "በሰበታ ዋታ ቅድስት ሥላሴ ቤ/ክ ሳምንታዊ የእሁድ ቅዳሴ እና ቅዱስ ቁርባን አገልግሎት።",
        eventDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        location: "ሰበታ ዋታ ቅድስት ሥላሴ ቤ/ክ",
        eventType: "liturgy",
        isLiturgical: true,
      },
      {
        titleEn: "Timkat (Epiphany) Celebration",
        titleAm: "ጥምቀት",
        descriptionEn: "Annual Timkat celebration commemorating the baptism of Jesus.",
        descriptionAm: "የኢየሱስ ጥምቀትን የሚያስታውስ ዓመታዊ የጥምቀት ክብረ በዓል።",
        eventDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        location: "ሰበታ ዋታ ቤ/ክ ግቢ",
        eventType: "holiday",
        isLiturgical: true,
      },
      {
        titleEn: "Community Fellowship Dinner",
        titleAm: "የማህበረሰብ ምሳ",
        descriptionEn: "Monthly community gathering and fellowship dinner.",
        descriptionAm: "ወርሃዊ የማህበረሰብ ስብሰባ እና ምሳ።",
        eventDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        location: "ሰበታ ዋታ የማህበረሰብ አዳራሽ",
        eventType: "community",
        isLiturgical: false,
      },
      {
        titleEn: "Bible Study Group",
        titleAm: "የመጽሐፍ ቅዱስ ጥናት",
        descriptionEn: "Weekly Bible study and discussion group.",
        descriptionAm: "ሳምንታዊ የመጽሐፍ ቅዱስ ጥናት እና ውይይት ቡድን።",
        eventDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        location: "ሰበታ ዋታ ቤ/ክ ቤተ መጻሕፍት",
        eventType: "meeting",
        isLiturgical: false,
      },
    ];

    await db.insert(events).values(eventData);

    // Create sample announcements
    await db.insert(announcements).values([
      {
        titleEn: "Fasting Season Begins",
        titleAm: "የጾም ወቅት ጀምሯል",
        contentEn: "The Great Lent fasting season begins this week. All members are reminded to observe the fasting traditions.",
        contentAm: "ዐቢይ ጾም በዚህ ሳምንት ይጀምራል። ሁሉም አባላት የጾም ወጎችን እንዲጠብቁ ይታሰባሉ።",
        priority: 2,
        isActive: true,
      },
      {
        titleEn: "New Sunday School Program",
        titleAm: "አዲስ የሰንበት ትምህርት ቤት ፕሮግራም",
        contentEn: "Registration is now open for the new Sunday School program for children ages 5-15.",
        contentAm: "ለ5-15 ዓመት ልጆች ለአዲሱ የሰንበት ትምህርት ቤት ፕሮግራም ምዝገባ ተከፍቷል።",
        priority: 1,
        isActive: true,
      },
    ]);

    // Create sample service history for first member
    await db.insert(serviceHistory).values([
      {
        memberId: insertedMembers[0].id,
        serviceName: "Baptism",
        serviceNameAm: "ጥምቀት",
        serviceDate: new Date("2023-01-19"),
        officiant: "Abba Gebriel",
        notes: "Adult baptism ceremony",
      },
      {
        memberId: insertedMembers[0].id,
        serviceName: "Holy Communion",
        serviceNameAm: "ቅዱስ ቁርባን",
        serviceDate: new Date("2024-01-07"),
        officiant: "Abba Yohannes",
      },
    ]);

    return NextResponse.json({
      message: "Database seeded successfully",
      adminCredentials: {
        email: "admin@mahiberesilassie.org",
        password: "admin123",
      },
      memberCredentials: {
        email: "member@example.com",
        password: "member123",
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
