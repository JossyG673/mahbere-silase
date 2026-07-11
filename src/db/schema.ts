import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  decimal,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const memberStatusEnum = pgEnum("member_status", [
  "active",
  "inactive",
  "pending",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "paid",
  "pending",
  "overdue",
]);

export const userRoleEnum = pgEnum("user_role", ["admin", "member"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").default("member").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  memberId: varchar("member_id", { length: 20 }).notNull().unique(),
  userId: uuid("user_id").references(() => users.id),

  // Personal Information
  legalFirstName: varchar("legal_first_name", { length: 100 }).notNull(),
  legalLastName: varchar("legal_last_name", { length: 100 }).notNull(),
  legalMiddleName: varchar("legal_middle_name", { length: 100 }),
  baptismalName: varchar("baptismal_name", { length: 100 }),
  amharicName: varchar("amharic_name", { length: 200 }),
  dateOfBirth: varchar("date_of_birth", { length: 20 }),
  gender: varchar("gender", { length: 20 }),
  photoUrl: text("photo_url"),

  // Contact
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 30 }),
  alternatePhone: varchar("alternate_phone", { length: 30 }),

  // Address (Ethiopian format)
  country: varchar("country", { length: 100 }).default("Ethiopia"),
  region: varchar("region", { length: 100 }),
  zone: varchar("zone", { length: 100 }),
  woreda: varchar("woreda", { length: 100 }),
  kebele: varchar("kebele", { length: 50 }),
  city: varchar("city", { length: 100 }),
  subcity: varchar("subcity", { length: 100 }),
  houseNumber: varchar("house_number", { length: 50 }),

  // Parish Information
  parish: varchar("parish", { length: 200 }),
  confessionFather: varchar("confession_father", { length: 200 }),
  sundaySchool: varchar("sunday_school", { length: 200 }),
  serviceArea: varchar("service_area", { length: 200 }),

  // Emergency Contact
  emergencyContactName: varchar("emergency_contact_name", { length: 200 }),
  emergencyContactPhone: varchar("emergency_contact_phone", { length: 30 }),
  emergencyContactRelation: varchar("emergency_contact_relation", {
    length: 100,
  }),

  // Status
  status: memberStatusEnum("status").default("pending").notNull(),
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
  memberSince: timestamp("member_since"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contributions = pgTable("contributions", {
  id: uuid("id").defaultRandom().primaryKey(),
  memberId: uuid("member_id")
    .references(() => members.id)
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("ETB").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // tsedeq, donation, tithe
  description: text("description"),
  paymentStatus: paymentStatusEnum("payment_status")
    .default("pending")
    .notNull(),
  paymentDate: timestamp("payment_date"),
  receiptNumber: varchar("receipt_number", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  titleEn: varchar("title_en", { length: 300 }).notNull(),
  titleAm: varchar("title_am", { length: 300 }),
  descriptionEn: text("description_en"),
  descriptionAm: text("description_am"),
  eventDate: timestamp("event_date").notNull(),
  endDate: timestamp("end_date"),
  location: varchar("location", { length: 300 }),
  eventType: varchar("event_type", { length: 50 }), // liturgy, holiday, meeting, community
  isLiturgical: boolean("is_liturgical").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  titleEn: varchar("title_en", { length: 300 }).notNull(),
  titleAm: varchar("title_am", { length: 300 }),
  contentEn: text("content_en"),
  contentAm: text("content_am"),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

export const serviceHistory = pgTable("service_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  memberId: uuid("member_id")
    .references(() => members.id)
    .notNull(),
  serviceName: varchar("service_name", { length: 200 }).notNull(),
  serviceNameAm: varchar("service_name_am", { length: 200 }),
  serviceDate: timestamp("service_date").notNull(),
  officiant: varchar("officiant", { length: 200 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
