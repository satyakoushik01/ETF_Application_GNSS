// src/services/marketData.js

// Yahoo Finance tickers for NSE Gold & Silver ETFs + Spot Rates
export const TRACKED_SYMBOLS = [
  { symbol: 'GOLDBEES.NS', name: 'Nippon India Gold ETF', category: 'Gold' },
  { symbol: 'SILVERBEES.NS', name: 'Nippon India Silver ETF', category: 'Silver' },
  { symbol: 'SETFGOLD.NS', name: 'SBI Gold ETF', category: 'Gold' },
  { symbol: 'AXISGOLD.NS', name: 'Axis Gold ETF', category: 'Gold' },
];

export async function fetchLiveMarketData() {
  try {
    const symbolsString = TRACKED_SYMBOLS.map(s => s.symbol).join(',');
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsString}`;
    
    // Using CORS proxy to bypass browser origin blocks
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    const results = data?.quoteResponse?.result || [];

    return TRACKED_SYMBOLS.map(item => {
      const liveData = results.find(r => r.symbol === item.symbol) || {};
      const currentPrice = liveData.regularMarketPrice || 0;
      const change = liveData.regularMarketChange || 0;
      const changePercent = liveData.regularMarketChangePercent || 0;

      return {
        symbol: item.symbol,
        name: item.name,
        category: item.category,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        high: liveData.regularMarketDayHigh || 0,
        low: liveData.regularMarketDayLow || 0,
        volume: liveData.regularMarketVolume || 0,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    });
  } catch (error) {
    console.error("Live Yahoo market fetch failed:", error);
    return null;
  }
}