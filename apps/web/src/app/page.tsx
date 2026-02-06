"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const featuredTokens = [
    {
      id: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      name: "USDC (Test)",
      symbol: "USDC",
      riskScore: 5,
      status: "LEGIT",
      votesLegit: 98,
      votesRug: 2,
      timeLeft: "ACTIVE",
    },
    {
      id: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ether",
      symbol: "WETH",
      riskScore: 2,
      status: "LEGIT",
      votesLegit: 99,
      votesRug: 1,
      timeLeft: "ACTIVE",
    },
    {
      id: "0xRugExample",
      name: "DegenMoon",
      symbol: "DMOON",
      riskScore: 92,
      status: "RUG",
      votesLegit: 5,
      votesRug: 95,
      timeLeft: "CAUGHT",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Cinematic Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="space-y-4">
              <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/5 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.2em] neon-border">
                LIVE PREDICTIONS ON BASE
              </Badge>
              <h1 className="text-7xl md:text-9xl font-black tracking-tightest uppercase italic">
                RUG <span className="text-purple-500 neon-text-purple">OR</span> NOT?
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" />
            </div>

            <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed font-medium">
              The first crowd-judged token risk engine. <br />
              <span className="text-white italic">"Stake to predict. The market decides."</span>
            </p>

            <div className="flex flex-wrap gap-6 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => router.push("/submit")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-8 text-xl font-black rounded-none border-b-4 border-purple-800 uppercase tracking-widest transition-all hover:-translate-y-1 active:translate-y-0"
              >
                SUBMIT TOKEN
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/leaderboard")}
                className="border-neutral-800 bg-neutral-900/50 text-white px-10 py-8 text-xl font-black rounded-none hover:bg-neutral-800 uppercase tracking-widest transition-all hover:-translate-y-1 active:translate-y-0"
              >
                LEADERBOARD
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">HOT TARGETS</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">Live Consensus</p>
            </div>
          </div>
          <Button
            variant="link"
            onClick={() => router.push("/leaderboard")}
            className="text-purple-400 hover:text-purple-300 p-0 font-mono font-bold text-sm tracking-widest uppercase italic"
          >
            VIEW ALL TARGETS →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTokens.map((token) => (
            <Card
              key={token.id}
              className="glass-card group overflow-hidden hover:border-purple-500/30 transition-all duration-500 cursor-pointer"
              onClick={() => router.push(`/token/${token.id}`)}
            >
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent group-hover:via-purple-500 transition-all duration-700" />
              <CardHeader className="pb-4 relative">
                <div className="flex justify-between items-start mb-6">
                  <Badge variant="outline" className="font-mono text-[10px] border-neutral-800 bg-black/50 tracking-tighter">
                    {token.timeLeft}
                  </Badge>
                  <div className={`text-3xl font-black italic ${token.riskScore > 50 ? 'text-red-500 neon-text-red' : 'text-green-500 neon-text-green'}`}>
                    {token.riskScore}
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight uppercase italic">{token.name}</CardTitle>
                <CardDescription className="font-mono text-neutral-500 tracking-[0.3em] text-[10px] uppercase pt-1">
                  {token.symbol} • BASE SCAN
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-mono font-black tracking-widest italic overflow-hidden h-4">
                    <span className="text-green-500 animate-in slide-in-from-left duration-700">LEGIT {token.votesLegit}%</span>
                    <span className="text-red-500 animate-in slide-in-from-right duration-700">RUG {token.votesRug}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-900 rounded-none overflow-hidden flex neon-border">
                    <div
                      className="bg-green-500 h-full transition-all duration-1000"
                      style={{ width: `${token.votesLegit}%` }}
                    />
                    <div
                      className="bg-red-500 h-full transition-all duration-1000"
                      style={{ width: `${token.votesRug}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="w-full bg-neutral-900 hover:bg-green-600/30 text-white rounded-none border border-white/5 hover:border-green-500 font-black uppercase text-xs h-16 tracking-widest transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/token/${token.id}`);
                    }}
                  >
                    STAKE LEGIT
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-neutral-900 hover:bg-red-600/30 text-white rounded-none border border-white/5 hover:border-red-500 font-black uppercase text-xs h-16 tracking-widest transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/token/${token.id}`);
                    }}
                  >
                    STAKE RUG
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Board */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-purple-500/5 -skew-y-3 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="space-y-3">
              <div className="text-7xl font-black italic tracking-tighter text-white font-mono">$12,492</div>
              <div className="text-neutral-500 font-mono text-[10px] uppercase tracking-[0.5em]">Total Staked ETH</div>
            </div>
            <div className="space-y-3">
              <div className="text-7xl font-black italic tracking-tighter text-white font-mono">1,240</div>
              <div className="text-neutral-500 font-mono text-[10px] uppercase tracking-[0.5em]">Live Predictions</div>
            </div>
            <div className="space-y-3">
              <div className="text-7xl font-black italic tracking-tighter text-red-500 neon-text-red font-mono">42</div>
              <div className="text-neutral-500 font-mono text-[10px] uppercase tracking-[0.5em]">Caught Rugs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Warning Footer */}
      <section className="container mx-auto px-6 py-24">
        <div className="glass-card p-12 text-center border-red-500/20">
          <h3 className="text-red-500 font-black italic tracking-widest mb-4 animate-pulse">!! DANGER !!</h3>
          <p className="max-w-xl mx-auto text-neutral-400 font-mono text-xs leading-relaxed uppercase tracking-tighter">
            THIS PRODUCT DOES NOT PROTECT YOU FROM RUGS. <br />
            IT EXPOSES HOW FAST THEY HAPPEN. RUGORNOT IS A PREDICTION MARKET ONLY.
          </p>
        </div>
      </section>
    </main>
  );
}

