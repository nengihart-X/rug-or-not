"use client";

import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";

export const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [base, baseSepolia],
        transports: {
            // RPC URL for each chain
            [base.id]: http(),
            [baseSepolia.id]: http(),
        },

        // Required API Keys
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3fcc6b144f6496662c66c860201df342",

        // Required App Info
        appName: "RugOrNot",

        // Optional App Info
        appDescription: "Crowd-Judged Token Risk Engine",
        appUrl: "http://localhost:3000",
        appIcon: "https://rugornot.xyz/logo.png",
    })
);
