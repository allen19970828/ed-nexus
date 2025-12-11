<script setup>
import { ref, computed, reactive, onMounted } from 'vue'

// ==========================================
// 共用設定
// ==========================================
const activeTab = ref('mechanism') // mechanism, tradeoff, metrics

const tabs = [
    { id: 'mechanism', name: '核心機制模擬', icon: 'bi-cpu' },
    { id: 'tradeoff', name: '決策權衡模擬器', icon: 'bi-sliders' },
    { id: 'metrics', name: '論文實驗數據', icon: 'bi-bar-chart-line' }
]

// ==========================================
// Lab 1: 機制模擬 (RAG vs FT)
// ==========================================
// 模擬問題：農業領域知識
const question = ref("玉米葉片出現黃色條紋，且生長遲緩，缺乏什麼營養？")
const simulationState = reactive({
    mode: 'idle', // idle, processing, done
    currentStep: '',
    retrievedDoc: '',
    answer: ''
})

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const runRAG = async () => {
    if (simulationState.mode === 'processing') return

    simulationState.mode = 'processing'
    simulationState.answer = ''
    simulationState.retrievedDoc = ''
    simulationState.currentStep = '檢索中 (Retrieving)...'

    // 步驟 1: 檢索
    await delay(1500)
    simulationState.currentStep = '閱讀文檔 (Reading Context)...'
    simulationState.retrievedDoc = '📄 文件片段：[Agri_DB_v2.pdf] ...缺鋅(Zinc)會導致玉米葉片基部出現寬的白色或黃色條紋...'

    // 步驟 2: 生成
    await delay(1500)
    simulationState.currentStep = '生成答案 (Generating)...'
    simulationState.answer = '根據檢索到的資料，這是「缺鋅 (Zinc Deficiency)」的症狀。特徵是葉片基部的黃白條紋。'
    simulationState.mode = 'done'
}

const runFT = async () => {
    if (simulationState.mode === 'processing') return

    simulationState.mode = 'processing'
    simulationState.answer = ''
    simulationState.retrievedDoc = '' // FT 不檢索
    simulationState.currentStep = '提取內部權重 (Accessing Weights)...'

    // 步驟 1: 直接推論 (速度快，但需要先訓練)
    await delay(800)
    simulationState.currentStep = '神經網絡推論 (Inference)...'

    await delay(1000)
    simulationState.answer = '這通常是缺鋅或是缺鎂。如果是新葉出現條紋，極大機率是缺鋅。'
    simulationState.mode = 'done'
}

// ==========================================
// Lab 2: 決策權衡 (Trade-offs)
// ==========================================
// 用戶設定
const configs = reactive({
    dataDynamic: 50, // 資料變動頻率 (0=靜態, 100=即時)
    budget: 50,      // 初始預算 (影響訓練能力)
    domainSpec: 50,  // 領域專有名詞多寡 (格式要求)
    hallucination: 50 // 對錯誤容忍度 (0=可容忍, 100=零容忍)
})

// 計算推薦分數
const recommendation = computed(() => {
    let ragScore = 0
    let ftScore = 0

    // 1. 資料變動率：高變動適合 RAG (不用一直重訓)
    ragScore += configs.dataDynamic * 1.5
    ftScore += (100 - configs.dataDynamic) * 0.5

    // 2. 領域格式/專有名詞：FT 擅長學習特定語氣與格式
    ftScore += configs.domainSpec * 1.2
    ragScore += (100 - configs.domainSpec) * 0.2

    // 3. 幻覺容忍：RAG 提供來源，較好查證 (降低幻覺風險)
    ragScore += configs.hallucination * 1.0

    // 4. 預算：FT 初期成本高，推理成本低；RAG 初期低，推理成本高(Context長)
    // 這裡簡化模擬：預算低時偏向 RAG (不用買 GPU 訓練)
    if (configs.budget < 40) ragScore += 30

    const total = ragScore + ftScore
    const ragPct = Math.round((ragScore / total) * 100)

    let winner = 'RAG (檢索增強)'
    if (ragPct < 45) winner = 'Fine-Tuning (微調)'
    if (ragPct >= 45 && ragPct <= 55) winner = 'Hybrid (RAG + FT 混合)'

    return { ragPct, winner }
})

// ==========================================
// Lab 3: 論文數據 (Metrics)
// ==========================================
// 論文 Table 3 & Figure 3 的簡化數據
// 準確率 Accuracy
const metrics = [
    { model: 'Llama-2 Base', acc: 0.45, color: '#64748b' },
    { model: 'RAG', acc: 0.72, color: '#00f3ff' },
    { model: 'Fine-Tuning', acc: 0.75, color: '#ec4899' },
    { model: 'RAG + FT', acc: 0.83, color: '#10b981' } // 最佳
]

</script>

<template>
    <div class="page-container" style="margin-top: 76px;">

        <header class="header-section">
            <div class="header-content">
                <div class="badge">Paper Analysis: arXiv:2407.05458</div>
                <h1 class="title">RAG vs Fine-tuning <span class="highlight">技術對決</span></h1>
                <p class="subtitle">
                    微軟研究報告：在農業領域知識問答中，我們該如何選擇？<br>
                    比較 Pipelines、權衡分析與實際案例。
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

            <section v-if="activeTab === 'mechanism'" class="lab-card fade-in">
                <div class="card-header">
                    <i class="bi bi-cpu icon-glow"></i>
                    <div>
                        <h3>核心機制差異 (Mechanism)</h3>
                        <span class="desc">比較「外掛知識庫 (RAG)」與「大腦升級 (Fine-Tuning)」的運作流程差異。</span>
                    </div>
                </div>

                <div class="sim-container">
                    <div class="question-box">
                        <span class="lbl">User Query:</span>
                        <p>{{ question }}</p>
                    </div>

                    <div class="action-area">
                        <div class="model-col">
                            <h4>🔵 RAG Pipeline</h4>
                            <p class="method-desc">搜尋外部文檔 $\rightarrow$ 注入 Prompt $\rightarrow$ 回答</p>
                            <button @click="runRAG" :disabled="simulationState.mode === 'processing'" class="btn-rag">
                                執行 RAG 檢索
                            </button>
                        </div>

                        <div class="vs-divider">VS</div>

                        <div class="model-col">
                            <h4>🔴 Fine-Tuning Pipeline</h4>
                            <p class="method-desc">訓練內化知識 $\rightarrow$ 改變權重 $\rightarrow$ 直覺回答</p>
                            <button @click="runFT" :disabled="simulationState.mode === 'processing'" class="btn-ft">
                                執行 FT 推論
                            </button>
                        </div>
                    </div>

                    <div class="display-screen">
                        <div class="status-bar" v-if="simulationState.mode !== 'idle'">
                            <i class="bi bi-gear-wide-connected spin"></i>
                            {{ simulationState.currentStep }}
                        </div>

                        <div class="result-content" v-if="simulationState.retrievedDoc">
                            <div class="doc-card">
                                <i class="bi bi-file-earmark-text"></i>
                                {{ simulationState.retrievedDoc }}
                            </div>
                        </div>

                        <div class="final-answer" v-if="simulationState.answer">
                            <span class="ai-tag">AI Response:</span>
                            {{ simulationState.answer }}
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="activeTab === 'tradeoff'" class="lab-card fade-in">
                <div class="card-header">
                    <i class="bi bi-sliders icon-glow"></i>
                    <div>
                        <h3>決策權衡模擬器 (Trade-offs)</h3>
                        <span class="desc">論文指出沒有絕對的贏家。調整下方的農業專案需求，查看推薦策略。</span>
                    </div>
                </div>

                <div class="tradeoff-layout">
                    <div class="sliders-col">
                        <div class="slider-group">
                            <label>資料變動頻率 (Data Dynamism)</label>
                            <input type="range" v-model.number="configs.dataDynamic" min="0" max="100">
                            <div class="range-labels">
                                <span>靜態 (教科書)</span>
                                <span>即時 (市場價格)</span>
                            </div>
                        </div>

                        <div class="slider-group">
                            <label>領域格式要求 (Domain Specificity)</label>
                            <input type="range" v-model.number="configs.domainSpec" min="0" max="100">
                            <div class="range-labels">
                                <span>通用格式</span>
                                <span>高度特定格式</span>
                            </div>
                        </div>

                        <div class="slider-group">
                            <label>對「幻覺」的零容忍度</label>
                            <input type="range" v-model.number="configs.hallucination" min="0" max="100">
                            <div class="range-labels">
                                <span>可容忍錯誤</span>
                                <span>需要精確引用</span>
                            </div>
                        </div>
                    </div>

                    <div class="result-col">
                        <div class="recommendation-box">
                            <span class="lbl">論文推薦策略</span>
                            <h2 class="winner-text">{{ recommendation.winner }}</h2>

                            <div class="progress-bar-bg">
                                <div class="progress-fill" :style="{ width: recommendation.ragPct + '%' }"></div>
                                <span class="bar-text left">RAG傾向</span>
                                <span class="bar-text right">FT傾向</span>
                            </div>

                            <div class="insight-text">
                                <p v-if="recommendation.ragPct > 60">
                                    <strong>💡 分析：</strong> 當資料變動快且需要精確引用來源時，RAG 是最佳選擇。論文中提到農業新聞/價格數據必須使用 RAG。
                                </p>
                                <p v-else-if="recommendation.ragPct < 40">
                                    <strong>💡 分析：</strong> 當資料穩定且需要特定語氣（如客服、特定報告格式）時，FT 效果更好且推論成本較低。
                                </p>
                                <p v-else>
                                    <strong>💡 分析：</strong> 論文提出 <strong>RAG + FT</strong> 混合模式。先用 RAG 找資料，再用 FT
                                    過的模型來生成，能達到最高的準確率 (0.83+)。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="activeTab === 'metrics'" class="lab-card fade-in">
                <div class="card-header">
                    <i class="bi bi-bar-chart-line icon-glow"></i>
                    <div>
                        <h3>論文實驗數據 (Performance)</h3>
                        <span class="desc">基於農業數據集 (AI-Agri) 的準確率測試結果。</span>
                    </div>
                </div>

                <div class="chart-container">
                    <div v-for="m in metrics" :key="m.model" class="bar-row">
                        <div class="bar-label">{{ m.model }}</div>
                        <div class="bar-track">
                            <div class="bar-fill" :style="{ width: (m.acc * 100) + '%', background: m.color }">
                                {{ (m.acc * 100).toFixed(0) }}%
                            </div>
                        </div>
                    </div>
                </div>

                <div class="conclusion-box">
                    <h4>📑 論文關鍵結論</h4>
                    <ul>
                        <li><strong>RAG (72%)</strong> 在獲取新知識方面顯著優於 Base Model。</li>
                        <li><strong>Fine-Tuning (75%)</strong> 在學習特定領域的回答風格和深度知識上略勝一籌。</li>
                        <li><strong>RAG + FT (83%)</strong> 結合兩者優勢：RAG 提供準確上下文，FT 提供優秀的理解與生成能力，是目前的最優解 (SOTA)。</li>
                    </ul>
                </div>
            </section>

        </main>
    </div>
</template>

<style scoped>
/* Theme Variables - Dark EdTech */
:root {
    --primary: #00f3ff;
    --primary-dim: rgba(0, 243, 255, 0.1);
    --secondary: #ec4899;
    /* Pink for FT */
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
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    padding: 4px 12px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.8rem;
    margin-bottom: 10px;
    border: 1px solid var(--border);
}

.title {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
}

.highlight {
    color: transparent;
    background: linear-gradient(90deg, #00f3ff, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
}

.subtitle {
    color: #94a3b8;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
}

/* Navigation */
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

/* Card Common */
.lab-card {
    background: var(--bg-card);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 30px;
    max-width: 900px;
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

/* Lab 1: Mechanism */
.sim-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.question-box {
    background: rgba(255, 255, 255, 0.05);
    padding: 15px;
    border-radius: 10px;
    border-left: 4px solid #fff;
}

.question-box .lbl {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.question-box p {
    font-size: 1.1rem;
    margin: 5px 0 0 0;
    font-weight: 500;
}

.action-area {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
}

.model-col {
    flex: 1;
    text-align: center;
    background: rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid var(--border);
}

.method-desc {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 15px;
    min-height: 40px;
}

.vs-divider {
    font-weight: bold;
    color: var(--text-muted);
    font-style: italic;
}

.btn-rag,
.btn-ft {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
    width: 100%;
}

.btn-rag {
    background: var(--primary);
}

.btn-rag:hover {
    box-shadow: 0 0 15px var(--primary);
    transform: translateY(-2px);
}

.btn-ft {
    background: var(--secondary);
    color: #fff;
}

.btn-ft:hover {
    box-shadow: 0 0 15px var(--secondary);
    transform: translateY(-2px);
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.display-screen {
    background: #000;
    border: 1px solid #333;
    border-radius: 10px;
    padding: 20px;
    min-height: 150px;
    position: relative;
    font-family: 'Consolas', monospace;
}

.status-bar {
    color: var(--primary);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.doc-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 15px;
    border-left: 3px solid var(--primary);
    color: #d1d5db;
    font-size: 0.9rem;
    animation: slideIn 0.3s;
}

.final-answer {
    color: #fff;
    line-height: 1.5;
    animation: fadeIn 0.5s;
}

.result-content {
    animation: fadeIn 0.5s;
}

.ai-tag {
    color: var(--secondary);
    font-weight: bold;
    margin-right: 8px;
}

/* Lab 2: Trade-offs */
.tradeoff-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
}

.slider-group {
    margin-bottom: 25px;
}

.slider-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: 500;
    color: #e2e8f0;
}

input[type=range] {
    width: 100%;
    accent-color: var(--primary);
    cursor: pointer;
}

.range-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 5px;
}

.result-col {
    display: flex;
    align-items: center;
    justify-content: center;
}

.recommendation-box {
    text-align: center;
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    padding: 30px;
    border-radius: 15px;
    border: 1px solid var(--border);
}

.winner-text {
    font-size: 1.8rem;
    color: #fff;
    margin: 15px 0;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.progress-bar-bg {
    height: 10px;
    background: var(--secondary);
    border-radius: 5px;
    position: relative;
    margin: 20px 0;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--primary);
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar-text {
    position: absolute;
    top: 15px;
    font-size: 0.8rem;
    color: var(--text-muted);
}

.bar-text.left {
    left: 0;
    color: var(--primary);
}

.bar-text.right {
    right: 0;
    color: var(--secondary);
}

.insight-text {
    margin-top: 30px;
    text-align: left;
    background: rgba(0, 0, 0, 0.2);
    padding: 15px;
    border-radius: 8px;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #cbd5e1;
}

/* Lab 3: Metrics */
.chart-container {
    margin: 30px 0;
}

.bar-row {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.bar-label {
    width: 120px;
    font-size: 0.95rem;
    color: #cbd5e1;
}

.bar-track {
    flex: 1;
    height: 24px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    color: #000;
    font-weight: bold;
    font-size: 0.85rem;
    transition: width 1s ease-out;
}

.conclusion-box {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 20px;
    border-radius: 10px;
}

.conclusion-box h4 {
    margin-top: 0;
    color: #10b981;
}

.conclusion-box ul {
    padding-left: 20px;
    color: #d1fae5;
    line-height: 1.6;
    margin-bottom: 0;
}

.conclusion-box li {
    margin-bottom: 8px;
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

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.spin {
    animation: spin 2s linear infinite;
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}

/* RWD */
@media (max-width: 768px) {
    .tradeoff-layout {
        grid-template-columns: 1fr;
    }

    .action-area {
        flex-direction: column;
    }

    .vs-divider {
        margin: 10px 0;
        transform: rotate(90deg);
    }
}
</style>
