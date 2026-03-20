"use client";

import { useState, useEffect } from "react";
import Top3 from "@/components/Chart/ANALYSIS/top3";
import TwoFourgainers from "@/components/Chart/ANALYSIS/gainer";
import TwoFourLooser from "./ANALYSIS/looser";
import { CryptoCoin } from "@/components/Chart/ANALYSIS/top3";

function fmt(n: number) {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    return `$${n.toLocaleString()}`;
}

// Move the fetch function outside component
async function fetchCryptoData(): Promise<CryptoCoin[]> {
    const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=20&page=1",
        { next: { revalidate: 6 } }
    );
    
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
}

export default function Leaderboard() {
    const [data, setData] = useState<CryptoCoin[]>([]);
    const [newData , setNewData] = useState<CryptoCoin[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [price, setPrice] = useState<any>({});

    // Fetch data using the external function
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await fetchCryptoData();
                setData(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch data");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    

    // WebSocket connection
    useEffect(() => {
        if (data.length === 0) return;

        const symbols = data.map(c => c.symbol.toLowerCase());
        const params = symbols
            .map(s => `${s}usdt@trade`)
            .join("/");

        const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${params}`);
        
        
        ws.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {
            try {
              const message = JSON.parse(event.data);
        const coinSymbol = message.stream.slice(0, -10);
        const tradeData = message.data;
        
        setData(prevData => 
            prevData.map(item => {
                if (item.symbol.toLowerCase() === coinSymbol) {
                    return {
                        ...item,
                        current_price: parseFloat(tradeData.p)
                    };
                }
                return item;
            })
        );
                
            } catch (err) {
                console.error("WebSocket message error:", err);
            }
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => {
            ws.close();
        };
    }, [data]);

    if (loading) {
        return (
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-[#e5e5e5]">Loading cryptocurrency data...</div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-red-500">Error: {error}</div>
                </div>
            </main>
        );
    }

    if (data.length === 0) {
        return (
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-[#e5e5e5]">No data available</div>
                </div>
            </main>
        );
    }

    return (
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Summary cards */}
            <section className="flex flex-row gap-3 flex-wrap">
                <Top3 data={data.slice(0, 5)} />
                <TwoFourgainers data={[...data]} />
                <TwoFourLooser data={[...data]} />
            </section>

            {/* Market table */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-medium text-[#e5e5e5] uppercase tracking-wider">Market Overview</h2>
                    <span className="text-xs text-[#555]">Top 20 by Market Cap</span>
                </div>

                <div className="border border-[#1e1e1e] rounded-lg overflow-hidden overflow-x-auto">
                    <table className="w-full text-xs min-w-[768px]">
                        <thead>
                            <tr className="border-b border-[#1e1e1e] bg-[#0f0f0f]">
                                <th className="text-left px-4 py-3 text-[#555] font-normal w-8">#</th>
                                <th className="text-left px-4 py-3 text-[#555] font-normal">Name</th>
                                <th className="text-right px-4 py-3 text-[#555] font-normal">Price</th>
                                <th className="text-right px-4 py-3 text-[#555] font-normal hidden sm:table-cell">24h %</th>
                                <th className="text-right px-4 py-3 text-[#555] font-normal hidden md:table-cell">Market Cap</th>
                                <th className="text-right px-4 py-3 text-[#555] font-normal hidden md:table-cell">Volume 24h</th>
                                <th className="text-right px-4 py-3 text-[#555] font-normal hidden lg:table-cell">24h High</th>
                                <th className="text-right px-4 py-3 text-[#555] font-normal hidden lg:table-cell">24h Low</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((coin: CryptoCoin, i: number) => {
                                const isPos = coin.price_change_percentage_24h >= 0;
                                return (
                                    <tr
                                        key={coin.id}
                                        className="border-b border-[#141414] hover:bg-[#131313] transition-colors"
                                    >
                                        <td className="px-4 py-3 text-[#444] font-mono">{i + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={coin.image} alt={coin.name} width={18} height={18} className="w-4 h-4 rounded-full" />
                                                <span className="text-[#ddd]">{coin.name}</span>
                                                <span className="text-[#444] uppercase">{coin.symbol}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-[#e5e5e5]">
                                            ${coin.current_price.toLocaleString()}
                                        </td>
                                        <td className={`px-4 py-3 text-right font-mono hidden sm:table-cell ${isPos ? "text-emerald-500" : "text-red-500"}`}>
                                            {isPos ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}%
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-[#888] hidden md:table-cell">
                                            {fmt(coin.market_cap)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-[#888] hidden md:table-cell">
                                            {fmt(coin.total_volume)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-[#666] hidden lg:table-cell">
                                            ${coin.high_24h.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-[#666] hidden lg:table-cell">
                                            ${coin.low_24h.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}