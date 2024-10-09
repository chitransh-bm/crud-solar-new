import { sql } from "drizzle-orm";
import { mysqlTable, serial, varchar, datetime } from "drizzle-orm/mysql-core";

// Define the `users` table schema
export const users = mysqlTable("users", {
  userId: serial("user_id").primaryKey(), // Unique identifier
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  jobTitle: varchar("job_title", { length: 255 }),
  department: varchar("department", { length: 255 }),
  company: varchar("company", { length: 255 }),
  role: varchar("role", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  deletedAt: datetime("deleted_at"),
  lastLogin: datetime("last_login"),
  timeZone: varchar("time_zone", { length: 50 }).notNull(),
  languagePref: varchar("language_pref", { length: 50 })
    .default("en")
    .notNull(),
  lastPasswordChange: datetime("last_password_change"),
  deviceInfo: varchar("device_info", { length: 255 }),
});
