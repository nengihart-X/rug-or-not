"use client";

import { useState, useEffect } from "react";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/navigation";

export const Header = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const router = useRouter();

    return (
        <header className="border-b border-neutral-800 py-4 px-6 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-md z-50">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
                <span className="text-2xl font-black italic tracking-tighter">RUGORNOT 🎯</span>
            </div>
            <div className="flex items-center gap-4">
                {mounted && <ConnectKitButton />}
            </div>
        </header>
    );
};
