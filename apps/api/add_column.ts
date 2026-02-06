
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("Adding columns to Token table...");
    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Token" ADD COLUMN IF NOT EXISTS "iconUrl" TEXT;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Token" ADD COLUMN IF NOT EXISTS "honeypotUrl" TEXT;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Token" ADD COLUMN IF NOT EXISTS "aiSummary" TEXT DEFAULT 'Analysis pending...';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Token" ADD COLUMN IF NOT EXISTS "aiVerdict" TEXT DEFAULT 'Neutral';`);
        console.log("Columns added successfully or already exist.");
    } catch (error) {
        console.error("Failed to add column:", error);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
