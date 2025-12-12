import { config } from 'dotenv';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

// Load environment variables
config({ path: '.env.local' });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  allowExitOnIdle: true,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seeding...');

  // Delete existing data for demo user if exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'nandaiqbalhanafii@gmail.com' },
  });

  if (existingUser) {
    console.log('🗑️ Deleting existing data for demo user...');
    await prisma.transaction.deleteMany({ where: { userId: existingUser.id } });
    await prisma.wallet.deleteMany({ where: { userId: existingUser.id } });
    await prisma.category.deleteMany({ where: { userId: existingUser.id } });
    await prisma.account.deleteMany({ where: { userId: existingUser.id } });
    if (existingUser.subscriptionId) {
      await prisma.subscription.delete({ where: { id: existingUser.subscriptionId } });
    }
    await prisma.user.delete({ where: { id: existingUser.id } });
    console.log('✅ Existing data deleted');
  }
  
  await prisma.$disconnect();
  await pool.end();
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });
