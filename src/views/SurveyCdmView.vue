<script setup>
import { ref, computed, reactive, onMounted } from 'vue'

// ==========================================
// 共用設定
// ==========================================
const activeTab = ref('simulation') // simulation, evolution, future

const tabs = [
    { id: 'simulation', name: 'Q-Matrix 診斷模擬', icon: 'bi-grid-3x3' },
    { id: 'evolution', name: '模型演進與比較', icon: 'bi-clock-history' },
    { id: 'future', name: '未來趨勢展望', icon: 'bi-stars' }
]

// ==========================================
// Lab 1: Q-Matrix 模擬器
// ==========================================
// 技能定義
const skills = ['加法 (Add)', '乘法 (Mul)', '分數 (Frac)']
// Q-Matrix: 定義每題需要什麼技能 (1=需要, 0=不需要)
const qMatrix = [
    { id: 1, text: '2 + 3 = ?', needs: [1, 0, 0] },       // Q1: 純加法
    { id: 2, text: '3 x 4 = ?', needs: [0, 1, 0] },       // Q2: 純乘法
    { id: 3, text: '1/2 + 1/3 = ?', needs: [1, 1, 1] },   // Q3: 綜合 (通分需乘法, 分子需加法)
]

// 學生作答狀態 (null=未答, 1=對, 0=錯)
const studentResponses = reactive({ 1: null, 2: null, 3: null })

// 簡單的 CDM 推論邏輯 (DINA-like 規則模擬)
const masteryProfile = computed(() => {
    const profile = skills.map(s => ({ name: s, score: 0.5 })) // 初始 50%

    // 遍歷每一題的作答
    qMatrix.forEach((q, idx) => {
        const resp = studentResponses[q.id]
        if (resp === null) return

        q.needs.forEach((hasSkill, skillIdx) => {
            if (hasSkill) {
                // 如果答對，該技能掌握度上升；答錯則下降
                const change = resp === 1 ? 0.2 : -0.25
                profile[skillIdx].score = Math.min(1, Math.max(0, profile[skillIdx].score + change))
            }
        })
    })

    return profile.map(p => ({ ...p, percent: Math.round(p.score * 100) }))
})

const setResponse = (qId, val) => {
    studentResponses[qId] = val
}

// 產生雷達圖路徑
const radarPath = computed(() => {
    const center = 100
    const radius = 80
    const angleStep = (Math.PI * 2) / 3

    const points = masteryProfile.value.map((skill, i) => {
        const angle = i * angleStep - Math.PI / 2 // 從上方開始
        const r = radius * skill.score
        const x = center + r * Math.cos(angle)
        const y = center + r * Math.sin(angle)
        return `${x},${y}`
    })

    return points.join(' ')
})

// ==========================================
// Lab 2: 模型演進 (Timeline)
// ==========================================
const selectedEra = ref('traditional')
const eras = [
    {
        id: 'traditional',
        year: '1980s - 2000s',
        title: '傳統心理計量模型',
        models: ['DINA', 'DINO', 'G-DINA'],
        desc: '基於機率統計。優點是可解釋性強（參數有明確意義），缺點是難以處理大規模數據和非線性關係。',
        feature: '手工定義交互作用 (Hand-crafted)'
    },
    {
        id: 'ml',
        year: '2010s',
        title: '矩陣分解與機器學習',
        models: ['MIRT', 'PMF', 'Tensor Factorization'],
        desc: '引入推薦系統技術。將學生能力視為潛在向量 (Latent Vectors)。提高了預測準確度，但解釋性開始變弱。',
        feature: '潛在因子挖掘 (Latent Factors)'
    },
    {
        id: 'dl',
        year: '2018 - Present',
        title: '深度學習 CDM',
        models: ['NeuralCDM', 'DeepIRT', 'KaNCD'],
        desc: '使用神經網絡擬合複雜的學生-試題交互函數。能處理海量數據，捕捉高階非線性關係，是目前的主流。',
        feature: '神經網絡擬合 (Black-box Fitting)'
    }
]
const currentEraData = computed(() => eras.find(e => e.id === selectedEra.value))

// ==========================================
// Lab 3: 未來趨勢 (Cards)
// ==========================================
const futureTrends = [
    { title: 'LLM for Cognitive Diagnosis', icon: 'bi-chat-square-quote', desc: '利用大型語言模型強大的語意理解能力，直接從學生的開放式回答（而不僅是選擇題）中診斷認知狀態。' },
    { title: 'Multimodal CDM', icon: 'bi-images', desc: '結合眼動追蹤、腦電波 (EEG) 或解題過程中的滑鼠軌跡等多模態數據，進行更精確的生理級認知診斷。' },
    { title: 'Automated Q-Matrix', icon: 'bi-magic', desc: '傳統 Q-Matrix 需專家標註。未來趨勢是利用 AI 自動從試題文本中提取技能需求，實現無人值守的診斷系統。' }
]

</script>

<template>
    <div class="page-container" style="margin-top: 76px;">

        <header class="header-section">
            <div class="header-content">
                <div class="badge">Paper Review: arXiv:2407.05458</div>
                <h1 class="title">認知診斷模型 <span class="highlight">CDM 演進實驗室</span></h1>
                <p class="subtitle">
                    從 DINA 到 NeuralCDM：探索 AI 如何評估人類的認知狀態。<br>
                    基於 USTC (中科大) 團隊的最新綜述報告。
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

            <section v-if="activeTab === 'simulation'" class="lab-card fade-in">
                <div class="card-header">
                    <i class="bi bi-grid-3x3 icon-glow"></i>
                    <div>
                        <h3>Q-Matrix 診斷機制</h3>
                        <span class="desc">CDM 的核心：透過觀察學生在特定試題 (Question) 的表現，推斷其背後對應技能 (Skill) 的掌握機率。</span>
                    </div>
                </div>

                <div class="sim-layout">
                    <div class="quiz-panel">
                        <h4><i class="bi bi-pencil-square"></i> 學生作答區</h4>
                        <div class="question-list">
                            <div v-for="q in qMatrix" :key="q.id" class="question-item">
                                <div class="q-info">
                                    <span class="q-text">{{ q.text }}</span>
                                    <div class="skills-tag">
                                        <span v-for="(val, idx) in q.needs" :key="idx" v-show="val" class="skill-badge">
                                            {{ skills[idx] }}
                                        </span>
                                    </div>
                                </div>
                                <div class="q-actions">
                                    <button @click="setResponse(q.id, 1)" class="btn-option correct"
                                        :class="{ active: studentResponses[q.id] === 1 }">
                                        <i class="bi bi-check-lg"></i>
                                    </button>
                                    <button @click="setResponse(q.id, 0)" class="btn-option wrong"
                                        :class="{ active: studentResponses[q.id] === 0 }">
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p class="hint-text">
                            <i class="bi bi-info-circle"></i> 試試看答錯 "Q3 (分數加法)"，觀察乘法和加法的技能變化。
                        </p>
                    </div>

                    <div class="result-panel">
                        <h4><i class="bi bi-person-video2"></i> 認知狀態診斷 (Cognitive State)</h4>
                        <div class="radar-container">
                            <svg viewBox="0 0 200 200" class="radar-chart">
                                <circle cx="100" cy="100" r="80" stroke="#334155" fill="none" stroke-dasharray="4,4" />
                                <circle cx="100" cy="100" r="40" stroke="#334155" fill="none" stroke-dasharray="4,4" />

                                <line x1="100" y1="100" x2="100" y2="20" stroke="#334155" />
                                <line x1="100" y1="100" x2="170" y2="140" stroke="#334155" />
                                <line x1="100" y1="100" x2="30" y2="140" stroke="#334155" />
                                <polygon :points="radarPath" fill="rgba(0, 243, 255, 0.3)" stroke="var(--primary)"
                                    stroke-width="2" />

                                <text x="100" y="15" fill="#fff" text-anchor="middle" font-size="12">加法 (Add)</text>
                                <text x="180" y="150" fill="#fff" text-anchor="middle" font-size="12">乘法 (Mul)</text>
                                <text x="20" y="150" fill="#fff" text-anchor="middle" font-size="12">分數 (Frac)</text>
                            </svg>
                        </div>
                        <div class="skill-bars">
                            <div v-for="skill in masteryProfile" :key="skill.name" class="bar-row">
                                <span>{{ skill.name }}</span>
                                <div class="bar-bg">
                                    <div class="bar-fill" :style="{ width: skill.percent + '%' }"></div>
                                </div>
                                <span class="pct">{{ skill.percent }}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="activeTab === 'evolution'" class="lab-card fade-in">
                <div class="card-header">
                    <i class="bi bi-clock-history icon-glow"></i>
                    <div>
                        <h3>模型演進史 (Evolution)</h3>
                        <span class="desc">從 1980 年代的機率統計模型，到當代的深度神經網絡。</span>
                    </div>
                </div>

                <div class="timeline-container">
                    <div class="era-nav">
                        <button v-for="era in eras" :key="era.id" @click="selectedEra = era.id" class="era-btn"
                            :class="{ active: selectedEra === era.id }">
                            <span class="year">{{ era.year }}</span>
                            <span class="lbl">{{ era.id.toUpperCase() }}</span>
                        </button>
                    </div>

                    <div class="era-content">
                        <div class="era-header">
                            <h2>{{ currentEraData.title }}</h2>
                            <div class="tech-badge">{{ currentEraData.feature }}</div>
                        </div>
                        <p class="era-desc">{{ currentEraData.desc }}</p>

                        <div class="models-list">
                            <div v-for="m in currentEraData.models" :key="m" class="model-tag">
                                {{ m }}
                            </div>
                        </div>

                        <div class="viz-concept">
                            <div v-if="selectedEra === 'traditional'" class="viz-box traditional">
                                <div class="formula">P(Y=1) = (1-s)<sup style="font-size: 0.6em;">η</sup> × g<sup
                                        style="font-size: 0.6em;">(1-η)</sup></div>
                                <span>DINA: 嚴格的規則匹配 (邏輯閘)</span>
                            </div>
                            <div v-if="selectedEra === 'ml'" class="viz-box ml">
                                <div class="matrix-viz">
                                    <div class="m-row">User Vector</div>
                                    <div class="x-sign">×</div>
                                    <div class="m-col">Item Vector</div>
                                </div>
                                <span>矩陣分解：向量內積預測</span>
                            </div>
                            <div v-if="selectedEra === 'dl'" class="viz-box dl">
                                <div class="network-viz">
                                    <div class="layer input"></div>
                                    <div class="layer hidden"></div>
                                    <div class="layer output"></div>
                                </div>
                                <span>NeuralCDM: 多層神經網絡擬合</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="activeTab === 'future'" class="lab-card fade-in">
                <div class="card-header">
                    <i class="bi bi-stars icon-glow"></i>
                    <div>
                        <h3>未來趨勢 (Future Directions)</h3>
                        <span class="desc">論文指出的下一代 CDM 發展重點方向。</span>
                    </div>
                </div>

                <div class="trends-grid">
                    <div v-for="(trend, i) in futureTrends" :key="i" class="trend-card">
                        <div class="icon-wrapper">
                            <i :class="['bi', trend.icon]"></i>
                        </div>
                        <h4>{{ trend.title }}</h4>
                        <p>{{ trend.desc }}</p>
                    </div>
                </div>
            </section>

        </main>
    </div>
</template>

<style scoped>
/* Theme Variables - Dark EdTech (Consistent with Research.vue) */
:root {
    --primary: #00f3ff;
    --primary-dim: rgba(0, 243, 255, 0.1);
    --secondary: #9333ea;
    /* Purple for AI/DL */
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
    background: linear-gradient(90deg, #00f3ff, #9333ea);
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

/* Lab 1: Simulation */
.sim-layout {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 30px;
}

.quiz-panel h4,
.result-panel h4 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #fff;
    border-bottom: 1px solid var(--border);
    padding-bottom: 10px;
}

.question-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.question-item {
    background: rgba(255, 255, 255, 0.03);
    padding: 15px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--border);
}

.q-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.q-text {
    font-size: 1.1rem;
    font-weight: bold;
}

.skills-tag {
    display: flex;
    gap: 5px;
}

.skill-badge {
    font-size: 0.75rem;
    background: rgba(147, 51, 234, 0.2);
    color: #d8b4fe;
    padding: 2px 6px;
    border-radius: 4px;
}

.q-actions {
    display: flex;
    gap: 10px;
}

.btn-option {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-option:hover {
    background: rgba(255, 255, 255, 0.1);
}

.btn-option.correct.active {
    background: #10b981;
    color: #fff;
    border-color: #10b981;
    box-shadow: 0 0 10px #10b981;
}

.btn-option.wrong.active {
    background: #ef4444;
    color: #fff;
    border-color: #ef4444;
    box-shadow: 0 0 10px #ef4444;
}

.hint-text {
    margin-top: 20px;
    font-size: 0.9rem;
    color: var(--text-muted);
    background: rgba(0, 243, 255, 0.05);
    padding: 10px;
    border-radius: 8px;
    border-left: 3px solid var(--primary);
}

.radar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.radar-chart {
    width: 220px;
    height: 220px;
    overflow: visible;
}

.skill-bars {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.bar-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
}

.bar-bg {
    flex: 1;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    background: var(--primary);
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.pct {
    width: 40px;
    text-align: right;
    font-family: monospace;
    color: var(--primary);
}

/* Lab 2: Timeline */
.timeline-container {
    display: flex;
    gap: 40px;
}

.era-nav {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 180px;
    flex-shrink: 0;
}

.era-btn {
    background: transparent;
    border: 1px solid var(--border);
    padding: 15px;
    border-radius: 12px;
    cursor: pointer;
    text-align: left;
    transition: all 0.3s;
    color: var(--text-muted);
}

.era-btn:hover {
    background: rgba(255, 255, 255, 0.05);
}

.era-btn.active {
    background: var(--primary-dim);
    border-color: var(--primary);
    color: #fff;
}

.era-btn .year {
    display: block;
    font-size: 0.8rem;
    opacity: 0.7;
    margin-bottom: 4px;
}

.era-btn .lbl {
    font-weight: bold;
}

.era-content {
    flex: 1;
    background: rgba(0, 0, 0, 0.2);
    padding: 30px;
    border-radius: 15px;
    border: 1px solid var(--border);
    position: relative;
    overflow: hidden;
}

.era-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.tech-badge {
    background: var(--secondary);
    color: #fff;
    font-size: 0.8rem;
    padding: 4px 10px;
    border-radius: 20px;
}

.era-desc {
    line-height: 1.6;
    margin-bottom: 20px;
    color: #d1d5db;
}

.models-list {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 30px;
}

.model-tag {
    background: rgba(255, 255, 255, 0.1);
    padding: 6px 12px;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.9rem;
}

.viz-concept {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    border: 1px dashed var(--border);
}

.viz-box {
    text-align: center;
    width: 100%;
}

.formula {
    font-family: 'Times New Roman', serif;
    font-size: 1.5rem;
    color: var(--primary);
    margin-bottom: 5px;
    letter-spacing: 1px;
}

.matrix-viz {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
}

.m-row {
    border: 1px solid var(--secondary);
    padding: 5px 15px;
    border-radius: 4px;
}

.m-col {
    border: 1px solid var(--secondary);
    padding: 15px 5px;
    border-radius: 4px;
}

.network-viz {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-bottom: 5px;
}

.layer {
    width: 10px;
    height: 40px;
    background: var(--secondary);
    border-radius: 5px;
    position: relative;
}

.layer::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    width: 20px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
}

/* Lab 3: Trends */
.trends-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

.trend-card {
    background: rgba(255, 255, 255, 0.03);
    padding: 25px;
    border-radius: 15px;
    border: 1px solid var(--border);
    transition: transform 0.3s;
}

.trend-card:hover {
    transform: translateY(-5px);
    border-color: var(--primary);
}

.icon-wrapper {
    width: 50px;
    height: 50px;
    background: rgba(0, 243, 255, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: var(--primary);
    margin-bottom: 20px;
}

.trend-card h4 {
    margin: 0 0 10px 0;
    font-size: 1.2rem;
    color: #fff;
}

.trend-card p {
    color: var(--text-muted);
    line-height: 1.6;
    font-size: 0.95rem;
    margin: 0;
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

/* RWD */
@media (max-width: 768px) {
    .sim-layout {
        grid-template-columns: 1fr;
    }

    .timeline-container {
        flex-direction: column;
    }

    .era-nav {
        width: 100%;
        flex-direction: row;
        overflow-x: auto;
        padding-bottom: 10px;
    }

    .era-btn {
        min-width: 140px;
    }

    .title {
        font-size: 1.8rem;
    }
}
</style>
