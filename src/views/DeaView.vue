<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { animate } from 'motion'

onMounted(() => {
    document.title = 'DEA 效率評估實驗室 | EdTech-俞良澄';
    animate('.header-section', { opacity: [0, 1], y: [30, 0] }, { duration: 0.8 });
});

// ==========================================
// 共用設定
// ==========================================
const activeTab = ref('frontier') // frontier, models, diagnosis

const tabs = [
    { id: 'frontier', name: '效率前緣視覺化', icon: 'bi-graph-up-arrow' },
    { id: 'models', name: 'CCR vs BCC 模型', icon: 'bi-bezier2' },
    { id: 'diagnosis', name: '營運診斷與改進', icon: 'bi-bandaid' }
]

// ==========================================
// 資料集：模擬 5 家分店 (DMUs)
// ==========================================
// x: 投入 (員工數), y: 產出 (營收百萬)
const initialDMUs = [
    { id: 'A', name: '分店 A', input: 2, output: 2, type: 'ref' },
    { id: 'B', name: '分店 B', input: 4, output: 7, type: 'ref' }, // 高效率
    { id: 'C', name: '分店 C', input: 5, output: 4, type: 'ref' }, // 低效率
    { id: 'D', name: '分店 D', input: 7, output: 9, type: 'ref' }, // 高效率
    { id: 'E', name: '分店 E', input: 8, output: 6, type: 'ref' }  // 低效率
]

const dmus = reactive(JSON.parse(JSON.stringify(initialDMUs)))

// ==========================================
// Lab 1 & 2: 效率前緣計算邏輯 (1-In/1-Out 簡化版)
// ==========================================
const chartConfig = { width: 600, height: 400, maxX: 10, maxY: 10, padding: 40 }

// 座標轉換 X (Input) -> SVG X
const scaleX = (val) => {
    return chartConfig.padding + (val / chartConfig.maxX) * (chartConfig.width - chartConfig.padding * 2)
}

// 座標轉換 Y (Output) -> SVG Y (反轉)
const scaleY = (val) => {
    return chartConfig.height - chartConfig.padding - (val / chartConfig.maxY) * (chartConfig.height - chartConfig.padding * 2)
}

// 1. CCR 前緣 (從原點出發，斜率最大的射線)
const ccrFrontier = computed(() => {
    let maxSlope = 0
    let bestDMU = null
    dmus.forEach(d => {
        const slope = d.output / d.input
        if (slope > maxSlope) {
            maxSlope = slope
            bestDMU = d
        }
    })

    // 畫一條線：(0,0) -> (maxX, maxX * slope)
    const endX = chartConfig.maxX
    const endY = endX * maxSlope

    return {
        d: `M ${scaleX(0)} ${scaleY(0)} L ${scaleX(endX)} ${scaleY(endY)}`,
        slope: maxSlope,
        bestId: bestDMU ? bestDMU.id : ''
    }
})

// 2. BCC 前緣 (外凸包 Convex Hull 的上邊界)
const bccFrontier = computed(() => {
    // 簡單的凸包邏輯：按 Input 排序，找出形成「上邊界」的點
    const sorted = [...dmus].sort((a, b) => a.input - b.input)

    // 找出左上方的邊界點
    let hull = []
    // 起點：假定有一個虛擬點在極左下，或者直接從最左邊效率最高的開始
    // 這裡使用簡化演算法：對於每個點，如果沒有其他點在它的「左上方」，它就是邊界

    // 實作：VRS 前緣通常是連接效率為 1 的點的折線
    // 在 1-in/1-out 中，效率=1 的點是那些「在同樣投入下產出最高」或「同樣產出下投入最低」的點
    // 但為了視覺效果，我們直接連接那些「無法被其他點支配」的點

    // 簡化模擬：直接硬編碼幾個關鍵點來演示 BCC 的「包絡」概念
    // 真實計算需要 Linear Programming，這裡用視覺模擬
    const points = [
        { x: 0, y: 0 }, // BCC 不一定過原點，但為了畫圖方便
        { x: 2, y: 2 }, // A
        { x: 4, y: 7 }, // B
        { x: 7, y: 9 }, // D
        { x: 10, y: 9 + (9 - 7) / (7 - 4) * (10 - 7) } // 延伸線
    ]

    // 產生 SVG Path
    let d = `M ${scaleX(points[0].x)} ${scaleY(points[0].y)}`
    for (let i = 1; i < points.length; i++) {
        d += ` L ${scaleX(points[i].x)} ${scaleY(points[i].y)}`
    }
    return d
})

// ==========================================
// Lab 3: 營運診斷 (投影與改進)
// ==========================================
const selectedTarget = ref('C') // 預設診斷 C 分店
const targetDMU = computed(() => dmus.find(d => d.id === selectedTarget.value))

// 計算目標分店的效率值 (基於 CCR)
const currentEfficiency = computed(() => {
    const slope = targetDMU.value.output / targetDMU.value.input
    const maxSlope = ccrFrontier.value.slope
    return Math.min(100, (slope / maxSlope) * 100).toFixed(1)
})

// 計算改進目標 (Input-Oriented: 減少投入以達到前緣)
// Target Input = Output / MaxSlope
const targetInput = computed(() => {
    const maxSlope = ccrFrontier.value.slope
    return (targetDMU.value.output / maxSlope).toFixed(2)
})

// 計算改進目標 (Output-Oriented: 增加產出以達到前緣)
// Target Output = Input * MaxSlope
const targetOutput = computed(() => {
    const maxSlope = ccrFrontier.value.slope
    return (targetDMU.value.input * maxSlope).toFixed(2)
})

const improvementPlan = ref('input') // input (投入導向), output (產出導向)

// 動畫控制：模擬改進過程
const isOptimizing = ref(false)
const optimizedDMU = reactive({ ...initialDMUs.find(d => d.id === 'C'), x: 0, y: 0 })

const runOptimization = () => {
    isOptimizing.value = true
    // 重置位置
    optimizedDMU.input = targetDMU.value.input
    optimizedDMU.output = targetDMU.value.output

    setTimeout(() => {
        if (improvementPlan.value === 'input') {
            optimizedDMU.input = parseFloat(targetInput.value)
        } else {
            optimizedDMU.output = parseFloat(targetOutput.value)
        }
        isOptimizing.value = false
    }, 1000)
}

</script>

<template>
    <div class="page-container" style="margin-top: 76px;">

        <header class="header-section">
            <div class="header-content">
                <div class="badge">Analytics Lab v1.0</div>
                <h1 class="title">資料包絡分析法 <span class="highlight">DEA 效率實驗室</span></h1>
                <p class="subtitle">
                    從線性規劃到管理決策：探索效率前緣、CCR/BCC 模型與營運改進策略。
                </p>
            </div>
        </header>

        <div class="tabs-container">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" class="tab-btn"
                :class="{ active: activeTab === tab.id }">
                <i :class="['bi', tab.icon, 'me-2']"></i>
                {{ tab.name }}
            </button>
        </div>

        <main class="content-area">

            <section v-if="activeTab === 'frontier'" class="lab-card fade-in">
                <div class="card-header">
                    <i class="bi bi-graph-up-arrow icon-glow"></i>
                    <div>
                        <h3>效率前緣 (The Efficiency Frontier)</h3>
                        <span class="desc">
                            在 DEA 中，只有落在「包絡線」上的決策單位 (DMU) 才是有效率的 (效率值=1)。<br>
                            下圖展示了 5 家分店的投入(員工)與產出(營收)關係。
                        </span>
                    </div>
                </div>

                <div class="viz-layout">
                    <div class="chart-container">
                        <svg :viewBox="`0 0 ${chartConfig.width} ${chartConfig.height}`" class="dea-chart">
                            <line :x1="scaleX(0)" :y1="scaleY(0)" :x2="scaleX(10)" :y2="scaleY(0)" stroke="#475569"
                                stroke-width="2" />
                            <line :x1="scaleX(0)" :y1="scaleY(0)" :x2="scaleX(0)" :y2="scaleY(10)" stroke="#475569"
                                stroke-width="2" />
                            <text :x="scaleX(10)" :y="scaleY(0) + 30" fill="#94a3b8" text-anchor="end">投入 (Input)</text>
                            <text :x="scaleX(0) - 30" :y="scaleY(10)" fill="#94a3b8" transform="rotate(-90, 10, 10)">產出
                                (Output)</text>

                            <path :d="ccrFrontier.d" stroke="var(--primary)" stroke-width="3" fill="none"
                                stroke-dasharray="5,5" />
                            <text :x="scaleX(8)" :y="scaleY(8 * ccrFrontier.slope) - 10" fill="var(--primary)"
                                font-size="12">CCR 前緣 (規模報酬固定)</text>

                            <g v-for="d in dmus" :key="d.id">
                                <circle :cx="scaleX(d.input)" :cy="scaleY(d.output)" r="6"
                                    :fill="d.id === ccrFrontier.bestId || d.id === 'D' ? 'var(--primary)' : '#ef4444'"
                                    stroke="white" stroke-width="2" class="dmu-point" />
                                <text :x="scaleX(d.input) + 10" :y="scaleY(d.output) + 5" fill="white" font-size="12">{{
                                    d.name }}</text>
                            </g>
                        </svg>
                    </div>

                    <div class="info-panel">
                        <div class="insight-box">
                            <h4>🔍 觀察重點</h4>
                            <ul>
                                <li><strong>分店 B</strong> 是表現最好的 (位於虛線上)，它的產出投入比 (Slope) 最大。</li>
                                <li>這條虛線構成了 <strong>CCR 效率前緣</strong>。</li>
                                <li><strong>分店 C</strong> 和 <strong>E</strong> 位於線的下方，代表它們是 <strong>無效率
                                        (Inefficient)</strong> 的。</li>
                                <li>DEA 的目標就是找出這條線，並計算每個點距離這條線有多遠。</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="activeTab === 'models'" class="lab-card fade-in">
                <div class="card-header">
                    <i class="bi bi-bezier2 icon-glow"></i>
                    <div>
                        <h3>CCR vs. BCC 模型比較</h3>
                        <span class="desc">
                            <strong>CCR</strong> 假設規模報酬固定 (直線)；<strong>BCC</strong> 允許規模報酬變動 (折線)。<br>
                            BCC 的包絡線通常會「包」得更緊，使更多 DMU 被判定為有效率。
                        </span>
                    </div>
                </div>

                <div class="viz-layout">
                    <div class="chart-container">
                        <svg :viewBox="`0 0 ${chartConfig.width} ${chartConfig.height}`" class="dea-chart">
                            <line :x1="scaleX(0)" :y1="scaleY(0)" :x2="scaleX(10)" :y2="scaleY(0)" stroke="#475569" />
                            <line :x1="scaleX(0)" :y1="scaleY(0)" :x2="scaleX(0)" :y2="scaleY(10)" stroke="#475569" />

                            <path :d="ccrFrontier.d" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4"
                                fill="none" opacity="0.5" />

                            <path :d="bccFrontier" stroke="#10b981" stroke-width="3" fill="rgba(16, 185, 129, 0.1)" />
                            <text :x="scaleX(2)" :y="scaleY(8)" fill="#10b981" font-weight="bold">BCC 前緣 (VRS)</text>

                            <g v-for="d in dmus" :key="d.id">
                                <circle :cx="scaleX(d.input)" :cy="scaleY(d.output)" r="5" fill="#e2e8f0" />
                                <text :x="scaleX(d.input)" :y="scaleY(d.output) - 10" fill="#e2e8f0" font-size="10"
                                    text-anchor="middle">{{ d.id }}</text>
                            </g>
                        </svg>
                    </div>
                    <div class="info-panel">
                        <div class="insight-box" style="border-left-color: #10b981;">
                            <h4>💡 模型差異解析</h4>
                            <p>注意看 <strong>分店 A</strong>：</p>
                            <ul>
                                <li>在 <strong>CCR (灰色虛線)</strong> 下：它是無效率的 (在線下方)。因為它的規模太小，CCR 認為它應該要有像 B 一樣的高產出比。</li>
                                <li>在 <strong>BCC (綠色實線)</strong> 下：它是有效率的 (在線上)。BCC 承認「小規模經營」的特性，因此 A 成為了小規模的最佳標竿。</li>
                            </ul>
                            <div class="badge-group">
                                <span class="badge-tag">CCR = 總技術效率</span>
                                <span class="badge-tag">BCC = 純技術效率</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="activeTab === 'diagnosis'" class="lab-card fade-in">
                <div class="card-header">
                    <i class="bi bi-bandaid icon-glow"></i>
                    <div>
                        <h3>營運診斷與改進 (Benchmarking)</h3>
                        <span class="desc">如何讓無效率的分店變為有效率？我們可以計算「差額變數 (Slacks)」並設定改進目標。</span>
                    </div>
                </div>

                <div class="diagnosis-layout">
                    <div class="control-panel">
                        <label class="lbl">選擇診斷對象：</label>
                        <div class="dmu-selector">
                            <button v-for="d in dmus.filter(x => ['C', 'E'].includes(x.id))" :key="d.id"
                                @click="selectedTarget = d.id" :class="{ active: selectedTarget === d.id }">
                                {{ d.name }}
                            </button>
                        </div>

                        <div class="stat-row">
                            <div class="stat-item">
                                <span class="val text-red">{{ currentEfficiency }}%</span>
                                <span class="lbl">當前效率 (CCR)</span>
                            </div>
                            <div class="stat-item">
                                <span class="val text-cyan">{{ targetDMU.input }} / {{ targetDMU.output }}</span>
                                <span class="lbl">當前 投入/產出</span>
                            </div>
                        </div>

                        <hr class="divider">

                        <label class="lbl">改進策略：</label>
                        <div class="strategy-toggle">
                            <label>
                                <input type="radio" value="input" v-model="improvementPlan">
                                投入導向 (裁員/節流)
                            </label>
                            <label>
                                <input type="radio" value="output" v-model="improvementPlan">
                                產出導向 (增收/開源)
                            </label>
                        </div>

                        <button class="action-btn" @click="runOptimization" :disabled="isOptimizing">
                            執行改進模擬
                        </button>
                    </div>

                    <div class="result-viz">
                        <svg :viewBox="`0 0 ${chartConfig.width} ${chartConfig.height}`" class="dea-chart small">
                            <path :d="ccrFrontier.d" stroke="var(--primary)" stroke-dasharray="5,5" opacity="0.5" />

                            <circle :cx="scaleX(targetDMU.input)" :cy="scaleY(targetDMU.output)" r="6" fill="#ef4444"
                                opacity="0.5" />
                            <text :x="scaleX(targetDMU.input) + 10" :y="scaleY(targetDMU.output)" fill="#ef4444">原點</text>

                            <circle :cx="scaleX(isOptimizing ? targetDMU.input : optimizedDMU.input)"
                                :cy="scaleY(isOptimizing ? targetDMU.output : optimizedDMU.output)" r="8" fill="#10b981"
                                class="target-point" />

                            <line v-if="!isOptimizing && optimizedDMU.input !== 0" :x1="scaleX(targetDMU.input)"
                                :y1="scaleY(targetDMU.output)" :x2="scaleX(optimizedDMU.input)"
                                :y2="scaleY(optimizedDMU.output)" stroke="#fff" stroke-width="2"
                                marker-end="url(#arrow)" />

                            <defs>
                                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"
                                    markerUnits="strokeWidth">
                                    <path d="M0,0 L0,6 L9,3 z" fill="#fff" />
                                </marker>
                            </defs>
                        </svg>

                        <div class="suggestion-box" v-if="!isOptimizing && optimizedDMU.input !== 0">
                            <i class="bi bi-lightbulb-fill text-yellow"></i>
                            <span v-if="improvementPlan === 'input'">
                                建議將投入從 <strong>{{ targetDMU.input }}</strong> 減少至 <strong>{{ targetInput }}</strong>
                                (-{{ (targetDMU.input - targetInput).toFixed(1) }})，即可達到效率前緣。
                            </span>
                            <span v-else>
                                建議將產出從 <strong>{{ targetDMU.output }}</strong> 提升至 <strong>{{ targetOutput }}</strong>
                                (+{{ (targetOutput - targetDMU.output).toFixed(1) }})，即可達到效率前緣。
                            </span>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    </div>
</template>

<style scoped>
/* Dark EdTech Theme Variables */
:root {
    --primary: #00f3ff;
    --primary-dim: rgba(0, 243, 255, 0.1);
    --bg-dark: #0b0f19;
    --bg-card: rgba(20, 25, 40, 0.7);
    --text-main: #e2e8f0;
    --text-muted: #94a3b8;
    --border: rgba(255, 255, 255, 0.08);
}

.page-container {
    min-height: 100vh;
    background-color: #0b0f19;
    background-image: radial-gradient(circle at 50% 0%, #1a2540 0%, #0b0f19 70%);
    color: #e2e8f0;
    font-family: 'Segoe UI', system-ui, sans-serif;
    padding: 40px 20px;
}

/* Header */
.header-section {
    text-align: center;
    margin-bottom: 50px;
}

.badge {
    display: inline-block;
    background: var(--primary-dim);
    color: var(--primary);
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 15px;
    border: 1px solid rgba(0, 243, 255, 0.2);
}

.title {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
}

.highlight {
    color: transparent;
    background: linear-gradient(90deg, #00f3ff, #0066ff);
    -webkit-background-clip: text;
    background-clip: text;
}

.subtitle {
    color: #94a3b8;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
}

/* Tabs */
.tabs-container {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.tab-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 12px 24px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 1rem;
    display: flex;
    align-items: center;
}

.tab-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
}

.tab-btn.active {
    background: var(--primary-dim);
    color: var(--primary);
    border-color: var(--primary);
    box-shadow: 0 0 15px rgba(0, 243, 255, 0.2);
}

/* Lab Card */
.lab-card {
    background: var(--bg-card);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 30px;
    max-width: 1000px;
    margin: 0 auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.card-header {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 20px;
}

.icon-glow {
    font-size: 2rem;
    color: var(--primary);
    text-shadow: 0 0 15px var(--primary);
}

.card-header h3 {
    margin: 0 0 5px 0;
    font-size: 1.5rem;
    color: #fff;
}

.desc {
    color: var(--text-muted);
    font-size: 0.95rem;
}

/* Visual Layouts */
.viz-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
}

.chart-container {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid var(--border);
}

.dea-chart {
    width: 100%;
    height: auto;
    overflow: visible;
}

.dmu-point {
    transition: all 0.3s;
    cursor: pointer;
}

.dmu-point:hover {
    r: 8;
    stroke: #fff;
}

.info-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.insight-box {
    background: rgba(255, 255, 255, 0.03);
    padding: 20px;
    border-radius: 10px;
    border-left: 4px solid var(--primary);
}

.insight-box h4 {
    margin-top: 0;
    color: #fff;
    margin-bottom: 15px;
}

.insight-box ul {
    padding-left: 20px;
    color: var(--text-muted);
    line-height: 1.6;
}

.insight-box li {
    margin-bottom: 8px;
}

.insight-box strong {
    color: #e2e8f0;
}

.badge-group {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
}

.badge-tag {
    font-size: 0.8rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 4px 8px;
    border-radius: 4px;
    color: #cbd5e1;
}

/* Diagnosis Styles */
.diagnosis-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
}

.control-panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.lbl {
    font-size: 0.9rem;
    color: var(--text-muted);
    font-weight: 600;
    display: block;
    margin-bottom: 8px;
}

.dmu-selector {
    display: flex;
    gap: 10px;
}

.dmu-selector button {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border);
    color: var(--text-muted);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.dmu-selector button.active {
    background: var(--primary);
    color: #000;
    font-weight: bold;
    border-color: var(--primary);
}

.stat-row {
    display: flex;
    gap: 20px;
    margin-top: 10px;
}

.stat-item {
    background: rgba(0, 0, 0, 0.3);
    padding: 15px;
    border-radius: 10px;
    flex: 1;
    text-align: center;
    border: 1px solid var(--border);
}

.stat-item .val {
    display: block;
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 5px;
}

.text-red {
    color: #ef4444;
}

.text-cyan {
    color: var(--primary);
}

.divider {
    border: 0;
    border-top: 1px solid var(--border);
    width: 100%;
    margin: 10px 0;
}

.strategy-toggle {
    display: flex;
    gap: 20px;
    margin-bottom: 10px;
}

.strategy-toggle label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #e2e8f0;
}

.action-btn {
    background: linear-gradient(90deg, #00f3ff, #0066ff);
    color: #000;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: opacity 0.2s;
    margin-top: auto;
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.result-viz {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
}

.target-point {
    transition: all 1s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.suggestion-box {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 15px;
    border-radius: 10px;
    color: #d1fae5;
    font-size: 0.95rem;
    line-height: 1.5;
    display: flex;
    gap: 10px;
    align-items: start;
    animation: fadeIn 0.5s;
}

.text-yellow {
    color: #fbbf24;
}

/* Utilities */
.fade-in {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {

    .viz-layout,
    .diagnosis-layout {
        grid-template-columns: 1fr;
    }

    .title {
        font-size: 1.8rem;
    }
}
</style>
