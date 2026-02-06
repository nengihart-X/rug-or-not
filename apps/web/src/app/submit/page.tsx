"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

import { isAddress, createPublicClient, http, parseAbi } from "viem";
import { base, baseSepolia } from "viem/chains";

const ERC20_ABI = parseAbi([
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
]);

const mainnetClient = createPublicClient({
    chain: base,
    transport: http(),
});

const sepoliaClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
});

export default function SubmitToken() {
    const [address, setAddress] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [scanStatus, setScanStatus] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!address || !isAddress(address)) {
            setError("INVALID CONTRACT ADDRESS FORMAT");
            return;
        }

        setIsScanning(true);
        setScanStatus("QUERYING DEX SCREENER...");

        try {
            // 1. Try DEX Screener V1 (Exact address match on Base)
            setScanStatus("QUERYING DEX V1...");
            const normalizedAddress = address.toLowerCase();
            const dexResponse = await fetch(`https://api.dexscreener.com/tokens/v1/base/${normalizedAddress}`);
            let dexData = await dexResponse.json();

            // If not on Base V1, try Search (Global fallback)
            if (!dexData || dexData.length === 0) {
                setScanStatus("BASE V1 EMPTY. SEARCHING GLOBALLY...");
                const searchResponse = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${normalizedAddress}`);
                const searchData = await searchResponse.json();
                dexData = searchData.pairs || [];
            } else {
                // DEX V1 returns an array of pairs, let's wrap it for consistent logic below
                dexData = { pairs: dexData };
            }

            let name = "";
            let symbol = "";
            let iconUrl = "";

            if (dexData.pairs && dexData.pairs.length > 0) {
                // Filter for Base pairs first to be more accurate if found
                const basePair = dexData.pairs.find((p: any) => p.chainId === "base");
                const pair = basePair || dexData.pairs[0];

                name = pair.baseToken.name;
                symbol = pair.baseToken.symbol;
                iconUrl = pair.info?.imageUrl || "";
                setScanStatus(`MATCH: ${name} (${symbol})`);
            } else {
                // 2. Fallback to On-Chain Scan (Base Mainnet Primary)
                setScanStatus("QUERYING BASE MAINNET...");
                let bytecode = await mainnetClient.getBytecode({
                    address: address as `0x${string}`,
                });

                let activeClient = mainnetClient;

                if (!bytecode || bytecode === '0x') {
                    setScanStatus("MAINNET EMPTY. SEARCHING BASE SEPOLIA...");
                    bytecode = await sepoliaClient.getBytecode({
                        address: address as `0x${string}`,
                    });
                    activeClient = sepoliaClient;
                }

                if (!bytecode || bytecode === '0x') {
                    throw new Error("TARGET NOT FOUND ON BASE MAINNET OR SEPOLIA");
                }

                setScanStatus("CONTRACT DETECTED. DECODING METADATA...");
                try {
                    name = await activeClient.readContract({
                        address: address as `0x${string}`,
                        abi: ERC20_ABI,
                        functionName: "name",
                    });
                } catch (e) {
                    name = "Unknown Token";
                }

                try {
                    symbol = await activeClient.readContract({
                        address: address as `0x${string}`,
                        abi: ERC20_ABI,
                        functionName: "symbol",
                    });
                } catch (e) {
                    symbol = "???";
                }
            }

            if (name === "Unknown Token" && symbol === "???") {
                throw new Error("TARGET DOES NOT APPEAR TO BE AN ERC20 TOKEN");
            }

            setScanStatus(`MATCHED: ${name} (${symbol})`);

            // 3. Register with Backend
            setScanStatus("SYNCHRONIZING WITH RISK ENGINE...");
            const response = await fetch("http://localhost:5000/api/tokens", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    address: address.toLowerCase(),
                    name,
                    symbol,
                    iconUrl
                }),
            });

            if (!response.ok) throw new Error("Failed to register token");

            const data = await response.json();

            // 3. Success redirect
            setScanStatus("SCAN COMPLETE. REDIRECTING...");
            setTimeout(() => {
                router.push(`/token/${address.toLowerCase()}`);
            }, 1000);

        } catch (err: any) {
            console.error("Scan failed:", err);
            setError(err.message || "SCAN FAILED: TARGET IS NOT A VALID ERC20 OR NETWORK ERROR");
            setIsScanning(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-xl mx-auto pt-32 px-6">
                <Button
                    variant="link"
                    className="text-neutral-500 hover:text-white p-0 mb-12 font-mono text-[10px] tracking-widest uppercase italic"
                    onClick={() => router.back()}
                >
                    ← BACK TO COMMAND
                </Button>

                <Card className="glass-card overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                    <CardHeader className="space-y-4">
                        <CardTitle className="text-5xl font-black italic tracking-tighter uppercase">INITIATE SCAN</CardTitle>
                        <CardDescription className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest leading-loose">
                            Target the contract address for automated risk evaluation. The market opens immediately after detection.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleScan} className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-mono font-black text-purple-500 uppercase tracking-[0.4em] italic">
                                    Target Address
                                </label>
                                <Input
                                    placeholder="0X..."
                                    className={`bg-black/50 border-white/10 rounded-none h-20 font-mono text-2xl focus-visible:ring-purple-500/50 uppercase placeholder:text-neutral-800 ${error ? 'border-red-500/50' : ''}`}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                {error && (
                                    <p className="text-[10px] font-mono text-red-500 font-bold tracking-widest uppercase italic animate-pulse">
                                        !! {error}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isScanning || !address}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-20 text-xl font-black rounded-none border-b-4 border-purple-800 uppercase tracking-[0.2em] transition-all hover:-translate-y-1 active:translate-y-0"
                            >
                                {isScanning ? "RECOGNIZING TARGET..." : "EXECUTE AI SCAN"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {isScanning && (
                    <div className="mt-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex justify-between items-center text-[10px] font-mono font-black tracking-widest text-purple-500/50 italic">
                            <span>{scanStatus}</span>
                            <span>{scanStatus.includes('COMPLETE') ? '100%' : 'IN PROGRESS'}</span>
                        </div>
                        <div className="h-1 bg-neutral-900 rounded-none overflow-hidden neon-border">
                            <div className="h-full bg-purple-500 animate-[progress_2s_ease-in-out_infinite]" style={{ width: scanStatus.includes('COMPLETE') ? '100%' : '45%' }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
