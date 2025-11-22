import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL || "");

export { and, asc, desc, eq, not, or, sql } from "drizzle-orm";
