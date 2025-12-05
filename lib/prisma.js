import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis;

// Disable pg-native for better compatibility on serverless platforms
process.env.NODE_PG_FORCE_NATIVE = false;

// PostgreSQL Pool (tanpa pg-native)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  allowExitOnIdle: true,
});

// Prisma adapter
const adapter = new PrismaPg(pool);

// Cegah multiple instance saat dev (Next.js hot reload)
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
