const stages = [
  {
    id: "upstream",
    name: "上游材料与设备",
    note: "硅片、光刻胶、电子气体、光刻/刻蚀/沉积设备",
  },
  {
    id: "design",
    name: "芯片设计与IP",
    note: "GPU、CPU、AI ASIC、存储控制器、EDA/IP",
  },
  {
    id: "wafer",
    name: "晶圆制造",
    note: "先进制程、成熟制程、HBM逻辑底座、代工产能",
  },
  {
    id: "memory",
    name: "存储制造",
    note: "DRAM、NAND、HBM、企业级SSD",
  },
  {
    id: "packaging",
    name: "先进封装与测试",
    note: "CoWoS、2.5D/3D封装、测试插座、载板",
  },
  {
    id: "module",
    name: "光模块与服务器",
    note: "800G/1.6T光模块、交换机、AI服务器整机",
  },
  {
    id: "demand",
    name: "下游需求",
    note: "云厂商、手机、PC、汽车、工业与边缘AI",
  },
];

const nodes = [
  {
    id: "gpu-ai",
    stage: "design",
    product: "AI GPU / 加速卡",
    companies: "NVIDIA、AMD、云厂商自研芯片",
    regions: ["美国", "台湾"],
    priority: "hot",
    signal: "新产品节奏与交付周期决定上游封装、HBM、服务器需求。",
    metrics: { price: "议价能力强", inventory: "渠道紧", capacity: "受封装/HBM约束" },
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
    metrics: { price: "上行", inventory: "偏紧", capacity: "扩产中" },
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
    metrics: { price: "高位", inventory: "排队", capacity: "快速扩张" },
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
    metrics: { price: "分化", inventory: "看客户拉货", capacity: "新增产线" },
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
    metrics: { price: "周期波动", inventory: "需观察", capacity: "谨慎投放" },
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
    metrics: { price: "温和上行", inventory: "改善", capacity: "向HBM倾斜" },
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
    metrics: { price: "稳中偏强", inventory: "按订单", capacity: "地区扩建" },
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
    metrics: { price: "滞后调整", inventory: "相对稳定", capacity: "长期规划" },
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
    metrics: { price: "设备单价高", inventory: "订单积压", capacity: "交付周期长" },
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
    metrics: { price: "传导较慢", inventory: "季节性", capacity: "弹性较高" },
    questions: ["整机库存是否回到正常？", "AI PC是否带来换机？", "手机存储容量是否提升？"],
  },
];

const statusText = {
  hot: "高优先级",
  watch: "观察",
  steady: "稳定跟踪",
};

const metricNames = {
  price: "定价",
  inventory: "库存",
  capacity: "产能",
};

const state = {
  stage: "all",
  metric: "all",
  region: "all",
  search: "",
  selected: nodes[0].id,
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
  detailTitle: document.querySelector("#detailTitle"),
  detailBody: document.querySelector("#detailBody"),
  watchlistItems: document.querySelector("#watchlistItems"),
  summaryMode: document.querySelector("#summaryMode"),
  exportCsv: document.querySelector("#exportCsv"),
};

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
    const haystack = [
      node.product,
      node.companies,
      node.signal,
      ...node.regions,
      stages.find((stage) => stage.id === node.stage)?.name,
    ]
      .join(" ")
      .toLowerCase();
    return stageMatch && regionMatch && metricMatch && haystack.includes(query);
  });
}

function renderChainMap() {
  els.chainMap.innerHTML = stages
    .map((stage) => {
      const count = nodes.filter((node) => node.stage === stage.id).length;
      const active = state.stage === stage.id ? " active" : "";
      return `
        <button class="stage-button${active}" type="button" data-stage="${stage.id}">
          <strong>${stage.name}</strong>
          <span>${stage.note} · ${count} 个节点</span>
        </button>
      `;
    })
    .join("");
}

function metricMarkup(node) {
  return Object.entries(metricNames)
    .map(([key, label]) => {
      const deemphasize = state.metric !== "all" && state.metric !== key ? " tag" : "";
      return `
        <div class="metric${deemphasize}">
          <span>${label}</span>
          <strong>${node.metrics[key]}</strong>
        </div>
      `;
    })
    .join("");
}

function renderNodes() {
  const list = filteredNodes();
  els.resultCount.textContent = `${list.length} 个结果`;
  els.nodeCount.textContent = nodes.length;
  els.hotCount.textContent = nodes.filter((node) => node.priority === "hot").length;

  if (!list.some((node) => node.id === state.selected)) {
    state.selected = list[0]?.id || "";
  }

  els.nodeGrid.innerHTML =
    list
      .map((node) => {
        const stage = stages.find((item) => item.id === node.stage);
        const active = state.selected === node.id ? " active" : "";
        return `
          <button class="node-card${active}" type="button" data-node="${node.id}">
            <div class="card-top">
              <span class="pill">${stage.name}</span>
              <span class="status ${node.priority}">${statusText[node.priority]}</span>
            </div>
            <h3>${node.product}</h3>
            <p>${node.signal}</p>
            <div class="metrics">${metricMarkup(node)}</div>
            <div class="tags">
              ${node.regions.map((region) => `<span class="tag">${region}</span>`).join("")}
            </div>
          </button>
        `;
      })
      .join("") || '<p class="empty">没有匹配的节点。换一个筛选条件试试。</p>';

  renderDetail();
}

function renderDetail() {
  const node = nodes.find((item) => item.id === state.selected);
  if (!node) {
    els.detailTitle.textContent = "没有选中节点";
    els.detailBody.innerHTML = "<p>当前筛选条件下没有可显示的产业链节点。</p>";
    return;
  }

  const stage = stages.find((item) => item.id === node.stage);
  els.detailTitle.textContent = node.product;
  els.detailBody.innerHTML = `
    <p><strong>所属环节：</strong>${stage.name}</p>
    <p><strong>代表公司：</strong>${node.companies}</p>
    <p><strong>覆盖地区：</strong>${node.regions.join("、")}</p>
    <p>${node.signal}</p>
    <div class="detail-table">
      <div><span>定价</span><strong>${node.metrics.price}</strong></div>
      <div><span>库存</span><strong>${node.metrics.inventory}</strong></div>
      <div><span>产能</span><strong>${node.metrics.capacity}</strong></div>
    </div>
    <h3>下一步要问的问题</h3>
    <ul class="questions">
      ${node.questions.map((question) => `<li>${question}</li>`).join("")}
    </ul>
  `;
}

function renderWatchlist() {
  const ordered = [...nodes].sort((a, b) => {
    const score = { hot: 0, watch: 1, steady: 2 };
    return score[a.priority] - score[b.priority];
  });

  els.watchlistItems.innerHTML = ordered
    .slice(0, 7)
    .map((node) => `<li><strong>${node.product}</strong><br><span>${node.signal}</span></li>`)
    .join("");
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
    ["环节", "产品/工序", "代表公司", "地区", "优先级", "定价", "库存", "产能", "观察信号"],
    ...filteredNodes().map((node) => {
      const stage = stages.find((item) => item.id === node.stage);
      return [
        stage.name,
        node.product,
        node.companies,
        node.regions.join("/"),
        statusText[node.priority],
        node.metrics.price,
        node.metrics.inventory,
        node.metrics.capacity,
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

els.summaryMode.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("summary");
  els.summaryMode.setAttribute("aria-pressed", String(enabled));
});

els.exportCsv.addEventListener("click", exportCurrentCsv);

buildOptions();
renderChainMap();
renderNodes();
renderWatchlist();
