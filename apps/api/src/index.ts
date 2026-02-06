import express from "express";
import cors from "cors";
import morgan from "morgan";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import axios from "axios";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

const cerebras = new Cerebras({
    apiKey: process.env.CEREBRAS_API_KEY
});

async function getRiskAnalysis(address: string, name: string, symbol: string) {
    console.log(`[AI] Analyzing risk for ${symbol} (${address})...`);

    let riskScore = 50;
    let aiSummary = "Analysis pending...";
    let aiVerdict = "Neutral";

    try {
        console.log(`[AI] Querying Honeypot.is...`);
        const hpResponse = await axios.get(`https://api.honeypot.is/v2/IsHoneypot`, {
            params: { address, chainID: 8453 },
            timeout: 10000 // 10s timeout
        });

        const hpData = hpResponse.data;
        console.log(`[AI] Honeypot.is Success: ${hpData.honeypotResult?.isHoneypot ? 'Honeypot' : 'No Honeypot'}`);

        const isHoneypot = hpData.honeypotResult?.isHoneypot;

        console.log(`[AI] Requesting deep analysis from Cerebras...`);
        const prompt = `
        Analyze this crypto token and provide a brief risk summary and a verdict.
        Token: ${name} (${symbol})
        Address: ${address}
        Honeypot.is Result: ${isHoneypot ? "FAILED (Is Honeypot)" : "PASSED (No basic honeypot detected)"}
        
        Honeypot.is Detailed Stats:
        - Buy Tax: ${hpData.simulationResult?.buyTax || '0'}%
        - Sell Tax: ${hpData.simulationResult?.sellTax || '0'}%
        - Transfer Tax: ${hpData.simulationResult?.transferTax || '0'}%
        - Can sell: ${hpData.simulationResult?.canSell || 'Yes'}
        
        Return exactly this JSON format:
        {
          "riskScore": number (0-100),
          "summary": "1 sentence analysis",
          "verdict": "SAFE" | "SUSPICIOUS" | "DANGEROUS"
        }
        `;

        const completion = await cerebras.chat.completions.create({
            messages: [
                { role: "system", content: "You are a crypto security auditor. Respond ONLY with a valid JSON object." },
                { role: "user", content: prompt }
            ],
            model: 'gpt-oss-120b',
            max_completion_tokens: 500,
            temperature: 0.1
        });

        const content = completion.choices[0]?.message?.content || "{}";
        console.log(`[AI] Cerebras Response: ${content.substring(0, 100)}...`);

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);

        riskScore = result.riskScore ?? (isHoneypot ? 99 : 50);
        aiSummary = result.summary ?? "Analyzed by AI engine.";
        aiVerdict = result.verdict ?? (isHoneypot ? "DANGEROUS" : "Neutral");

    } catch (error: any) {
        console.error(`[AI] FATAL ERROR during analysis:`, error.response?.data || error.message);
    }

    return { riskScore, aiSummary, aiVerdict };
}

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
    res.json({ message: "RugOrNot API is active", port, version: "1.0.0" });
});

app.get("/api/tokens", async (req, res) => {
    try {
        const tokens = await prisma.token.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(tokens);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tokens" });
    }
});

app.get("/api/tokens/:id", async (req, res) => {
    const { id } = req.params;
    console.log(`[GET] Looking up token: ${id}`);
    try {
        const token = await prisma.token.findUnique({
            where: { id: id.toLowerCase() },
            include: { predictions: true },
        });
        if (token) {
            console.log(`[GET] Token found: ${token.symbol}`);
            res.json(token);
        } else {
            console.warn(`[GET] Token not found: ${id}`);
            res.status(404).json({ error: "Token not found" });
        }
    } catch (error) {
        console.error(`[GET] Error fetching token ${id}:`, error);
        res.status(500).json({ error: "Failed to fetch token" });
    }
});

app.post("/api/tokens", async (req, res) => {
    const { address, name, symbol, iconUrl } = req.body;
    const normalizedAddress = address.toLowerCase();
    console.log(`[POST] Registering token: ${symbol} (${normalizedAddress})`);

    try {
        // PERFORM AI ANALYSIS
        const { riskScore, aiSummary, aiVerdict } = await getRiskAnalysis(normalizedAddress, name, symbol);

        const token = await prisma.token.upsert({
            where: { id: normalizedAddress },
            update: {
                name: name || "Unknown Token",
                symbol: symbol || "???",
                iconUrl: iconUrl || null,
                honeypotUrl: `https://honeypot.is/base?address=${normalizedAddress}`,
                riskScore,
                aiSummary,
                aiVerdict
            },
            create: {
                id: normalizedAddress,
                name: name || "Unknown Token",
                symbol: symbol || "???",
                iconUrl: iconUrl || null,
                honeypotUrl: `https://honeypot.is/base?address=${normalizedAddress}`,
                riskScore,
                aiSummary,
                aiVerdict
            },
        });
        console.log(`[POST] Successfully registered: ${token.symbol}`);
        res.status(201).json(token);
    } catch (error) {
        console.error(`[POST] Failed to register token ${normalizedAddress}:`, error);
        res.status(500).json({ error: "Failed to process token registration" });
    }
});

app.post("/api/predictions", async (req, res) => {
    const { tokenId, userAddress, isLegit, amount } = req.body;
    try {
        const prediction = await prisma.prediction.create({
            data: {
                tokenId,
                userAddress,
                isLegit,
                amount,
            },
        });

        // Update token totals
        await prisma.token.update({
            where: { id: tokenId },
            data: {
                [isLegit ? "legitVotes" : "rugVotes"]: {
                    increment: amount,
                },
                stakingPool: {
                    increment: amount,
                },
            },
        });

        res.status(201).json(prediction);
    } catch (error) {
        res.status(500).json({ error: "Failed to record prediction" });
    }
});

app.post("/api/resolve", async (req, res) => {
    const { tokenId, outcome } = req.body; // outcome: true = LEGIT, false = RUG
    try {
        const token = await prisma.token.update({
            where: { id: tokenId },
            data: { isRug: !outcome },
        });

        // Reward distribution logic (Simplified)
        const winners = await prisma.prediction.findMany({
            where: { tokenId, isLegit: outcome },
        });

        const totalWinnerStake = winners.reduce((sum, p) => sum + p.amount, 0);
        const losersStake = await prisma.prediction.aggregate({
            where: { tokenId, isLegit: !outcome },
            _sum: { amount: true },
        });

        const rewardPool = losersStake._sum.amount || 0;

        // In a real app, you would credit users' balances here
        for (const winner of winners) {
            const share = (winner.amount / totalWinnerStake) * rewardPool;
            await prisma.leaderboard.upsert({
                where: { address: winner.userAddress },
                update: {
                    totalEarned: { increment: share },
                    correctVotes: { increment: 1 },
                },
                create: {
                    address: winner.userAddress,
                    totalEarned: share,
                    correctVotes: 1,
                },
            });
        }

        res.json({ message: "Token resolved", token, rewardsDistributed: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to resolve token" });
    }
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
