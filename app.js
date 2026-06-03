const stages = [
  { id: "upstream", name: "上游材料与设备", note: "硅片、光刻胶、电子气体、光刻/刻蚀/沉积设备" },
  { id: "design", name: "芯片设计与IP", note: "GPU、CPU、AI ASIC、存储控制器、EDA/IP" },
  { id: "wafer", name: "晶圆制造", note: "先进制程、成熟制程、HBM逻辑底座、代工产能" },
  { id: "memory", name: "存储制造", note: "DRAM、NAND、HBM、企业级SSD" },
  { id: "packaging", name: "先进封装与测试", note: "CoWoS、2.5D/3D封装、测试插座、载板" },
  { id: "module", name: "光模块与服务器", note: "800G/1.6T光模块、交换机、AI服务器整机" },
  { id: "demand", name: "下游需求", note: "云厂商、手机、PC、汽车、工业与边缘AI" },
];

let nodes = [
  {
    id: "gpu-ai",
    stage: "design",
    product: "AI GPU / 加速卡",
    companies: "NVIDIA、AMD、云厂商自研芯片",
    regions: ["美国", "台湾"],
    priority: "hot",
    signal: "新产品节奏与交付周期决定上游封装、HBM、服务器需求。",
    metrics: {
      price: { value: "100-120", unit: "价格指数", change: "+8% QoQ", trend: "up", note: "以2025年均值=100估算，反映高端加速卡议价能力。" },
      inventory: { value: "4-8", unit: "周", change: "-2周 QoQ", trend: "down", note: "渠道与系统厂商可见库存周数，越低越紧。" },
      capacity: { value: "70-85", unit: "%供给受限", change: "+5pct QoQ", trend: "up", note: "受HBM、CoWoS和板卡交付限制的订单比例估算。" },
    },
    confidence: "中",
    questions: ["新品是否提高HBM用量？", "主要云厂商订单是否提前或延后？", "板卡交期是否变化？"],
  },
  {
    id: "hbm",
    stage: "memory",
    product: "HBM 高带宽存储",
    companies: "SK hynix、Samsung、Micron",
    regions: ["韩国", "美国", "台湾", "日本"],
    priority: "hot",
    signal: "AI服务器最敏感的存储节点，关注扩产、良率、长期合约价格。",
    metrics: {
      price: { value: "115-140", unit: "合约价指数", change: "+12% QoQ", trend: "up", note: "以2025年均值=100估算，HBM3E/HBM4溢价仍高。" },
      inventory: { value: "2-4", unit: "周", change: "-1周 QoQ", trend: "down", note: "大客户长期锁单后，现货可得库存偏低。" },
      capacity: { value: "35-50", unit: "% YoY", change: "+40% YoY", trend: "up", note: "主要厂商扩产斜率估算，需继续核实良率。" },
    },
    confidence: "中",
    questions: ["HBM3E/HBM4切换是否顺利？", "先进封装产能是否匹配？", "客户预付款或长期合约变化？"],
  },
  {
    id: "cowos",
    stage: "packaging",
    product: "CoWoS / 2.5D先进封装",
    companies: "TSMC、ASE、Amkor、Ibiden",
    regions: ["台湾", "日本", "美国"],
    priority: "hot",
    signal: "AI芯片放量的瓶颈之一，产能开出会影响GPU交付。",
    metrics: {
      price: { value: "110-130", unit: "代工价指数", change: "+6% QoQ", trend: "up", note: "以2025年均值=100估算，瓶颈工序议价能力强。" },
      inventory: { value: "12-24", unit: "周排队", change: "-4周 QoQ", trend: "down", note: "客户排队周期，下降代表瓶颈有所缓解。" },
      capacity: { value: "60-80", unit: "千片/月", change: "+25% QoQ", trend: "up", note: "等效先进封装月产能估算，适合后续替换为公司披露值。" },
    },
    confidence: "中",
    questions: ["月产能是否按计划释放？", "载板和中介层是否短缺？", "客户排产优先级是否变化？"],
  },
  {
    id: "optical",
    stage: "module",
    product: "800G / 1.6T 光模块",
    companies: "Coherent、Lumentum、中际旭创、新易盛",
    regions: ["美国", "中国大陆", "日本"],
    priority: "watch",
    signal: "AI集群互联带动高速光模块需求，关注产能投放和ASP变化。",
    metrics: {
      price: { value: "$450-900", unit: "ASP/只", change: "-8% QoQ", trend: "down", note: "800G产品价格区间估算，1.6T早期产品另看溢价。" },
      inventory: { value: "6-10", unit: "周", change: "+1周 QoQ", trend: "up", note: "客户拉货节奏影响明显，需按大客户拆分。" },
      capacity: { value: "20-35", unit: "% YoY", change: "+28% YoY", trend: "up", note: "高速光模块产线扩张速度估算。" },
    },
    confidence: "低",
    questions: ["1.6T切换时间点？", "硅光方案是否放量？", "大客户资本开支是否上修？"],
  },
  {
    id: "nand",
    stage: "memory",
    product: "NAND / 企业级SSD",
    companies: "Samsung、Kioxia、Western Digital、Micron、长江存储",
    regions: ["日本", "美国", "中国大陆", "韩国"],
    priority: "watch",
    signal: "价格周期与库存去化有关，企业级SSD受AI服务器和云需求拉动。",
    metrics: {
      price: { value: "95-110", unit: "NAND指数", change: "+4% QoQ", trend: "up", note: "以2025年均值=100估算，企业级SSD强于消费级。" },
      inventory: { value: "8-14", unit: "周", change: "-3周 QoQ", trend: "down", note: "渠道与原厂库存周数估算，低于12周通常更健康。" },
      capacity: { value: "-5~+5", unit: "% Wafer YoY", change: "持平", trend: "flat", note: "原厂仍偏谨慎，新增晶圆投片有限。" },
    },
    confidence: "中",
    questions: ["原厂是否继续控产？", "企业级SSD报价是否强于消费级？", "渠道库存周数是否下降？"],
  },
  {
    id: "dram",
    stage: "memory",
    product: "通用DRAM",
    companies: "Samsung、SK hynix、Micron、南亚科",
    regions: ["美国", "台湾", "日本", "韩国"],
    priority: "watch",
    signal: "PC、手机、服务器共同影响价格，需拆分DDR5、LPDDR、服务器DRAM。",
    metrics: {
      price: { value: "105-118", unit: "DRAM指数", change: "+7% QoQ", trend: "up", note: "以2025年均值=100估算，DDR5与服务器DRAM更强。" },
      inventory: { value: "7-12", unit: "周", change: "-2周 QoQ", trend: "down", note: "库存改善，但终端需求不同步。" },
      capacity: { value: "10-20", unit: "%转向HBM", change: "+4pct QoQ", trend: "up", note: "部分先进产能向HBM倾斜，压缩通用DRAM供给弹性。" },
    },
    confidence: "中",
    questions: ["DDR5合约价是否继续上涨？", "手机库存是否健康？", "产能是否从通用DRAM转向HBM？"],
  },
  {
    id: "wafer-foundry",
    stage: "wafer",
    product: "先进制程代工",
    companies: "TSMC、Samsung Foundry、Intel Foundry",
    regions: ["台湾", "美国", "日本"],
    priority: "hot",
    signal: "先进制程产能、报价和客户排队决定高端芯片供给。",
    metrics: {
      price: { value: "$16k-22k", unit: "每片晶圆", change: "+3% QoQ", trend: "up", note: "先进节点等效晶圆报价区间估算，节点和客户差异很大。" },
      inventory: { value: "80-95", unit: "%稼动率", change: "+5pct QoQ", trend: "up", note: "用稼动率替代库存观察，越接近满载越紧。" },
      capacity: { value: "5-12", unit: "% YoY", change: "+8% YoY", trend: "up", note: "先进制程可用产能增速估算，海外厂进度需单独跟踪。" },
    },
    confidence: "中",
    questions: ["3nm/2nm客户排产是否满载？", "海外晶圆厂进度是否延后？", "AI客户是否挤占消费电子产能？"],
  },
  {
    id: "materials",
    stage: "upstream",
    product: "硅片、光刻胶、电子气体",
    companies: "信越、SUMCO、JSR、TOK、Entegris、华特气体",
    regions: ["日本", "美国", "中国大陆", "台湾"],
    priority: "steady",
    signal: "上游材料决定成本和供应安全，价格通常滞后于晶圆厂稼动率。",
    metrics: {
      price: { value: "98-105", unit: "材料指数", change: "+1% QoQ", trend: "flat", note: "以2025年均值=100估算，上游价格通常滞后。" },
      inventory: { value: "10-16", unit: "周", change: "持平", trend: "flat", note: "关键材料安全库存一般高于下游成品。" },
      capacity: { value: "3-8", unit: "% YoY", change: "+5% YoY", trend: "up", note: "长期扩产为主，短期弹性较低。" },
    },
    confidence: "低",
    questions: ["晶圆厂稼动率是否回升？", "关键材料是否国产替代？", "出口管制是否影响供应？"],
  },
  {
    id: "equipment",
    stage: "upstream",
    product: "半导体设备",
    companies: "ASML、Applied Materials、Lam Research、TEL、北方华创",
    regions: ["美国", "日本", "中国大陆", "欧洲", "台湾"],
    priority: "watch",
    signal: "资本开支和出口管制直接影响未来产能开出。",
    metrics: {
      price: { value: "100-108", unit: "设备价指数", change: "+2% QoQ", trend: "up", note: "高端设备价格刚性较强，更多看订单和交期。" },
      inventory: { value: "6-12", unit: "月交期", change: "-1月 QoQ", trend: "down", note: "以交付周期替代库存观察，交期缩短代表供给缓解。" },
      capacity: { value: "$95-110B", unit: "全球WFE", change: "+8% YoY", trend: "up", note: "晶圆制造设备支出区间估算，反映未来产能投放。" },
    },
    confidence: "低",
    questions: ["晶圆厂资本开支是否上修？", "关键设备交期是否缩短？", "管制清单是否变化？"],
  },
  {
    id: "smartphone",
    stage: "demand",
    product: "手机与PC需求",
    companies: "Apple、联想、Dell、HP、华为、小米",
    regions: ["美国", "中国大陆", "台湾", "日本"],
    priority: "steady",
    signal: "消费电子决定通用DRAM/NAND和成熟制程复苏力度。",
    metrics: {
      price: { value: "0-3", unit: "%BOM压力", change: "+1pct QoQ", trend: "flat", note: "整机端对存储涨价的成本压力估算。" },
      inventory: { value: "6-9", unit: "周", change: "-1周 QoQ", trend: "down", note: "整机与渠道库存周数估算，接近正常区间。" },
      capacity: { value: "0-5", unit: "%出货YoY", change: "+3% YoY", trend: "up", note: "手机与PC合计需求增速估算，AI PC需单独观察。" },
    },
    confidence: "低",
    questions: ["整机库存是否回到正常？", "AI PC是否带来换机？", "手机存储容量是否提升？"],
  },
];

let datasetMeta = {
  updatedAt: "2026-05-31",
  mode: "static-template",
  sourceNote: "模板示例，非实时行情",
};

let stockData = {
  updatedAt: "",
  sourceNote: "等待行情更新",
  stocks: [],
};

const statusText = { hot: "高优先级", watch: "观察", steady: "稳定跟踪" };
const metricNames = { price: "定价", inventory: "库存", capacity: "产能" };
const trendText = { up: "上行", down: "下行", flat: "持平" };

const state = {
  stage: "all",
  metric: "all",
  region: "all",
  search: "",
  selected: nodes[0].id,
  pinnedOnly: false,
  pinned: JSON.parse(localStorage.getItem("semiconductor-pinned-nodes") || "[]"),
};

const els = {
  stageFilter: document.querySelector("#stageFilter"),
  regionFilter: document.querySelector("#regionFilter"),
  metricFilter: document.querySelector("#metricFilter"),
  searchInput: document.querySelector("#searchInput"),
  chainMap: document.querySelector("#chainMap"),
  nodeGrid: document.querySelector("#nodeGrid"),
  resultCount: document.querySelector("#resultCount"),
  nodeCount: document.querySelector("#nodeCount"),
  hotCount: document.querySelector("#hotCount"),
  alertCount: document.querySelector("#alertCount"),
  dataUpdated: document.querySelector("#dataUpdated"),
  dataSourceNote: document.querySelector("#dataSourceNote"),
  detailTitle: document.querySelector("#detailTitle"),
  detailBody: document.querySelector("#detailBody"),
  watchlistItems: document.querySelector("#watchlistItems"),
  dailyBriefing: document.querySelector("#dailyBriefing"),
  briefingBadge: document.querySelector("#briefingBadge"),
  driverTags: document.querySelector("#driverTags"),
  alertList: document.querySelector("#alertList"),
  sourceManagerGrid: document.querySelector("#sourceManagerGrid"),
  stocksGrid: document.querySelector("#stocksGrid"),
  stocksUpdated: document.querySelector("#stocksUpdated"),
  viewTabs: document.querySelectorAll("[data-view-tab]"),
  viewSections: document.querySelectorAll("[data-view]"),
  pinnedOnly: document.querySelector("#pinnedOnly"),
  summaryMode: document.querySelector("#summaryMode"),
  exportCsv: document.querySelector("#exportCsv"),
};

const defaultDrivers = {
  "gpu-ai": ["新品迭代", "云厂商资本开支", "HBM供给", "先进封装瓶颈"],
  hbm: ["AI服务器需求", "原厂扩产", "良率爬坡", "长期合约"],
  cowos: ["先进封装瓶颈", "中介层/载板供给", "大客户排产"],
  optical: ["AI集群互联", "800G到1.6T切换", "云厂商拉货"],
  nand: ["原厂控产", "企业级SSD需求", "渠道库存去化"],
  dram: ["DDR5升级", "服务器需求", "产能转向HBM"],
  "wafer-foundry": ["先进节点满载", "海外厂进度", "AI挤占产能"],
  materials: ["晶圆厂稼动率", "材料国产替代", "出口管制"],
  equipment: ["晶圆厂资本开支", "设备交期", "出口管制"],
  smartphone: ["终端库存", "AI PC换机", "手机容量提升"],
};

const defaultInfluence = {
  "gpu-ai": ["hbm", "cowos", "optical"],
  hbm: ["gpu-ai", "cowos", "dram"],
  cowos: ["gpu-ai", "wafer-foundry"],
  optical: ["gpu-ai", "demand"],
  nand: ["smartphone"],
  dram: ["hbm", "smartphone"],
  "wafer-foundry": ["gpu-ai", "cowos", "materials", "equipment"],
  materials: ["wafer-foundry"],
  equipment: ["wafer-foundry"],
  smartphone: ["dram", "nand", "wafer-foundry"],
};

function getDrivers(node) {
  return node.drivers || defaultDrivers[node.id] || ["需求变化", "供给变化", "价格周期"];
}

function getInfluence(node) {
  return node.influence || defaultInfluence[node.id] || [];
}

function getAlerts(node) {
  if (Array.isArray(node.alerts) && node.alerts.length) return node.alerts;
  const evidenceCount = node.evidence?.length || 0;
  if (evidenceCount >= 5) return [{ level: "red", label: "新信号密集", text: `过去7天抓取到 ${evidenceCount} 条相关证据。` }];
  if (evidenceCount >= 2) return [{ level: "yellow", label: "需要观察", text: `过去7天抓取到 ${evidenceCount} 条相关证据。` }];
  return [{ level: "green", label: "暂无明显新增", text: "过去7天公开来源信号较少。" }];
}

function metricMidpoint(value) {
  const nums = String(value).match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
  if (!nums.length) return 50;
  if (nums.length === 1) return nums[0];
  return (nums[0] + nums[1]) / 2;
}

function getHistory(node, metricKey) {
  if (node.history?.[metricKey]?.length) return node.history[metricKey];
  const base = metricMidpoint(node.metrics[metricKey].value);
  return [-3, -2, -1, 0].map((offset, index) => ({
    label: `${90 - index * 30}天前`,
    value: Math.max(0, Math.round(base * (1 + offset * 0.025))),
  })).concat([{ label: "当前", value: Math.max(0, Math.round(base)) }]);
}

function isPinned(nodeId) {
  return state.pinned.includes(nodeId);
}

function savePinned() {
  localStorage.setItem("semiconductor-pinned-nodes", JSON.stringify(state.pinned));
}

function setView(view) {
  els.viewTabs.forEach((tab) => {
    const active = tab.dataset.viewTab === view;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });

  els.viewSections.forEach((section) => {
    section.classList.toggle("active", section.dataset.view === view);
  });

  localStorage.setItem("semiconductor-active-view", view);
}

function uniqueRegions() {
  return [...new Set(nodes.flatMap((node) => node.regions))].sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function buildOptions() {
  els.stageFilter.innerHTML = [
    '<option value="all">全部环节</option>',
    ...stages.map((stage) => `<option value="${stage.id}">${stage.name}</option>`),
  ].join("");

  els.regionFilter.innerHTML = [
    '<option value="all">全部地区</option>',
    ...uniqueRegions().map((region) => `<option value="${region}">${region}</option>`),
  ].join("");
}

function filteredNodes() {
  const query = state.search.trim().toLowerCase();
  return nodes.filter((node) => {
    const stageMatch = state.stage === "all" || node.stage === state.stage;
    const regionMatch = state.region === "all" || node.regions.includes(state.region);
    const metricMatch = state.metric === "all" || Boolean(node.metrics[state.metric]);
    const pinnedMatch = !state.pinnedOnly || isPinned(node.id);
    const haystack = [
      node.product,
      node.companies,
      node.signal,
      node.confidence,
      ...(node.query ? [node.query] : []),
      ...getDrivers(node),
      ...node.regions,
      ...Object.values(node.metrics).flatMap((metric) => [metric.value, metric.unit, metric.change, metric.note]),
      stages.find((stage) => stage.id === node.stage)?.name,
    ].join(" ").toLowerCase();
    return stageMatch && regionMatch && metricMatch && pinnedMatch && haystack.includes(query);
  });
}

function renderChainMap() {
  els.chainMap.innerHTML = stages.map((stage) => {
    const count = nodes.filter((node) => node.stage === stage.id).length;
    const active = state.stage === stage.id ? " active" : "";
    return `
      <button class="stage-button${active}" type="button" data-stage="${stage.id}">
        <strong>${stage.name}</strong>
        <span>${stage.note} · ${count} 个节点</span>
      </button>
    `;
  }).join("");
}

function metricMarkup(node) {
  return Object.entries(metricNames).map(([key, label]) => {
    const metric = node.metrics[key];
    const deemphasize = state.metric !== "all" && state.metric !== key ? " muted-metric" : "";
    return `
      <div class="metric trend-${metric.trend}${deemphasize}">
        <span>${label}</span>
        <strong>${metric.value}</strong>
        <small>${metric.unit} · ${metric.change}</small>
      </div>
    `;
  }).join("");
}

function renderNodes() {
  const list = filteredNodes();
  els.resultCount.textContent = `${list.length} 个结果`;
  els.nodeCount.textContent = nodes.length;
  els.hotCount.textContent = nodes.filter((node) => node.priority === "hot").length;
  els.alertCount.textContent = nodes.reduce((sum, node) => sum + getAlerts(node).filter((alert) => alert.level !== "green").length, 0);
  if (els.dataUpdated) els.dataUpdated.textContent = datasetMeta.updatedAt || "未知";
  if (els.dataSourceNote) els.dataSourceNote.textContent = datasetMeta.sourceNote || "自动更新数据";
  if (els.pinnedOnly) els.pinnedOnly.setAttribute("aria-pressed", String(state.pinnedOnly));

  if (!list.some((node) => node.id === state.selected)) {
    state.selected = list[0]?.id || "";
  }

  els.nodeGrid.innerHTML = list.map((node) => {
    const stage = stages.find((item) => item.id === node.stage);
    const active = state.selected === node.id ? " active" : "";
    return `
      <button class="node-card${active}" type="button" data-node="${node.id}">
        <div class="card-top">
          <span class="pill">${stage.name}</span>
          <span class="status ${node.priority}">${statusText[node.priority]}</span>
        </div>
        <span class="pin-indicator ${isPinned(node.id) ? "pinned" : ""}">${isPinned(node.id) ? "已关注" : "未关注"}</span>
        <h3>${node.product}</h3>
        <p>${node.signal}</p>
        <div class="metrics">${metricMarkup(node)}</div>
        <div class="driver-tags compact">
          ${getDrivers(node).slice(0, 3).map((driver) => `<span>${driver}</span>`).join("")}
        </div>
        <div class="card-foot">
          <span class="tag">置信度：${node.confidence}</span>
          ${node.regions.map((region) => `<span class="tag">${region}</span>`).join("")}
        </div>
      </button>
    `;
  }).join("") || '<p class="empty">没有匹配的节点。换一个筛选条件试试。</p>';

  renderDetail();
  renderBriefing();
  renderAlerts();
  renderSourceManager();
}

function renderDetail() {
  const node = nodes.find((item) => item.id === state.selected);
  if (!node) {
    els.detailTitle.textContent = "没有选中节点";
    els.detailBody.innerHTML = "<p>当前筛选条件下没有可显示的产业链节点。</p>";
    return;
  }

  const stage = stages.find((item) => item.id === node.stage);
  const influenced = getInfluence(node)
    .map((id) => nodes.find((item) => item.id === id))
    .filter(Boolean);
  els.detailTitle.textContent = node.product;
  els.detailBody.innerHTML = `
    <button class="small-button pin-toggle" type="button" data-pin="${node.id}" aria-pressed="${isPinned(node.id)}">
      ${isPinned(node.id) ? "取消关注" : "加入关注清单"}
    </button>
    <p><strong>所属环节：</strong>${stage.name}</p>
    <p><strong>代表公司：</strong>${node.companies}</p>
    <p><strong>覆盖地区：</strong>${node.regions.join("、")}</p>
    <p><strong>数据口径：</strong>当前为研究模板中的区间估算，用于展示追踪方法；接入真实数据源后应替换为来源日期、数值和链接。</p>
    <h3>为什么变化</h3>
    <div class="driver-tags">
      ${getDrivers(node).map((driver) => `<span>${driver}</span>`).join("")}
    </div>
    ${node.evidence?.length ? `
      <h3>自动抓取证据</h3>
      <ul class="questions evidence-list">
        ${node.evidence.map((item) => `<li><a href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a><br><span>${item.source || "公开来源"} · ${item.date || ""} · ${item.credibility || "公开来源"}</span></li>`).join("")}
      </ul>
    ` : ""}
    <div class="detail-table quantitative">
      ${Object.entries(metricNames).map(([key, label]) => {
        const metric = node.metrics[key];
        return `
          <div class="trend-${metric.trend}">
            <span>${label}</span>
            <strong>${metric.value}</strong>
            <small>${metric.unit}</small>
            <b>${metric.change} · ${trendText[metric.trend]}</b>
            <p>${metric.note}</p>
          </div>
        `;
      }).join("")}
    </div>
    <h3>90天趋势</h3>
    <div class="trend-grid">
      ${Object.entries(metricNames).map(([key, label]) => renderTrend(label, getHistory(node, key))).join("")}
    </div>
    <h3>影响链条</h3>
    <div class="influence-chain">
      <strong>${node.product}</strong>
      ${influenced.length ? influenced.map((item) => `<span>→</span><button type="button" data-node="${item.id}">${item.product}</button>`).join("") : "<span>暂无下游映射</span>"}
    </div>
    <h3>下一步要问的问题</h3>
    <ul class="questions">
      ${node.questions.map((question) => `<li>${question}</li>`).join("")}
    </ul>
  `;
}

function renderTrend(label, history) {
  const max = Math.max(...history.map((item) => item.value), 1);
  return `
    <div class="trend-card">
      <strong>${label}</strong>
      <div class="spark-bars">
        ${history.map((item) => `<span style="height:${Math.max(12, Math.round((item.value / max) * 64))}px" title="${item.label}: ${item.value}"></span>`).join("")}
      </div>
      <small>${history[0].value} → ${history[history.length - 1].value}</small>
    </div>
  `;
}

function renderWatchlist() {
  const ordered = [...nodes].sort((a, b) => {
    const score = { hot: 0, watch: 1, steady: 2 };
    return score[a.priority] - score[b.priority];
  });

  els.watchlistItems.innerHTML = ordered.slice(0, 7).map((node) => {
    const price = node.metrics.price;
    const capacity = node.metrics.capacity;
    return `<li><strong>${node.product}</strong><br><span>价格 ${price.value}（${price.change}）；产能 ${capacity.value}（${capacity.change}）</span></li>`;
  }).join("");
}

function renderBriefing() {
  if (!els.dailyBriefing) return;
  const pinned = nodes.filter((node) => isPinned(node.id));
  const candidates = (pinned.length ? pinned : nodes).sort((a, b) => {
    const score = { hot: 0, watch: 1, steady: 2 };
    return score[a.priority] - score[b.priority] || (b.evidence?.length || 0) - (a.evidence?.length || 0);
  });
  const top = candidates.slice(0, 3);
  const names = top.map((node) => node.product).join("、");
  const evidenceTotal = top.reduce((sum, node) => sum + (node.evidence?.length || 0), 0);
  els.briefingBadge.textContent = pinned.length ? `关注清单 ${pinned.length}` : "全局简报";
  els.dailyBriefing.textContent = `今日建议优先看 ${names || "暂无节点"}。重点判断价格、库存、产能三类变化是否互相印证；当前重点节点过去7天共有 ${evidenceTotal} 条公开证据进入看板。`;

  const drivers = [...new Set(top.flatMap(getDrivers))].slice(0, 8);
  els.driverTags.innerHTML = drivers.map((driver) => `<span>${driver}</span>`).join("");
}

function renderAlerts() {
  if (!els.alertList) return;
  const rows = nodes.flatMap((node) => getAlerts(node).map((alert) => ({ node, alert })))
    .sort((a, b) => {
      const score = { red: 0, yellow: 1, green: 2 };
      return score[a.alert.level] - score[b.alert.level];
    })
    .slice(0, 8);

  els.alertList.innerHTML = rows.map(({ node, alert }) => `
    <button type="button" data-node="${node.id}" class="alert-item ${alert.level}">
      <strong>${alert.label}</strong>
      <span>${node.product}</span>
      <small>${alert.text}</small>
    </button>
  `).join("");
}

function credibilityForEvidence(item) {
  return item.credibility || "公开来源";
}

function renderSourceManager() {
  if (!els.sourceManagerGrid) return;
  els.sourceManagerGrid.innerHTML = nodes.map((node) => {
    const evidenceCount = node.evidence?.length || 0;
    const credibility = node.evidence?.length
      ? [...new Set(node.evidence.map(credibilityForEvidence))].join(" / ")
      : "暂无自动证据";
    return `
      <article class="source-row">
        <strong>${node.product}</strong>
        <span>${node.query || "未设置关键词"}</span>
        <small>${evidenceCount} 条证据 · ${credibility}</small>
      </article>
    `;
  }).join("");
}

function updateFiltersFromInputs() {
  state.stage = els.stageFilter.value;
  state.metric = els.metricFilter.value;
  state.region = els.regionFilter.value;
  state.search = els.searchInput.value;
  renderChainMap();
  renderNodes();
}

function selectStage(stageId) {
  state.stage = state.stage === stageId ? "all" : stageId;
  els.stageFilter.value = state.stage;
  renderChainMap();
  renderNodes();
}

function exportCurrentCsv() {
  const rows = [
    ["更新日期", "环节", "产品/工序", "代表公司", "地区", "优先级", "置信度", "定价数值", "定价变化", "定价口径", "库存数值", "库存变化", "库存口径", "产能数值", "产能变化", "产能口径", "观察信号"],
    ...filteredNodes().map((node) => {
      const stage = stages.find((item) => item.id === node.stage);
      return [
        datasetMeta.updatedAt,
        stage.name,
        node.product,
        node.companies,
        node.regions.join("/"),
        statusText[node.priority],
        node.confidence,
        `${node.metrics.price.value} ${node.metrics.price.unit}`,
        node.metrics.price.change,
        node.metrics.price.note,
        `${node.metrics.inventory.value} ${node.metrics.inventory.unit}`,
        node.metrics.inventory.change,
        node.metrics.inventory.note,
        `${node.metrics.capacity.value} ${node.metrics.capacity.unit}`,
        node.metrics.capacity.change,
        node.metrics.capacity.note,
        node.signal,
      ];
    }),
  ];

  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "semiconductor-chain-watchlist.csv";
  link.click();
  URL.revokeObjectURL(url);
}

els.stageFilter.addEventListener("change", updateFiltersFromInputs);
els.regionFilter.addEventListener("change", updateFiltersFromInputs);
els.metricFilter.addEventListener("change", updateFiltersFromInputs);
els.searchInput.addEventListener("input", updateFiltersFromInputs);

els.chainMap.addEventListener("click", (event) => {
  const button = event.target.closest("[data-stage]");
  if (button) selectStage(button.dataset.stage);
});

els.nodeGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-node]");
  if (!button) return;
  state.selected = button.dataset.node;
  renderNodes();
});

els.detailBody.addEventListener("click", (event) => {
  const pinButton = event.target.closest("[data-pin]");
  if (pinButton) {
    const id = pinButton.dataset.pin;
    state.pinned = isPinned(id) ? state.pinned.filter((item) => item !== id) : [...state.pinned, id];
    savePinned();
    renderNodes();
    return;
  }

  const nodeButton = event.target.closest("[data-node]");
  if (nodeButton) {
    state.selected = nodeButton.dataset.node;
    renderNodes();
  }
});

els.alertList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-node]");
  if (!button) return;
  state.selected = button.dataset.node;
  renderNodes();
});

els.stocksGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-node]");
  if (!button || !button.dataset.node) return;
  state.selected = button.dataset.node;
  renderNodes();
});

els.pinnedOnly?.addEventListener("click", () => {
  state.pinnedOnly = !state.pinnedOnly;
  renderNodes();
});

els.viewTabs.forEach((tab) => {
  tab.addEventListener("click", () => setView(tab.dataset.viewTab));
});

els.summaryMode.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("summary");
  els.summaryMode.setAttribute("aria-pressed", String(enabled));
});

els.exportCsv.addEventListener("click", exportCurrentCsv);

async function loadRemoteData() {
  try {
    const response = await fetch("data/latest.json", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    if (!Array.isArray(payload.nodes) || payload.nodes.length === 0) return;
    nodes = payload.nodes;
    datasetMeta = {
      updatedAt: payload.updatedAt || datasetMeta.updatedAt,
      mode: payload.mode || "auto",
      sourceNote: payload.sourceNote || "GitHub Actions 自动更新",
    };
    state.selected = nodes[0]?.id || "";
  } catch (error) {
    console.info("Using embedded fallback data.", error);
  }
}

async function loadStockData() {
  try {
    const response = await fetch("data/stocks.json", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    if (!Array.isArray(payload.stocks)) return;
    stockData = payload;
  } catch (error) {
    console.info("Stock data unavailable.", error);
  }
}

function formatPrice(stock) {
  if (stock.price == null) return "暂无";
  const currency = stock.currency ? `${stock.currency} ` : "";
  return `${currency}${stock.price}`;
}

function formatChange(stock) {
  if (stock.changePercent == null) return "等待更新";
  const sign = stock.changePercent > 0 ? "+" : "";
  return `${sign}${stock.changePercent}%`;
}

function renderStockSparkline(history = []) {
  const closes = history.map((row) => row.close).filter((value) => typeof value === "number");
  if (closes.length < 2) return '<div class="stock-sparkline empty-line">等待K线</div>';
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const spread = max - min || 1;
  const points = closes.map((close, index) => {
    const x = (index / (closes.length - 1)) * 100;
    const y = 34 - ((close - min) / spread) * 30 + 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
  const direction = closes.at(-1) >= closes[0] ? "up" : "down";
  return `
    <svg class="stock-sparkline spark-${direction}" viewBox="0 0 100 38" role="img" aria-label="近60个交易日走势">
      <polyline points="${points}" vector-effect="non-scaling-stroke"></polyline>
    </svg>
  `;
}

function marketGroups(stocks) {
  const order = [
    ["us", "美股"],
    ["jp", "日股"],
    ["cn", "A股"],
    ["tw", "台股"],
    ["other", "其他"],
  ];
  return order.map(([key, label]) => ({
    key,
    label,
    stocks: stocks.filter((stock) => (stock.market || "other") === key),
  })).filter((group) => group.stocks.length);
}

function renderStocks() {
  if (!els.stocksGrid) return;
  els.stocksUpdated.textContent = stockData.updatedAt ? `行情 ${stockData.updatedAt}` : "等待更新";
  if (!stockData.stocks.length) {
    els.stocksGrid.innerHTML = '<p class="empty">暂无行情数据。GitHub Actions 运行后会生成 data/stocks.json。</p>';
    return;
  }

  els.stocksGrid.innerHTML = marketGroups(stockData.stocks).map((group) => `
    <section class="stock-market-group">
      <div class="market-heading">
        <strong>${group.label}</strong>
        <span>${group.stocks.length} 个标的</span>
      </div>
      <div class="stock-market-grid">
        ${group.stocks.map((stock) => {
          const direction = stock.changePercent == null ? "flat" : stock.changePercent > 0 ? "up" : stock.changePercent < 0 ? "down" : "flat";
          const linked = nodes.find((node) => node.id === stock.linkNode || node.stage === stock.linkNode);
          return `
            <button type="button" class="stock-card stock-${direction}" data-node="${linked?.id || ""}">
              <div>
                <strong>${stock.name}</strong>
                <span>${stock.symbol} · ${stock.region}</span>
              </div>
              <b>${formatPrice(stock)}</b>
              <small>${formatChange(stock)} · ${stock.exchange || stock.quoteSource || "公开源"}</small>
              ${renderStockSparkline(stock.history)}
              <em>${linked ? linked.product : "产业链观察"}</em>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `).join("");
}

async function initialize() {
  await loadRemoteData();
  await loadStockData();
  buildOptions();
  renderChainMap();
  renderNodes();
  renderWatchlist();
  renderStocks();
  setView(localStorage.getItem("semiconductor-active-view") || "overview");
}

initialize();
