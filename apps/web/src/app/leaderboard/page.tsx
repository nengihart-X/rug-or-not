import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Leaderboard() {
    const topPredictors = [
        { address: "0x742d...444", earned: 12.5, accuracy: 92, correct: 45, incorrect: 4 },
        { address: "0x123a...bc2", earned: 8.2, accuracy: 88, correct: 38, incorrect: 5 },
        { address: "0xdeab...345", earned: 5.7, accuracy: 85, correct: 30, incorrect: 5 },
        { address: "0x987f...123", earned: 4.1, accuracy: 82, correct: 25, incorrect: 6 },
        { address: "0x555c...def", earned: 2.9, accuracy: 78, correct: 20, incorrect: 6 },
    ];

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto pt-32 px-6">
                <div className="mb-20 space-y-4">
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/5 px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.4em] italic neon-border">
                        ELITE HUNTERS
                    </Badge>
                    <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase mb-4">LEADERBOARD</h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                    <p className="text-neutral-500 font-mono text-xs tracking-[0.3em] uppercase pt-2">Detecting deception. Harvesting rewards.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {topPredictors.map((user, index) => (
                        <Card key={user.address} className="glass-card hover:border-purple-500/30 transition-all group overflow-hidden">
                            <CardContent className="p-0 flex items-stretch">
                                <div className="w-24 bg-white/5 flex items-center justify-center border-r border-white/5">
                                    <div className="text-5xl font-black text-neutral-800 group-hover:text-purple-500 transition-colors italic tracking-tighter">
                                        #{index + 1}
                                    </div>
                                </div>
                                <div className="flex-1 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="space-y-4 w-full md:w-auto text-center md:text-left">
                                        <div className="font-mono text-xl font-black italic tracking-tightest underline decoration-purple-500/30 group-hover:decoration-purple-500 transition-all">{user.address}</div>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                            <Badge variant="outline" className="text-[9px] border-green-500/20 text-green-500 bg-green-500/5 font-black uppercase tracking-widest italic">
                                                {user.correct} TARGETS HIT
                                            </Badge>
                                            <Badge variant="outline" className="text-[9px] border-red-500/20 text-red-500 bg-red-500/5 font-black uppercase tracking-widest italic">
                                                {user.incorrect} MISSES
                                            </Badge>
                                            <Badge variant="outline" className="text-[9px] border-white/10 text-neutral-500 bg-white/5 font-black uppercase tracking-widest italic">
                                                {user.accuracy}% PRECISION
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="text-center md:text-right space-y-1 min-w-[150px]">
                                        <div className="text-4xl font-black text-green-500 neon-text-green italic tracking-tighter">{user.earned} ETH</div>
                                        <div className="text-[9px] font-mono text-neutral-500 tracking-[0.5em] uppercase italic">DIVIDENDS REAPED</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-24 p-12 glass-card text-center border-purple-500/10">
                    <p className="text-neutral-500 font-mono text-[10px] max-w-xl mx-auto leading-loose uppercase tracking-widest italic">
                        Rewards are finalized on-chain upon resolution. Precision yields premium dividends. Accuracy is the only currency here.
                    </p>
                    <Button variant="link" className="mt-8 text-purple-400 font-black italic uppercase tracking-[0.3em] text-[10px] hover:text-purple-300">
                        LEARN PROTOCOL MECHANICS →
                    </Button>
                </div>
            </div>
        </div>
    );
}
