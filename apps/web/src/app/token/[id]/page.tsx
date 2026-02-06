"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TokenPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: rawId } = use(params);
    const id = rawId.toLowerCase();

    const [tokenData, setTokenData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<"LEGIT" | "RUG" | null>(null);
    const [isStaking, setIsStaking] = useState(false);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/tokens/${id}`);
                if (!response.ok) {
                    if (response.status === 404) throw new Error("TOKEN NOT RECOGNIZED BY SYSTEM");
                    throw new Error("FAILED TO CONNECT TO RISK ENGINE");
                }
                const data = await response.json();
                setTokenData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchToken();
    }, [id]);

    const handleStake = (choice: "LEGIT" | "RUG") => {
        setPrediction(choice);
        setIsStaking(true);
        setTimeout(() => setIsStaking(false), 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="space-y-6 text-center">
                    <div className="w-24 h-24 border-t-2 border-purple-500 rounded-full animate-spin mx-auto" />
                    <p className="font-mono text-[10px] text-purple-500 uppercase tracking-[0.5em] animate-pulse">
                        DECRYPTING TARGET DATA...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !tokenData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6">
                <div className="glass-card p-12 text-center border-red-500/20 max-w-md">
                    <h2 className="text-red-500 font-black italic text-4xl uppercase tracking-tighter mb-4">ERROR</h2>
                    <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest mb-8">{error || "UNKNOWN ERROR"}</p>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/submit'}
                        className="border-white/10 bg-white/5 hover:bg-white/10 rounded-none uppercase text-[10px] font-black tracking-widest px-8"
                    >
                        NEW SCAN →
                    </Button>
                </div>
            </div>
        );
    }

    const aiReport = {
        liquidityLocked: true, // Future: Fetch from DEX or Contract
        contractVerified: true,
        mintFunction: tokenData.riskScore > 60, // Simulate dynamic report
        deployerAge: "UNKNOWN",
        similarContracts: Math.floor(tokenData.riskScore / 10),
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto pt-24 px-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24">
                    {/* Header & Main Info */}
                    <div className="flex-1 w-full max-w-4xl space-y-12">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 rounded-none font-mono text-[10px] tracking-widest neon-border py-1">
                                    SCAN SUCCESS
                                </Badge>
                                <span className="text-neutral-500 font-mono text-[10px] tracking-tighter uppercase break-all">{tokenData.address}</span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                                {tokenData.iconUrl && (
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/10 shrink-0 bg-black/50 shadow-2xl">
                                        <img src={tokenData.iconUrl} alt={tokenData.symbol} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tightest uppercase italic leading-none break-words">
                                        {tokenData.name}
                                    </h1>
                                    <div className="text-neutral-500 text-3xl font-mono uppercase tracking-tighter">
                                        ${tokenData.symbol}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-12 lg:gap-16 mt-8">
                            <div className="text-center group shrink-0">
                                <div className={`text-8xl md:text-9xl font-black italic tracking-tighter transition-all group-hover:scale-110 ${tokenData.riskScore > 50 ? 'text-red-500 neon-text-red' : 'text-green-500 neon-text-green'}`}>
                                    {tokenData.riskScore}
                                </div>
                                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.4em] mt-3 italic">AI Risk Index</div>
                            </div>
                            <div className="h-24 w-px bg-white/5 hidden lg:block" />
                            <div className="flex-1 max-w-xl space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-5 bg-white/5 border border-white/5 backdrop-blur-sm group hover:border-white/10 transition-all">
                                        <div className={`w-2 h-2 rounded-full ${aiReport.liquidityLocked ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
                                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Liquidity Locked</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-5 bg-white/5 border border-white/5 backdrop-blur-sm group hover:border-white/10 transition-all">
                                        <div className={`w-2 h-2 rounded-full ${aiReport.contractVerified ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
                                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Contract Verified</span>
                                    </div>
                                    {aiReport.mintFunction && (
                                        <div className="flex items-center gap-3 p-5 bg-red-500/10 border border-red-500/20 col-span-full animate-pulse">
                                            <span className="text-red-500 font-bold">!!</span>
                                            <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-black italic">High Risk Methods Detected</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Staking Widget */}
                    <Card className="w-full lg:w-96 glass-card shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                        <CardHeader className="pb-8">
                            <CardTitle className="text-3xl font-black italic tracking-tighter uppercase">MARKET POSITION</CardTitle>
                            <CardDescription className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest uppercase">Set your conviction level</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-10">
                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] font-mono font-black italic tracking-widest">
                                    <span className="text-green-500">LEGIT $4.5K</span>
                                    <span className="text-red-500">RUG $12.2K</span>
                                </div>
                                <div className="h-2 bg-neutral-900 overflow-hidden flex neon-border">
                                    <div
                                        className="bg-green-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                        style={{ width: `27%` }}
                                    />
                                    <div
                                        className="bg-red-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                        style={{ width: `73%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <Button
                                    onClick={() => handleStake("LEGIT")}
                                    className={`h-20 font-black rounded-none border transition-all uppercase tracking-widest text-sm ${prediction === "LEGIT"
                                        ? "bg-green-600 border-white text-white neon-border"
                                        : "bg-neutral-900 border-white/5 hover:border-green-500 text-neutral-400"
                                        }`}
                                >
                                    STAKE LEGIT
                                </Button>
                                <Button
                                    onClick={() => handleStake("RUG")}
                                    className={`h-20 font-black rounded-none border transition-all uppercase tracking-widest text-sm ${prediction === "RUG"
                                        ? "bg-red-600 border-white text-white neon-border"
                                        : "bg-neutral-900 border-white/5 hover:border-red-500 text-neutral-400"
                                        }`}
                                >
                                    STAKE RUG
                                </Button>
                            </div>

                            {prediction && (
                                <div className="text-center pt-4 animate-in zoom-in duration-500">
                                    <p className="text-[10px] font-mono text-purple-400 font-black uppercase tracking-[0.4em] italic">
                                        {isStaking ? "TRANSMITTING DATA..." : `POSITION LOCKED: ${prediction}`}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Analysis */}
                <section className="mt-32">
                    <Tabs defaultValue="analysis" className="w-full">
                        <TabsList className="bg-transparent border-b border-white/5 w-full justify-start rounded-none h-auto p-0 gap-12">
                            <TabsTrigger
                                value="analysis"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent text-neutral-500 data-[state=active]:text-white font-black h-16 uppercase tracking-[0.2em] text-[10px] transition-all"
                            >
                                DEEP ANALYSIS
                            </TabsTrigger>
                            <TabsTrigger
                                value="votes"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent text-neutral-500 data-[state=active]:text-white font-black h-16 uppercase tracking-[0.2em] text-[10px] transition-all"
                            >
                                STAKE HISTORY
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="analysis" className="py-12 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h3 className="font-black italic text-xl uppercase tracking-tighter">CONTRACT METRICS</h3>
                                    <div className="space-y-2 font-mono text-xs">
                                        <div className="flex justify-between p-5 bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                            <span className="text-neutral-500 uppercase tracking-widest italic">Deployer Seniority</span>
                                            <span className="font-black">{aiReport.deployerAge}</span>
                                        </div>
                                        <div className="flex justify-between p-5 bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                            <span className="text-neutral-500 uppercase tracking-widest italic">Clone Probability</span>
                                            <span className="font-black">{aiReport.similarContracts} MATCHES</span>
                                        </div>
                                        {tokenData.riskScore > 75 && (
                                            <div className="flex justify-between p-5 bg-red-500/5 border border-red-500/20 text-red-500">
                                                <span className="text-red-500/50 uppercase tracking-widest font-black italic">Suspicious Logic</span>
                                                <span className="font-black italic underline">FOUND</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="font-black italic text-xl uppercase tracking-tighter">AI VERDICT</h3>
                                    <div className={`p-8 bg-neutral-900 border-l-4 ${tokenData.aiVerdict === 'DANGEROUS' ? 'border-red-500' : tokenData.aiVerdict === 'SAFE' ? 'border-green-500' : 'border-yellow-500'} space-y-4`}>
                                        <p className="text-neutral-400 text-sm leading-relaxed font-bold">
                                            {tokenData.aiSummary}
                                        </p>
                                        <p className={`font-black italic uppercase tracking-widest text-[10px] underline decoration-2 ${tokenData.aiVerdict === 'DANGEROUS' ? 'text-red-500 decoration-red-500' : tokenData.aiVerdict === 'SAFE' ? 'text-green-500 decoration-green-500' : 'text-yellow-500 decoration-yellow-500'}`}>
                                            VERDICT: {tokenData.aiVerdict}
                                        </p>
                                    </div>
                                    {tokenData.honeypotUrl && (
                                        <div className="pt-4">
                                            <a
                                                href={tokenData.honeypotUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all font-black italic uppercase tracking-widest text-[10px]"
                                            >
                                                <span className="text-yellow-500">外部分析</span> VIEW EXTERNAL HONEYPOT REPORT →
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="votes">
                            <div className="py-24 text-center text-neutral-700 font-mono text-[10px] italic tracking-[0.5em] uppercase animate-pulse">
                                FETCHING ON-CHAIN STAKES...
                            </div>
                        </TabsContent>
                    </Tabs>
                </section>
            </div>
        </div>
    );
}
