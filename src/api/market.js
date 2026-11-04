// api/market.js
export default async function handler(req, res) {
  try {
    const symbols = 'GOLDBEES.NS,SILVERBEES.NS,SETFGOLD.NS,AXISGOLD.NS';
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Enable CORS for your frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}