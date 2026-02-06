"use client";

import { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/web3-config";

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Suppress the annoying Aave Wallet lazy connection timeout warning
        const originalError = console.error;
        console.error = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('Failed to establish lazy connection')) {
                return;
            }
            originalError.apply(console, args);
        };

        return () => {
            console.error = originalError;
        };
    }, []);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider theme="dark">
                    {children}
                </ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
