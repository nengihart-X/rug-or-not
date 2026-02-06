
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("--- LATEST TOKENS IN DATABASE ---");
    const tokens = await prisma.token.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    tokens.forEach(t => {
        console.log(`ID: ${t.id}`);
        console.log(`Symbol: ${t.symbol}`);
        console.log(`Icon: ${t.iconUrl}`);
        console.log(`Created: ${t.createdAt}`);
        console.log("------------------------------");
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
