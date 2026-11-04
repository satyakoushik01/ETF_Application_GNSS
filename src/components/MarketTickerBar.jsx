import React, { useState, useEffect } from 'react';
import { fetchLiveMarketData } from '../services/marketData';

export function MarketTickerBar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const loadData = async () => {
    const marketData = await fetchLiveMarketData();
    if (marketData && marketData.length > 0) {
      setData(marketData);
      setLastUpdated(marketData[0].lastUpdated);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Auto-refresh prices every 30 seconds
    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground bg-card rounded-lg border border-border animate-pulse">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
        Connecting to Yahoo Finance Live Feed...
      </div>
    );
  }

  return (
    <div className="w-full bg-card border border-border rounded-xl p-3 shadow-sm mb-6">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50 text-xs">
        <div className="flex items-center gap-2 font-semibold text-amber-500 uppercase tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Live Market Watch (NSE)
        </div>
        <span className="text-muted-foreground">Updated: {lastUpdated}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item) => {
          const isPositive = item.change >= 0;
          return (
            <div key={item.symbol} className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/30">
              <div>
                <p className="font-semibold text-sm text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-foreground">₹{item.price.toFixed(2)}</p>
                <p className={`text-xs font-semibold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isPositive ? '+' : ''}{item.change.toFixed(2)} ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}