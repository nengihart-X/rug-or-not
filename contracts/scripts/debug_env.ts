import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const key = process.env.PRIVATE_KEY;
    if (!key) {
        console.error("❌ PRIVATE_KEY is missing in process.env");
        return;
    }

    console.log("✅ PRIVATE_KEY found");
    console.log("Length:", key.length);
    if (key.startsWith("0x")) {
        console.log("Prefix: Starts with 0x");
    } else {
        console.log("❌ Prefix: Does NOT start with 0x (Hardhat often expects 0x)");
    }
}

main().catch(console.error);
