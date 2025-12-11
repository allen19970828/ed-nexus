<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { animate } from 'motion'

onMounted(() => {
    document.title = 'CTT 古典測驗理論實驗室 | EdTech-俞良澄';
    animate('.hero-content', { opacity: [0, 1], y: [30, 0] }, { duration: 0.8 });

    // Initial data generation
    simulateTest()
    generateReliabilityData()
});

// ==========================================
// 1. 真分數模型 (O = T + E)
// ==========================================
const trueScore = ref(75)    // 真分數 T
const errorRange = ref(10)   // 誤差範圍 (標準差)
const currentError = ref(0)  // 當前隨機產生的誤差 E

// 產生一個符合常態分佈的隨機誤差 (Box-Muller transform)
const generateNormalRandom = (mean, std) => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * std + mean;
}

const simulateTest = () => {
    // 產生一個隨機誤差，並四捨五入
    const err = Math.round(generateNormalRandom(0, errorRange.value))
    currentError.value = err
}

const observedScore = computed(() => {
    let score = trueScore.value + currentError.value
    // 分數限制在 0-100
    return Math.min(100, Math.max(0, score))
})

// ==========================================
// 2. 信度沙盒 (Reliability / Scatter Plot)
// ==========================================
const noiseLevel = ref(5) // 測量雜訊 (影響信度)
const reliabilityData = ref([])
const correlation = ref(0)

// 生成 50 位虛擬學生數據
const generateReliabilityData = () => {
    const data = []
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0
    const n = 50

    for (let i = 0; i < n; i++) {
        // 每個學生的「真實能力」是固定的 (50-90之間)
        const trueAbility = 50 + Math.random() * 40

        // 第一次測驗：真實能力 + 隨機誤差
        const score1 = Math.min(100, Math.max(0, Math.round(trueAbility + generateNormalRandom(0, noiseLevel.value))))

        // 第二次測驗 (重測)：真實能力 + 另一次隨機誤差
        const score2 = Math.min(100, Math.max(0, Math.round(trueAbility + generateNormalRandom(0, noiseLevel.value))))

        data.push({ x: score1, y: score2 })

        // 計算相關係數所需的累加值
        sumX += score1
        sumY += score2
        sumXY += score1 * score2
        sumX2 += score1 * score1
        sumY2 += score2 * score2
    }

    reliabilityData.value = data

    // 計算 Pearson 相關係數 (r)
    const numerator = (n * sumXY) - (sumX * sumY)
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
    correlation.value = denominator === 0 ? 0 : (numerator / denominator).toFixed(3)
}

// 當雜訊改變時，重新生成數據
watch(noiseLevel, () => {
    generateReliabilityData()
})

// ==========================================
// 3. 試題分析 (難度 P 與 鑑別度 D)
// ==========================================
// 6位學生，3道題目 (1=答對, 0=答錯)
const gradeBook = ref([
    { name: '學生 A (學霸)', scores: [1, 1, 1] },
    { name: '學生 B (優秀)', scores: [1, 1, 0] },
    { name: '學生 C (中等)', scores: [1, 0, 1] },
    { name: '學生 D (中等)', scores: [0, 1, 0] },
    { name: '學生 E (落後)', scores: [0, 0, 1] },
    { name: '學生 F (落後)', scores: [0, 0, 0] }
])

const items = ['第一題', '第二題', '第三題']

// 切換分數
const toggleScore = (studentIndex, itemIndex) => {
    const val = gradeBook.value[studentIndex].scores[itemIndex]
    gradeBook.value[studentIndex].scores[itemIndex] = val === 1 ? 0 : 1
}

// 計算每位學生的總分
const studentTotals = computed(() => {
    return gradeBook.value.map((s, index) => ({
        index,
        total: s.scores.reduce((a, b) => a + b, 0)
    }))
})

// 計算試題統計量 (P值 和 D值)
const itemStats = computed(() => {
    const N = gradeBook.value.length
    // 1. 根據總分排序找出高分組與低分組 (這裡簡化：前3名高分組，後3名低分組)
    // 注意：實際運算要處理同分狀況，這裡為了教學簡化直接切半
    const sortedStudents = [...studentTotals.value].sort((a, b) => b.total - a.total)
    const highGroupIndices = sortedStudents.slice(0, 3).map(s => s.index)
    const lowGroupIndices = sortedStudents.slice(3, 6).map(s => s.index)

    return items.map((_, itemIndex) => {
        // 計算全體答對率 (難度 P)
        const totalCorrect = gradeBook.value.reduce((sum, s) => sum + s.scores[itemIndex], 0)
        const pValue = totalCorrect / N

        // 計算高分組答對率 (Ph)
        const correctHigh = highGroupIndices.reduce((sum, idx) => sum + gradeBook.value[idx].scores[itemIndex], 0)
        const pHigh = correctHigh / 3

        // 計算低分組答對率 (Pl)
        const correctLow = lowGroupIndices.reduce((sum, idx) => sum + gradeBook.value[idx].scores[itemIndex], 0)
        const pLow = correctLow / 3

        // 計算鑑別度 (D = Ph - Pl)
        const dValue = pHigh - pLow

        return {
            p: pValue.toFixed(2),
            d: dValue.toFixed(2),
            pHigh,
            pLow
        }
    })
})

const getDifficultyText = (p) => {
    if (p > 0.8) return '太簡單'
    if (p < 0.2) return '太難'
    return '適中'
}

const getDiscriminationText = (d) => {
    if (d >= 0.4) return '優良'
    if (d >= 0.2) return '尚可'
    if (d < 0) return '反向 (有問題?)'
    return '不佳'
}

</script>

<template>
    <div class="ctt-page" style="margin-top: 76px;">

        <!-- Hero Section -->
        <div class="container py-5 hero-content">
            <div class="row align-items-center mb-5">
                <div class="col-lg-10 mx-auto text-center">
                    <span class="badge border border-primary text-primary-custom mb-3 px-3 py-2">Psychometrics</span>
                    <h1 class="display-3 fw-bold text-white mb-3">
                        古典測驗理論 <span class="text-info">CTT</span>
                    </h1>
                    <h4 class="text-secondary-custom font-monospace mb-4">Classical Test Theory</h4>
                    <p class="lead text-gray-300 mx-auto" style="max-width: 800px;">
                        從真分數模型到試題分析。透過互動實驗，探索測驗分數背後的數學原理與統計意義。
                        理解信度如何受隨機誤差影響，以及如何找出「好題目」。
                    </p>
                </div>
            </div>
        </div>

        <div class="container pb-5">

            <!-- Section 1: True Score Model -->
            <section class="card card-custom p-4 mb-5 border-primary">
                <div
                    class="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                    <h2 class="h3 text-white fw-bold mb-0">1. 真分數模型模擬器</h2>
                    <span
                        class="badge bg-primary bg-opacity-10 text-primary-custom border border-primary font-monospace">O
                        = T + E</span>
                </div>
                <p class="text-gray-400 mb-4">
                    假設一個學生的「真實能力」是固定的，但每次考試都會受到身心狀況、運氣等「誤差」影響。<br>
                    試著調整誤差範圍，並點擊「重新施測」，觀察觀測分數的變化。
                </p>

                <div class="simulation-box bg-black rounded p-4 border border-secondary border-opacity-25">
                    <div class="row gx-5 align-items-end">
                        <div class="col-md-6 mb-4 mb-md-0">
                            <div class="mb-3">
                                <label class="form-label text-white">真實分數 (T): <span
                                        class="text-primary-custom fw-bold">{{ trueScore }}</span></label>
                                <input type="range" class="form-range" v-model.number="trueScore" min="0" max="100">
                            </div>
                            <div class="mb-4">
                                <label class="form-label text-white">誤差範圍 (E 的標準差): +/- <span
                                        class="text-danger fw-bold">{{ errorRange }}</span></label>
                                <input type="range" class="form-range" v-model.number="errorRange" min="0" max="20">
                            </div>
                            <button class="btn btn-primary w-100 fw-bold" @click="simulateTest">重新施測 (模擬考試)</button>
                        </div>

                        <div class="col-md-6">
                            <div
                                class="visual-equation d-flex align-items-center justify-content-center gap-2 flex-wrap">
                                <div class="eq-part text-center">
                                    <span class="small text-muted d-block mb-1 font-monospace">TRUE</span>
                                    <div
                                        class="num-box border border-primary text-primary-custom fs-2 fw-bold d-flex align-items-center justify-content-center rounded bg-dark">
                                        {{ trueScore }}</div>
                                </div>
                                <div class="eq-symbol text-muted fs-4">+</div>
                                <div class="eq-part text-center">
                                    <span class="small text-muted d-block mb-1 font-monospace">ERROR</span>
                                    <div class="num-box border fs-2 fw-bold d-flex align-items-center justify-content-center rounded"
                                        :class="currentError >= 0 ? 'border-success text-success bg-success bg-opacity-10' : 'border-danger text-danger bg-danger bg-opacity-10'">
                                        {{ currentError > 0 ? '+' : '' }}{{ currentError }}
                                    </div>
                                </div>
                                <div class="eq-symbol text-muted fs-4">=</div>
                                <div class="eq-part text-center">
                                    <span class="small text-muted d-block mb-1 font-monospace">OBSERVED</span>
                                    <div
                                        class="num-box border border-light text-white fs-2 fw-bold d-flex align-items-center justify-content-center rounded bg-secondary bg-opacity-25">
                                        {{ observedScore }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Section 2: Reliability Sandbox -->
            <section class="card card-custom p-4 mb-5 border-info">
                <div
                    class="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                    <h2 class="h3 text-white fw-bold mb-0">2. 信度視覺化 (Test-Retest)</h2>
                    <span
                        class="badge bg-info bg-opacity-10 text-info border border-info font-monospace">Reliablity</span>
                </div>
                <p class="text-gray-400 mb-4">
                    信度代表測驗的「穩定性」。我們模擬 50 位學生進行兩次測驗。<br>
                    當測驗的「隨機誤差 (Noise)」越大，兩次測驗的結果就越不一致，相關係數 ($r$) 就越低。
                </p>

                <div class="sandbox-layout row g-4">
                    <div class="col-md-5 d-flex flex-column">
                        <div class="bg-dark p-4 rounded border border-secondary border-opacity-25 flex-grow-1">
                            <label class="form-label text-white mb-2">測量雜訊 (Noise Level): <span
                                    class="text-warning fw-bold">{{ noiseLevel }}</span></label>
                            <input type="range" class="form-range mb-4" v-model.number="noiseLevel" min="0" max="25"
                                step="1">

                            <div class="alert alert-custom mb-4"
                                :class="noiseLevel < 5 ? 'alert-success border-success text-success' : (noiseLevel > 15 ? 'alert-danger border-danger text-danger' : 'alert-warning border-warning text-warning')"
                                style="background: rgba(0,0,0,0.2);">
                                <div v-if="noiseLevel < 5">
                                    <i class="bi bi-check-circle-fill me-2"></i><strong>雜訊極低：</strong>
                                    兩次考試分數幾乎一樣，信度極高 (r ≈ 1.0)。點都在直線上。
                                </div>
                                <div v-else-if="noiseLevel > 15">
                                    <i class="bi bi-exclamation-triangle-fill me-2"></i><strong>雜訊很高：</strong>
                                    運氣成分重，第一次考得好不代表第二次考得好。點散得很開，信度低。
                                </div>
                                <div v-else>
                                    <i class="bi bi-info-circle-fill me-2"></i><strong>雜訊適中：</strong>
                                    有些許誤差，但整體趨勢仍一致。
                                </div>
                            </div>

                            <div
                                class="stat-box bg-black p-3 rounded d-flex justify-content-between align-items-center mt-auto border border-secondary border-opacity-50">
                                <span class="text-gray-300">相關係數 (信度 r)</span>
                                <strong class="fs-4 text-info">{{ correlation }}</strong>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-7">
                        <div class="chart-area bg-white rounded p-3 d-flex justify-content-center align-items-center h-100"
                            style="min-height: 300px;">
                            <svg viewBox="0 0 320 320" class="scatter-plot w-100 h-100" style="max-height: 400px;">
                                <!-- Axes -->
                                <line x1="20" y1="300" x2="300" y2="300" stroke="#ccc" />
                                <line x1="20" y1="300" x2="20" y2="20" stroke="#ccc" />
                                <text x="150" y="315" font-size="12" fill="#666" text-anchor="middle">第一次測驗分數</text>
                                <text x="10" y="150" font-size="12" fill="#666" transform="rotate(-90 10,150)"
                                    text-anchor="middle">第二次測驗分數</text>

                                <!-- Data Points -->
                                <circle v-for="(point, i) in reliabilityData" :key="i" :cx="20 + point.x * 2.8"
                                    :cy="300 - point.y * 2.8" r="4" fill="rgba(6, 182, 212, 0.6)" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Section 3: Item Analysis -->
            <section class="card card-custom p-4 border-warning">
                <div
                    class="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                    <h2 class="h3 text-white fw-bold mb-0">3. 試題分析計算機</h2>
                    <span class="badge bg-warning bg-opacity-10 text-warning border border-warning font-monospace">Item
                        Analysis</span>
                </div>
                <p class="text-gray-400 mb-4">
                    點擊下方表格修改學生的答題狀況 <span class="text-success">(1=對)</span> / <span
                        class="text-danger">(0=錯)</span>。<br>
                    觀察下方統計數據如何變化。系統會自動將學生分為高分組與低分組來計算鑑別度。
                </p>

                <div class="table-responsive bg-black rounded p-2 border border-secondary border-opacity-25">
                    <table class="data-table table table-dark table-hover mb-0 align-middle">
                        <thead>
                            <tr>
                                <th class="text-white">學生姓名</th>
                                <th v-for="(item, i) in items" :key="i" class="text-center text-secondary-custom">{{
                                    item }}</th>
                                <th class="text-center text-white">總分</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(student, sIdx) in gradeBook" :key="sIdx">
                                <td class="text-gray-300 font-monospace">{{ student.name }}</td>
                                <td v-for="(score, iIdx) in student.scores" :key="iIdx" class="text-center">
                                    <button
                                        class="btn btn-sm d-inline-flex align-items-center justify-content-center p-0"
                                        style="width: 30px; height: 30px;"
                                        :class="score === 1 ? 'btn-success' : 'btn-outline-danger'"
                                        @click="toggleScore(sIdx, iIdx)">
                                        {{ score }}
                                    </button>
                                </td>
                                <td class="text-center fw-bold text-white">{{ studentTotals[sIdx].total }}</td>
                            </tr>
                        </tbody>
                        <tfoot class="border-top border-secondary">
                            <tr class="stat-row  bg-opacity-5">
                                <td class="text-info"><strong>難度 (P)</strong><br><small class="text-muted"
                                        style="font-size: 0.7em;">越靠近1越簡單</small></td>
                                <td v-for="(stat, i) in itemStats" :key="'p' + i" class="text-center py-3">
                                    <div class="fw-bold text-white fs-5">{{ stat.p }}</div>
                                    <span
                                        class="badge bg-secondary bg-opacity-25 text-gray-300 border border-secondary border-opacity-25 rounded-pill">{{
                                            getDifficultyText(stat.p) }}</span>
                                </td>
                                <td></td>
                            </tr>
                            <tr class="stat-row">
                                <td class="text-warning"><strong>鑑別度 (D)</strong><br><small class="text-muted"
                                        style="font-size: 0.7em;">高分組 - 低分組</small></td>
                                <td v-for="(stat, i) in itemStats" :key="'d' + i" class="text-center py-3">
                                    <div class="fw-bold fs-5" :class="stat.d < 0.2 ? 'text-danger' : 'text-success'">
                                        {{ stat.d }}
                                    </div>
                                    <span class="badge rounded-pill"
                                        :class="stat.d >= 0.4 ? 'bg-success bg-opacity-10 text-success border border-success' : (stat.d < 0.2 ? 'bg-danger bg-opacity-10 text-danger border border-danger' : 'bg-warning bg-opacity-10 text-warning border border-warning')">
                                        {{ getDiscriminationText(stat.d) }}
                                    </span>
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
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

.num-box {
    width: 80px;
    height: 80px;
}

/* Custom Range Input Style */
.form-range::-webkit-slider-thumb {
    background: var(--neon-cyan);
}

.table-dark {
    --bs-table-bg: transparent;
    --bs-table-hover-bg: rgba(255, 255, 255, 0.05);
}
</style>
