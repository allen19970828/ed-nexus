<script setup>
import { ref, computed, onMounted } from 'vue'
import { animate } from 'motion'

onMounted(() => {
    document.title = 'CDM 認知診斷實驗室 | EdTech-俞良澄';
    animate('.hero-content', { opacity: [0, 1], y: [30, 0] }, { duration: 0.8 });
});

// --- 第一部分：Q-Matrix 邏輯 ---

// 定義 3 個屬性 (Attributes)
const attributes = ['計算能力', '幾何概念', '閱讀理解']

// 定義試題 (Items) 及其對應的 Q-Matrix (初始化為全 0)
// rows 代表試題，cols 代表屬性
const qMatrix = ref([
    { id: 1, name: '試題 1', values: [1, 0, 0] },
    { id: 2, name: '試題 2', values: [0, 1, 1] },
    { id: 3, name: '試題 3', values: [1, 1, 1] }
])

// 切換 Q-Matrix 的值
const toggleQValue = (rowIndex, colIndex) => {
    const currentVal = qMatrix.value[rowIndex].values[colIndex]
    qMatrix.value[rowIndex].values[colIndex] = currentVal === 1 ? 0 : 1
}

// 產生描述文字
const getItemDescription = (row) => {
    const required = row.values
        .map((val, index) => val === 1 ? attributes[index] : null)
        .filter(val => val !== null)

    if (required.length === 0) return '此題不需要任何特定屬性 (或基礎題)'
    return `此題需要精熟：${required.join(' + ')}`
}

// --- 第二部分：DINA/DINO 模擬器邏輯 ---

const modelType = ref('DINA') // 'DINA' or 'DINO'
const slip = ref(0.2) // 粗心參數 s
const guess = ref(0.2) // 猜測參數 g

// 模擬情境：假設某題同時需要「屬性 A」與「屬性 B」
// 我們來計算 4 種學生的答對機率
const studentProfiles = [
    { name: '學霸 (精熟 A, B)', hasA: true, hasB: true },
    { name: '偏科生 (只會 A)', hasA: true, hasB: false },
    { name: '偏科生 (只會 B)', hasA: false, hasB: true },
    { name: '初學者 (都不會)', hasA: false, hasB: false }
]

const chartData = computed(() => {
    return studentProfiles.map(student => {
        let prob = 0

        // 邏輯核心：根據模型計算 P(X=1)
        if (modelType.value === 'DINA') {
            // DINA (Non-compensatory): 必須全會 (AND Gate)
            // 只有當 (hasA && hasB) 都為真，才具備能力
            const hasAllSkills = student.hasA && student.hasB
            prob = hasAllSkills ? (1 - slip.value) : guess.value

        } else {
            // DINO (Compensatory): 只要會一個就行 (OR Gate)
            // 只要 (hasA || hasB) 為真，就具備能力
            const hasAnySkill = student.hasA || student.hasB
            prob = hasAnySkill ? (1 - slip.value) : guess.value
        }

        return {
            ...student,
            prob: parseFloat(prob.toFixed(2)),
            percent: Math.round(prob * 100)
        }
    })
})

const getBarColor = (percent) => {
    if (percent >= 80) return '#06b6d4' // Cyan
    if (percent >= 50) return '#f59e0b' // Orange
    return '#ef4444' // Red
}

// --- 第三部分：模擬診斷與雷達圖 ---

// 1. 定義小測驗 (連結 Q 矩陣)
// 這裡假設 Q 矩陣是固定的：Q1(計算), Q2(幾何), Q3(計算+幾何), Q4(閱讀), Q5(閱讀+幾何)
const quizItems = ref([
    { id: 1, text: '1. 簡單計算題 (23 + 45 = ?)', skills: [0], answer: null }, // 技能 index 0: 計算
    { id: 2, text: '2. 辨識圖形 (這是正方形嗎？)', skills: [1], answer: null }, // 技能 index 1: 幾何
    { id: 3, text: '3. 計算圖形面積 (長x寬)', skills: [0, 1], answer: null }, // 計算 + 幾何
    { id: 4, text: '4. 閱讀長篇題目', skills: [2], answer: null },       // 閱讀
    { id: 5, text: '5. 應用題 (讀懂題目算出面積)', skills: [0, 1, 2], answer: null } // 全部
])

// 2. 計算診斷結果 (簡單的啟發式演算法，用於演示)
const diagnosticResult = computed(() => {
    // 初始化每個屬性的得分 [總分, 得分]
    const stats = attributes.map(() => ({ total: 0, score: 0 }))

    quizItems.value.forEach(item => {
        // 只有當使用者作答了 (answer !== null) 才計算
        if (item.answer !== null) {
            item.skills.forEach(skillIndex => {
                stats[skillIndex].total += 1
                // 如果答對 (1)，該技能得分 +1
                if (item.answer === 1) {
                    stats[skillIndex].score += 1
                }
            })
        }
    })

    // 算出百分比 (如果沒做題，預設給 0.1 避免圖表縮成一點)
    return stats.map(s => s.total === 0 ? 0.1 : (s.score / s.total))
})

// 3. SVG 雷達圖繪製邏輯
const radarPoints = computed(() => {
    const total = attributes.length
    const radius = 100 // 雷達圖半徑
    const center = 100 // 中心點 (100, 100)

    return diagnosticResult.value.map((value, index) => {
        const angle = (Math.PI * 2 * index) / total - (Math.PI / 2) // 從上方開始畫
        // value 範圍 0~1，乘上半徑
        const r = value * radius
        const x = center + r * Math.cos(angle)
        const y = center + r * Math.sin(angle)
        return `${x},${y}`
    }).join(' ')
})

// 背景網格 (外圈)
const radarGrid = computed(() => {
    const total = attributes.length
    const radius = 100
    const center = 100
    return attributes.map((_, index) => {
        const angle = (Math.PI * 2 * index) / total - (Math.PI / 2)
        const x = center + radius * Math.cos(angle)
        const y = center + radius * Math.sin(angle)
        return `${x},${y}`
    }).join(' ')
})

// 屬性標籤位置
const labelPositions = computed(() => {
    const total = attributes.length
    const radius = 125 // 字要在圖外面一點
    const center = 100
    return attributes.map((name, index) => {
        const angle = (Math.PI * 2 * index) / total - (Math.PI / 2)
        const x = center + radius * Math.cos(angle)
        const y = center + radius * Math.sin(angle)
        return { name, x, y }
    })
})

</script>

<template>
    <div class="cdm-page" style="margin-top: 76px;">

        <!-- Hero -->
        <div class="container py-5 hero-content">
            <div class="row align-items-center mb-5">
                <div class="col-lg-10 mx-auto text-center">
                    <span class="badge border border-warning text-warning mb-3 px-3 py-2">Psychometrics</span>
                    <h1 class="display-3 fw-bold text-white mb-3">
                        認知診斷模式 <span class="text-primary-custom">CDM</span>
                    </h1>
                    <h4 class="text-secondary-custom font-monospace mb-4">Cognitive Diagnostic Models</h4>
                    <p class="lead text-gray-300 mx-auto" style="max-width: 800px;">
                        動手操作 Q-Matrix 與機率模型。
                        探索從「結構定義」到「機率運算」的核心邏輯，理解 DINA 與 DINO 模型的本質差異。
                    </p>
                </div>
            </div>
        </div>

        <div class="container pb-5">
            <!-- Section 1: Q-Matrix -->
            <section class="card card-custom p-4 mb-5 border-info">
                <div class="d-flex align-items-center mb-4">
                    <h2 class="h3 text-white fw-bold mb-0"><span class="text-info">01.</span> Q 矩陣編輯器</h2>
                </div>

                <p class="text-gray-400 mb-4">
                    Q 矩陣定義了「試題」與「認知屬性」的關係。<br>
                    請點擊下方的方格，設定該試題是否需要該能力 <span class="text-info">(1=需要, 0=不需要)</span>。
                </p>

                <div class="q-matrix-container bg-black rounded p-2 border border-secondary border-opacity-25">
                    <table class="q-table table table-dark table-hover mb-0">
                        <thead>
                            <tr>
                                <th class="text-white">題目 \ 屬性</th>
                                <th v-for="attr in attributes" :key="attr" class="text-secondary-custom">{{ attr }}</th>
                                <th class="text-white">診斷描述 (即時預覽)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, rIndex) in qMatrix" :key="row.id">
                                <td class="row-header align-middle text-gray-300 font-monospace">{{ row.name }}</td>
                                <td v-for="(val, cIndex) in row.values" :key="cIndex" class="cell-td">
                                    <button class="matrix-btn btn btn-sm"
                                        :class="val === 1 ? 'btn-info' : 'btn-outline-secondary'"
                                        @click="toggleQValue(rIndex, cIndex)">
                                        {{ val }}
                                    </button>
                                </td>
                                <td class="desc-td align-middle text-gray-400 small">{{ getItemDescription(row) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Section 2: Simulator -->
            <section class="card card-custom p-4 border-warning">
                <div class="d-flex align-items-center mb-4">
                    <h2 class="h3 text-white fw-bold mb-0"><span class="text-warning">02.</span> DINA vs. DINO 模型模擬器
                    </h2>
                </div>

                <p class="text-gray-400 mb-4">
                    假設有一道試題需要 <strong>「屬性 A」</strong> 與 <strong>「屬性 B」</strong>。<br>
                    觀察不同模型下，具備不同能力組合的學生，其答對機率如何變化。
                </p>

                <div class="controls bg-dark p-4 rounded mb-4 border border-secondary border-opacity-25">
                    <div class="row g-4">
                        <div class="col-md-4">
                            <label class="form-label text-white fw-bold">選擇模型：</label>
                            <div class="d-flex flex-column gap-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" value="DINA" v-model="modelType"
                                        id="dina">
                                    <label class="form-check-label text-gray-300" for="dina">
                                        <strong class="text-info">DINA</strong> (嚴格/非補償)
                                        <div class="small text-muted">必須都會才算會 (AND)</div>
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" value="DINO" v-model="modelType"
                                        id="dino">
                                    <label class="form-check-label text-gray-300" for="dino">
                                        <strong class="text-warning">DINO</strong> (寬鬆/補償)
                                        <div class="small text-muted">只要會一個就算會 (OR)</div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label text-white">粗心參數 (Slip) s = <span
                                    class="text-danger font-monospace">{{ slip }}</span></label>
                            <input type="range" class="form-range" min="0" max="0.5" step="0.05" v-model.number="slip">
                            <small class="text-muted">明明會卻做錯的機率 (越低越好)</small>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label text-white">猜測參數 (Guess) g = <span
                                    class="text-warning font-monospace">{{ guess }}</span></label>
                            <input type="range" class="form-range" min="0" max="0.5" step="0.05" v-model.number="guess">
                            <small class="text-muted">明明不會卻猜對的機率</small>
                        </div>
                    </div>
                </div>

                <div class="chart-container">
                    <h4 class="text-white text-center mb-4">預測答對機率 P(X=1)</h4>
                    <div class="bars d-flex flex-column gap-3">
                        <div v-for="student in chartData" :key="student.name" class="bar-row d-flex align-items-center">
                            <div class="bar-label text-end text-gray-300 pe-3" style="width: 160px;">
                                <div class="fw-bold">{{ student.name }}</div>
                            </div>
                            <div class="bar-track flex-grow-1 bg-dark rounded-pill overflow-hidden"
                                style="height: 24px;">
                                <div class="bar-fill h-100 d-flex align-items-center justify-content-end px-2 fw-bold text-shadow"
                                    :style="{ width: student.percent + '%', backgroundColor: getBarColor(student.percent), minWidth: '40px' }">
                                    {{ student.percent }}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="explanation mt-4 p-3 rounded"
                        :class="modelType === 'DINA' ? 'bg-info bg-opacity-10 border-start border-4 border-info' : 'bg-warning bg-opacity-10 border-start border-4 border-warning'">
                        <div v-if="modelType === 'DINA'" class="text-gray-300">
                            <strong class="text-info">💡 DINA 解析：</strong> 這是一個「AND」邏輯。
                            你可以看到，除非同時精熟 A 和 B (第一位學生)，否則機率都會降到跟「猜測參數 (g)」一樣低。
                            這模型假設技能之間是<strong>缺一不可</strong>的 (Non-compensatory)。
                        </div>
                        <div v-else class="text-gray-300">
                            <strong class="text-warning">💡 DINO 解析：</strong> 這是一個「OR」邏輯。
                            你可以看到，只要會 A 或會 B (中間兩位學生)，答對機率就跟「全會」的學生一樣高 (1-s)。
                            這模型假設技能之間是可以<strong>互相補償</strong>的 (Compensatory)。
                        </div>
                    </div>
                </div>
            </section>

            <!-- Section 3: Student Diagnosis -->
            <section class="card card-custom p-4 border-success mt-5">
                <div class="d-flex align-items-center mb-4">
                    <h2 class="h3 text-white fw-bold mb-0"><span class="text-success">03.</span> 實戰演練：學生認知診斷</h2>
                </div>
                <p class="text-gray-400 mb-5">
                    請扮演學生作答右側的題目（勾選代表答對，不勾代表答錯）。<br>
                    左側的<strong>雷達圖</strong>會根據 CDM 邏輯，即時分析你的認知狀態。
                </p>

                <div class="diagnosis-layout">
                    <div class="radar-box">
                        <svg viewBox="0 0 200 200" class="radar-svg">
                            <circle cx="100" cy="100" r="20" class="grid-circle" />
                            <circle cx="100" cy="100" r="40" class="grid-circle" />
                            <circle cx="100" cy="100" r="60" class="grid-circle" />
                            <circle cx="100" cy="100" r="80" class="grid-circle" />
                            <circle cx="100" cy="100" r="100" class="grid-circle" />

                            <polygon :points="radarGrid" class="grid-polygon" style="stroke: #4b5563;" />

                            <polygon :points="radarPoints" class="data-polygon" />

                            <text v-for="(label, i) in labelPositions" :key="i" :x="label.x" :y="label.y"
                                text-anchor="middle" dominant-baseline="middle" class="radar-label" fill="#fff"
                                style="font-size: 14px; font-weight: bold;">
                                {{ label.name }}
                            </text>
                        </svg>
                    </div>

                    <div class="quiz-box flex-grow-1 ms-lg-5">
                        <div v-for="item in quizItems" :key="item.id"
                            class="quiz-item d-flex justify-content-between align-items-center mb-3 p-3 rounded border border-secondary border-opacity-25"
                            style="background: rgba(255,255,255,0.02);">
                            <div class="quiz-text">
                                <strong class="text-white d-block mb-1">{{ item.text }}</strong>
                                <div class="item-skills">
                                    <span v-for="s in item.skills" :key="s"
                                        class="badge rounded-pill bg-dark text-secondary border border-secondary border-opacity-25 me-1 small">
                                        {{ attributes[s] }}
                                    </span>
                                </div>
                            </div>
                            <div class="quiz-actions d-flex gap-2">
                                <label class="btn btn-sm btn-outline-success" :class="{ 'active': item.answer === 1 }">
                                    <input type="radio" :name="'q' + item.id" :value="1" v-model="item.answer"
                                        class="d-none">
                                    答對
                                </label>
                                <label class="btn btn-sm btn-outline-danger" :class="{ 'active': item.answer === 0 }">
                                    <input type="radio" :name="'q' + item.id" :value="0" v-model="item.answer"
                                        class="d-none">
                                    答錯
                                </label>
                            </div>
                        </div>
                        <div class="reset-btn-container mt-4">
                            <button @click="quizItems.forEach(i => i.answer = null)"
                                class="btn btn-secondary w-100">重置測驗</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.text-gray-300 {
    color: #d1d5db;
}

.text-gray-400 {
    color: #9ca3af;
}

.text-shadow {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.matrix-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    font-weight: bold;
    font-family: monospace;
}

/* Custom Range Input Style (Optional, builds on Bootstrap) */
.form-range::-webkit-slider-thumb {
    background: var(--neon-cyan);
}

.table-dark {
    --bs-table-bg: transparent;
    --bs-table-hover-bg: rgba(255, 255, 255, 0.05);
}

/* Radar Chart */
.diagnosis-layout {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

.radar-box {
    width: 300px;
    height: 300px;
    flex-shrink: 0;
}

.radar-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
}

.grid-circle {
    fill: none;
    stroke: #4b5563;
    /* Gray-600 */
    stroke-dasharray: 4 2;
    stroke-opacity: 0.5;
}

.grid-polygon {
    fill: none;
    stroke: #6b7280;
    /* Gray-500 */
    stroke-width: 1;
}

.data-polygon {
    fill: rgba(6, 182, 212, 0.3);
    /* Cyan with opacity */
    stroke: #06b6d4;
    /* Cyan */
    stroke-width: 2;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.radar-label {
    fill: #e5e7eb;
    /* Gray-200 */
}
</style>
