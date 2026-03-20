"use client"
import Image from "next/image";

export interface CryptoCoin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number | null;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    roi: null | { times: number; currency: string; percentage: number };
    last_updated: string;
}

export default function TwoFourLooser({ data }: { data: CryptoCoin[] }) {
    const coins = data
        .filter((item: CryptoCoin) => item.price_change_percentage_24h < 0)
        .sort((a: CryptoCoin, b: CryptoCoin) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 5);

    return (
        <div className="flex-1 min-w-[200px] border border-[#1e1e1e] bg-[#111] rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-[#e5e5e5] uppercase tracking-wider">Top Losers</span>
                <span className="text-xs text-[#555] cursor-pointer hover:text-[#888] transition-colors">More →</span>
            </div>

            <div className="space-y-3">
                {coins.map((coin: CryptoCoin) => (
                    <div key={coin.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                            <Image src={coin.image} alt={coin.name} width={20} height={20} className="w-5 h-5 rounded-full opacity-90" />
                            <span className="text-xs text-[#ccc] group-hover:text-[#fff] transition-colors">{coin.name}</span>
                        </div>
                        <span className="text-xs font-mono text-red-500">
                            {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}