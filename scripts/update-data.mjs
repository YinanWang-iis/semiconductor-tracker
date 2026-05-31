import { mkdir, readFile, writeFile } from "node:fs/promises";

const seed = JSON.parse(await readFile("data/seed.json", "utf8"));
const now = new Date();

const metricKeywords = {
  price: ["price", "pricing", "ASP", "contract", "quote", "margin", "cost", "涨价", "价格", "报价"],
  inventory: ["inventory", "stock", "channel", "shortage", "oversupply", "lead time", "库存", "缺货", "交期"],
  capacity: ["capacity", "capex", "production", "fab", "expansion", "ramp", "utilization", "产能", "扩产", "投产", "稼动率"],
};

function gdeltUrl(query) {
  const params = new URLSearchParams({
    query,
    mode: "ArtList",
    format: "json",
    maxrecords: "12",
    sort: "HybridRel",
    timespan: "7d",
  });
  return `https://api.gdeltproject.org/api/v2/doc/doc?${params}`;
}

async function fetchArticles(query) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(gdeltUrl(query), {
      signal: controller.signal,
      headers: { "user-agent": "semiconductor-tracker/1.0" },
    });
    if (!response.ok) return [];
    const payload = await response.json();
    return (payload.articles || []).map((article) => ({
      title: article.title || "Untitled",
      url: article.url,
      source: article.sourceCountry || article.domain || "GDELT",
      date: article.seendate ? article.seendate.slice(0, 8) : "",
      snippet: article.title || "",
    })).filter((article) => article.url);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function scoreMetric(articles, metricKey) {
  const keywords = metricKeywords[metricKey];
  return articles.reduce((count, article) => {
    const text = `${article.title} ${article.snippet}`.toLowerCase();
    return count + keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length;
  }, 0);
}

function priorityFromEvidence(basePriority, evidenceCount) {
  if (evidenceCount >= 7) return "hot";
  if (evidenceCount >= 3 && basePriority === "steady") return "watch";
  return basePriority;
}

function confidenceFromEvidence(evidenceCount) {
  if (evidenceCount >= 7) return "中";
  if (evidenceCount >= 3) return "低-中";
  return "低";
}

function credibilityForUrl(url) {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "公开来源";
  }
  if (/(nvidia|amd|tsmc|micron|samsung|skhynix|intel|kioxia|western digital|wdc)\./i.test(host)) return "公司官方";
  if (/(semi|wsts|trendforce|gartner|idc|counterpoint|omdia)/i.test(host)) return "行业机构";
  if (/(reuters|bloomberg|nikkei|wsj|financialtimes|digitimes|anandtech|tomshardware)/i.test(host)) return "专业媒体";
  return "一般媒体";
}

function alertsForNode(node, articles) {
  const text = articles.map((article) => article.title).join(" ").toLowerCase();
  const alerts = [];
  if (/price|pricing|asp|contract|quote|涨价|报价|价格/.test(text)) {
    alerts.push({ level: "yellow", label: "价格信号", text: "公开来源出现定价、报价或ASP相关信息。" });
  }
  if (/inventory|stock|shortage|oversupply|lead time|库存|缺货|交期/.test(text)) {
    alerts.push({ level: "yellow", label: "库存/交期信号", text: "公开来源出现库存、短缺或交期相关信息。" });
  }
  if (/capacity|capex|production|fab|expansion|ramp|utilization|产能|扩产|投产|稼动率/.test(text)) {
    alerts.push({ level: "red", label: "产能变化", text: "公开来源出现扩产、资本开支或产能爬坡信息。" });
  }
  if (!alerts.length) {
    alerts.push({ level: articles.length ? "yellow" : "green", label: articles.length ? "新增新闻" : "暂无明显新增", text: articles.length ? `过去7天抓取到 ${articles.length} 条相关新闻。` : "过去7天公开来源信号较少。" });
  }
  return alerts.slice(0, 3);
}

function midpoint(value) {
  const nums = String(value).match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
  if (!nums.length) return 50;
  if (nums.length === 1) return nums[0];
  return (nums[0] + nums[1]) / 2;
}

function historyForMetric(metric, articles, metricKey) {
  const base = midpoint(metric.value);
  const hits = scoreMetric(articles, metricKey);
  const drift = Math.min(0.12, hits * 0.025);
  return [4, 3, 2, 1, 0].map((step) => ({
    label: step === 0 ? "当前" : `${step * 30}天前`,
    value: Math.max(0, Math.round(base * (1 - drift * (4 - step) / 4))),
  })).reverse();
}

function enrichMetric(metric, articles, metricKey) {
  const hits = scoreMetric(articles, metricKey);
  const note = hits > 0
    ? `${metric.note} 过去7天自动抓取到 ${hits} 个相关新闻信号。`
    : `${metric.note} 过去7天未抓取到明显相关新闻信号。`;
  return { ...metric, note };
}

function responseText(payload) {
  if (typeof payload.output_text === "string") return payload.output_text;
  return (payload.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || "")
    .join("\n")
    .trim();
}

async function aiExtract(node, articles) {
  if (!process.env.OPENAI_API_KEY || articles.length === 0) return null;

  const evidenceText = articles.slice(0, 8).map((article, index) =>
    `${index + 1}. ${article.title}\nURL: ${article.url}\nDate: ${article.date || "unknown"}`
  ).join("\n\n");

  const prompt = `
你是半导体产业链研究助理。请只根据下面的公开新闻标题和链接，判断它们对产业链节点的影响。
节点：${node.product}
公司：${node.companies}

新闻证据：
${evidenceText}

请输出严格 JSON，不要 Markdown：
{
  "signal": "一句中文摘要",
  "confidence": "低|低-中|中|高",
  "priceNote": "定价相关判断，无法判断则写未见明确价格信号",
  "inventoryNote": "库存相关判断，无法判断则写未见明确库存信号",
  "capacityNote": "产能相关判断，无法判断则写未见明确产能信号"
}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt,
      }),
    });
    if (!response.ok) return null;
    const text = responseText(await response.json());
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const nodes = [];
for (const node of seed.nodes) {
  const articles = await fetchArticles(node.query);
  const evidence = articles.slice(0, 5).map(({ title, url, source, date }) => ({
    title,
    url,
    source,
    date,
    credibility: credibilityForUrl(url),
  }));
  const ai = await aiExtract(node, articles);
  const priceMetric = enrichMetric(node.metrics.price, articles, "price");
  const inventoryMetric = enrichMetric(node.metrics.inventory, articles, "inventory");
  const capacityMetric = enrichMetric(node.metrics.capacity, articles, "capacity");
  nodes.push({
    ...node,
    priority: priorityFromEvidence(node.priority, evidence.length),
    confidence: ai?.confidence || confidenceFromEvidence(evidence.length),
    signal: ai?.signal || node.signal,
    alerts: alertsForNode(node, articles),
    evidence,
    history: {
      price: historyForMetric(node.metrics.price, articles, "price"),
      inventory: historyForMetric(node.metrics.inventory, articles, "inventory"),
      capacity: historyForMetric(node.metrics.capacity, articles, "capacity"),
    },
    metrics: {
      price: { ...priceMetric, note: ai?.priceNote || priceMetric.note },
      inventory: { ...inventoryMetric, note: ai?.inventoryNote || inventoryMetric.note },
      capacity: { ...capacityMetric, note: ai?.capacityNote || capacityMetric.note },
    },
  });
}

await mkdir("data", { recursive: true });
await writeFile("data/latest.json", JSON.stringify({
  updatedAt: now.toISOString().slice(0, 10),
  mode: "auto-public-sources",
  sourceNote: process.env.OPENAI_API_KEY
    ? "GitHub Actions 每日自动更新；公开新闻证据 + AI 摘要 + 种子量化口径"
    : "GitHub Actions 每日自动更新；公开新闻证据 + 关键词规则 + 种子量化口径",
  nodes,
}, null, 2));
