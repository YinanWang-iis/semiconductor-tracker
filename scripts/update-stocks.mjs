import { mkdir, readFile, writeFile } from "node:fs/promises";

const seed = JSON.parse(await readFile("data/stocks-seed.json", "utf8"));

async function fetchYahooQuote(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "semiconductor-tracker/1.0" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const result = payload.chart?.result?.[0];
    if (!result) throw new Error("No chart result");
    const meta = result.meta || {};
    const quote = result.indicators?.quote?.[0] || {};
    const closes = (quote.close || []).filter((value) => typeof value === "number");
    const current = typeof meta.regularMarketPrice === "number" ? meta.regularMarketPrice : closes.at(-1);
    const previous = typeof meta.chartPreviousClose === "number" ? meta.chartPreviousClose : closes.at(-2);
    const change = current != null && previous ? current - previous : null;
    const changePercent = change != null && previous ? (change / previous) * 100 : null;
    return {
      price: current,
      previousClose: previous,
      change,
      changePercent,
      currency: meta.currency || "",
      exchange: meta.exchangeName || meta.fullExchangeName || "",
      marketTime: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : "",
      source: "Yahoo Finance chart",
      ok: true,
    };
  } catch (error) {
    return {
      price: null,
      previousClose: null,
      change: null,
      changePercent: null,
      currency: "",
      exchange: "",
      marketTime: "",
      source: "Yahoo Finance chart",
      ok: false,
      error: error.message,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchFinnhubQuote(symbol) {
  if (!process.env.FINNHUB_API_KEY) return null;
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${process.env.FINNHUB_API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const payload = await response.json();
    if (typeof payload.c !== "number" || payload.c <= 0) return null;
    return {
      price: payload.c,
      previousClose: payload.pc,
      change: payload.d,
      changePercent: payload.dp,
      currency: "USD",
      exchange: "US",
      marketTime: payload.t ? new Date(payload.t * 1000).toISOString() : "",
      source: "Finnhub",
      ok: true,
    };
  } catch {
    return null;
  }
}

function round(value, digits = 2) {
  return typeof value === "number" && Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

const stocks = [];
for (const item of seed) {
  const finnhub = /^[A-Z.]+$/.test(item.symbol) ? await fetchFinnhubQuote(item.symbol) : null;
  const quote = finnhub || await fetchYahooQuote(item.yahoo || item.symbol);
  stocks.push({
    ...item,
    price: round(quote.price),
    previousClose: round(quote.previousClose),
    change: round(quote.change),
    changePercent: round(quote.changePercent),
    currency: quote.currency,
    exchange: quote.exchange,
    marketTime: quote.marketTime,
    quoteSource: quote.source,
    ok: quote.ok,
    error: quote.error || "",
  });
}

await mkdir("data", { recursive: true });
await writeFile("data/stocks.json", JSON.stringify({
  updatedAt: new Date().toISOString().slice(0, 10),
  source: process.env.FINNHUB_API_KEY ? "finnhub-or-yahoo" : "yahoo-chart",
  sourceNote: process.env.FINNHUB_API_KEY
    ? "优先 Finnhub，失败时回退 Yahoo Finance chart；可能为延迟行情"
    : "Yahoo Finance chart 非官方公开接口；可能为延迟行情",
  stocks,
}, null, 2));
