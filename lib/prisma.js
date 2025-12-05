import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis;

// Create PostgreSQL connection pool without native bindings
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // Disable native bindings to avoid pg-native issues
  allowExitOnIdle: true,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create PrismaClient instance
const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
