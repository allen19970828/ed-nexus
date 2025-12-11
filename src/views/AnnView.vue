<script setup>
import { ref, computed, onMounted } from 'vue'
import { animate } from 'motion'

onMounted(() => {
    document.title = 'ANN 類神經網路實驗室 | EdTech-俞良澄';
    animate('.hero-content', { opacity: [0, 1], y: [30, 0] }, { duration: 0.8 });
    generateGraph()
});

// ==========================================
// Lab 1: 單一神經元 (Perceptron)
// ==========================================
// 模擬公式：Output = Activation( w1*x1 + w2*x2 + b )
const x1 = ref(1.0)
const x2 = ref(0.5)
const w1 = ref(0.5)
const w2 = ref(-0.5)
const bias = ref(0.0)

// 計算加權總和 (Z)
const weightedSum = computed(() => {
    return (x1.value * w1.value) + (x2.value * w2.value) + bias.value
})

// 模擬 Sigmoid 激活函數
const neuronOutput = computed(() => {
    const z = weightedSum.value
    return 1 / (1 + Math.exp(-z))
})

// ==========================================
// Lab 2: 激活函數畫廊 (Activation Functions)
// ==========================================
const selectedActivation = ref('ReLU')
const graphPoints = ref([])

// 產生圖表數據
const generateGraph = () => {
    const points = []
    for (let i = -5; i <= 5; i += 0.2) {
        let y = 0
        if (selectedActivation.value === 'Sigmoid') {
            y = 1 / (1 + Math.exp(-i))
        } else if (selectedActivation.value === 'Tanh') {
            y = Math.tanh(i)
        } else if (selectedActivation.value === 'ReLU') {
            y = Math.max(0, i)
        }
        points.push({ x: i, y: y })
    }
    graphPoints.value = points
}

// 監聽切換
const setActivation = (name) => {
    selectedActivation.value = name
    generateGraph()
}

// SVG Path 生成
const graphPath = computed(() => {
    if (graphPoints.value.length === 0) return ''
    // Mapping: x(-5~5) -> svg(0~300), y(-2~2 or 0~5) -> svg(150~0)
    const mapX = (val) => (val + 5) * 30 // 300px width / 10 units
    const mapY = (val) => {
        // 根據不同函數調整 Y 軸縮放
        if (selectedActivation.value === 'ReLU') return 250 - (val * 40)
        return 150 - (val * 100)
    }

    const d = graphPoints.value.map((p, index) => {
        const command = index === 0 ? 'M' : 'L'
        return `${command} ${mapX(p.x)} ${mapY(p.y)}`
    }).join(' ')
    return d
})

// ==========================================
// Lab 3: CNN 卷積運算 (Convolution)
// ==========================================
// 一個 5x5 的輸入矩陣 (代表圖片像素)
const inputGrid = ref([
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
])

// 一個 3x3 的卷積核 (Kernel/Filter) - 垂直邊緣檢測
const kernel = ref([
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1]
])

// 當前掃描位置 (左上角)
const scanPos = ref({ r: 0, c: 0 })

// 計算卷積結果 (Feature Map)
const featureMap = computed(() => {
    const size = 3 // 輸出 3x3
    let map = []
    for (let r = 0; r < size; r++) {
        let row = []
        for (let c = 0; c < size; c++) {
            // 進行局部卷積運算
            let sum = 0
            for (let kr = 0; kr < 3; kr++) {
                for (let kc = 0; kc < 3; kc++) {
                    sum += inputGrid.value[r + kr][c + kc] * kernel.value[kr][kc]
                }
            }
            row.push(sum)
        }
        map.push(row)
    }
    return map
})

// 移動掃描窗口
const stepScan = () => {
    let c = scanPos.value.c + 1
    let r = scanPos.value.r
    if (c > 2) {
        c = 0
        r += 1
    }
    if (r > 2) {
        r = 0
    }
    scanPos.value = { r, c }
}

// 判斷格子是否在當前掃描範圍內
const isInScan = (r, c) => {
    const pr = scanPos.value.r
    const pc = scanPos.value.c
    return r >= pr && r < pr + 3 && c >= pc && c < pc + 3
}

// 取得當前掃描的計算過程字串
const calculationText = computed(() => {
    const pr = scanPos.value.r
    const pc = scanPos.value.c
    let parts = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const val = inputGrid.value[pr + i][pc + j]
            const kVal = kernel.value[i][j]
            if (val !== 0 || kVal !== 0) parts.push(`(${val}×${kVal})`)
        }
    }
    const sum = featureMap.value[pr][pc]
    return `${parts.join(' + ')} = ${sum}`
})

</script>

<template>
    <div class="ann-page" style="margin-top: 76px;">

        <!-- Hero Section -->
        <div class="container py-5 hero-content">
            <div class="row align-items-center mb-5">
                <div class="col-lg-10 mx-auto text-center">
                    <span class="badge border border-info text-info mb-3 px-3 py-2">Deep Learning</span>
                    <h1 class="display-3 fw-bold text-white mb-3">
                        類神經網路 <span class="text-primary-custom">ANN</span>
                    </h1>
                    <h4 class="text-secondary-custom font-monospace mb-4">Neural Networks & Deep Learning</h4>
                    <p class="lead text-gray-300 mx-auto" style="max-width: 800px;">
                        從神經元到深度學習。拆解黑盒子的運作原理，親自動手實驗「權重」、「激活函數」與「卷積運算」。
                    </p>
                </div>
            </div>
        </div>

        <div class="container pb-5">

            <!-- Section 1: Neuron Anatomy -->
            <section class="card card-custom p-4 mb-5 border-info">
                <div
                    class="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                    <h2 class="h3 text-white fw-bold mb-0">1. 神經元解剖 (The Neuron)</h2>
                    <span
                        class="badge bg-info bg-opacity-10 text-info border border-info font-monospace">Perceptron</span>
                </div>
                <p class="text-gray-400 mb-4">
                    這是模仿生物神經元的數學模型。輸入訊號 <span class="text-white">(x)</span> 經過權重 <span class="text-warning">(w)</span>
                    加權，加上偏差 <span class="text-white">(b)</span> 後，通過激活函數輸出。<br>
                    試著調整權重，看看如何控制神經元的「興奮度」。
                </p>

                <div class="neuron-lab row g-4 align-items-center">
                    <div class="col-md-4">
                        <div class="controls bg-dark p-4 rounded border border-secondary border-opacity-25">
                            <div class="control-group mb-3">
                                <label class="form-label text-white d-flex justify-content-between"><span>Input
                                        x1</span> <span class="text-info">{{ x1 }}</span></label>
                                <input type="range" class="form-range" v-model.number="x1" min="0" max="1" step="0.1">
                            </div>
                            <div class="control-group mb-4">
                                <label class="form-label text-white d-flex justify-content-between"><span>Weight
                                        w1</span> <span class="text-warning fw-bold">{{ w1 }}</span></label>
                                <input type="range" class="form-range" v-model.number="w1" min="-5" max="5" step="0.1">
                            </div>
                            <hr class="border-secondary opacity-25">
                            <div class="control-group mb-3">
                                <label class="form-label text-white d-flex justify-content-between"><span>Input
                                        x2</span> <span class="text-info">{{ x2 }}</span></label>
                                <input type="range" class="form-range" v-model.number="x2" min="0" max="1" step="0.1">
                            </div>
                            <div class="control-group mb-4">
                                <label class="form-label text-white d-flex justify-content-between"><span>Weight
                                        w2</span> <span class="text-warning fw-bold">{{ w2 }}</span></label>
                                <input type="range" class="form-range" v-model.number="w2" min="-5" max="5" step="0.1">
                            </div>
                            <hr class="border-secondary opacity-25">
                            <div class="control-group">
                                <label class="form-label text-white d-flex justify-content-between"><span>Bias b</span>
                                    <span class="text-white fw-bold">{{ bias }}</span></label>
                                <input type="range" class="form-range" v-model.number="bias" min="-5" max="5"
                                    step="0.1">
                            </div>
                        </div>
                    </div>

                    <div class="col-md-8">
                        <div
                            class="visualizer bg-black rounded p-3 d-flex justify-content-center border border-secondary border-opacity-25">
                            <svg viewBox="0 0 400 200" class="neuron-svg w-100" style="max-height: 250px;">
                                <defs>
                                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6"
                                        markerHeight="6" orient="auto-start-reverse">
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                                    </marker>
                                </defs>
                                <!-- Connections -->
                                <line x1="50" y1="50" x2="200" y2="100" stroke="#475569"
                                    :stroke-width="Math.abs(w1) * 2 + 1" :stroke-opacity="Math.abs(w1) / 5 + 0.2" />
                                <line x1="50" y1="150" x2="200" y2="100" stroke="#475569"
                                    :stroke-width="Math.abs(w2) * 2 + 1" :stroke-opacity="Math.abs(w2) / 5 + 0.2" />

                                <!-- Inputs Nodes -->
                                <circle cx="50" cy="50" r="20" fill="#0f172a" stroke="#06b6d4" stroke-width="2" />
                                <text x="50" y="55" text-anchor="middle" class="node-text" fill="#fff"
                                    font-weight="bold">x1</text>
                                <circle cx="50" cy="150" r="20" fill="#0f172a" stroke="#06b6d4" stroke-width="2" />
                                <text x="50" y="155" text-anchor="middle" class="node-text" fill="#fff"
                                    font-weight="bold">x2</text>

                                <!-- Summation Node -->
                                <circle cx="200" cy="100" r="40"
                                    :fill="weightedSum > 0 ? 'rgba(245, 158, 11, 0.2)' : '#0f172a'" stroke="#f59e0b"
                                    stroke-width="3" />
                                <text x="200" y="90" text-anchor="middle" fill="#d1d5db" font-size="12">Σ + b</text>
                                <text x="200" y="115" text-anchor="middle" fill="#f59e0b" font-weight="bold"
                                    font-size="16">{{ weightedSum.toFixed(2) }}</text>

                                <!-- Output Arrow -->
                                <line x1="245" y1="100" x2="330" y2="100" stroke="#f59e0b" stroke-width="2"
                                    marker-end="url(#arrow)" />

                                <!-- Output Box (Activation) -->
                                <rect x="330" y="75" width="60" height="50" rx="8" fill="#10b981" stroke="#059669"
                                    stroke-width="2" />
                                <text x="360" y="100" text-anchor="middle" fill="white" font-weight="bold"
                                    font-size="16">{{ neuronOutput.toFixed(2) }}</text>
                                <text x="360" y="118" text-anchor="middle" font-size="10" fill="#064e3b"
                                    font-weight="bold">Sigmoid</text>
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Section 2: Activation Functions -->
            <section class="card card-custom p-4 mb-5 border-primary">
                <div
                    class="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                    <h2 class="h3 text-white fw-bold mb-0">2. 激活函數 (Non-linearity)</h2>
                    <span
                        class="badge bg-primary bg-opacity-10 text-primary-custom border border-primary font-monospace">Activation
                        Function</span>
                </div>
                <p class="text-gray-400 mb-4">
                    為什麼神經網路能解決複雜問題？關鍵在於「非線性」。<br>
                    <strong>ReLU</strong> 解決了深層網路的梯度消失問題；<strong>Sigmoid</strong> 則常用於機率輸出。
                </p>

                <div class="activation-lab d-flex flex-column align-items-center">

                    <div class="btn-group mb-4" role="group">
                        <button type="button" class="btn btn-outline-secondary" @click="setActivation('Sigmoid')"
                            :class="{ active: selectedActivation === 'Sigmoid' }">Sigmoid</button>
                        <button type="button" class="btn btn-outline-secondary" @click="setActivation('Tanh')"
                            :class="{ active: selectedActivation === 'Tanh' }">Tanh</button>
                        <button type="button" class="btn btn-outline-secondary" @click="setActivation('ReLU')"
                            :class="{ active: selectedActivation === 'ReLU' }">ReLU</button>
                    </div>

                    <div class="graph-container row g-4 w-100 justify-content-center">
                        <div class="col-md-6 col-lg-5">
                            <div class="bg-white rounded p-3 border border-secondary border-opacity-25"
                                style="background: rgba(255,255,255,0.05) !important;">
                                <svg viewBox="0 0 300 300" class="graph-svg w-100">
                                    <!-- Grid/Axis -->
                                    <line x1="0" y1="150" x2="300" y2="150" stroke="#64748b" stroke-width="1" />
                                    <line x1="150" y1="0" x2="150" y2="300" stroke="#64748b" stroke-width="1" />

                                    <!-- Graph Path -->
                                    <path :d="graphPath" fill="none" stroke="#06b6d4" stroke-width="4"
                                        stroke-linecap="round" stroke-linejoin="round" />

                                    <text x="280" y="140" font-size="14" fill="#94a3b8">x</text>
                                    <text x="160" y="20" font-size="14" fill="#94a3b8">y</text>
                                </svg>
                            </div>
                        </div>

                        <div class="col-md-6 col-lg-5">
                            <div class="graph-info bg-dark p-4 rounded border border-info border-opacity-50 h-100">
                                <h3 class="text-info border-bottom border-secondary border-opacity-25 pb-2 mb-3">{{
                                    selectedActivation }}</h3>
                                <p class="text-gray-300" v-if="selectedActivation === 'ReLU'">
                                    <strong class="text-white">特性：</strong> <span class="font-monospace">f(x) = max(0,
                                        x)</span><br><br>
                                    計算極快，解決了梯度消失問題 (右半邊梯度恆為 1)，是現代深度學習的首選。負值區雖為 0 (Dead ReLU)，但通常無傷大雅。
                                </p>
                                <p class="text-gray-300" v-if="selectedActivation === 'Sigmoid'">
                                    <strong class="text-white">特性：</strong> 將數值壓縮在 0 到 1 之間。<br><br>
                                    S 型曲線。常用於二元分類的最後一層 (機率輸出)。但在深層網路中，兩端極小的梯度會導致「梯度消失」，使模型難以訓練。
                                </p>
                                <p class="text-gray-300" v-if="selectedActivation === 'Tanh'">
                                    <strong class="text-white">特性：</strong> 將數值壓縮在 -1 到 1 之間。<br><br>
                                    類似 Sigmoid 但以 0 為中心 (Zero-centered)。這使得收斂速度通常比 Sigmoid 快，但也同樣有梯度消失問題。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Section 3: CNN Scanner -->
            <section class="card card-custom p-4 border-pink" style="border-color: #ec4899 !important;">
                <div
                    class="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                    <h2 class="h3 text-white fw-bold mb-0">3. 卷積運算 (Convolution Scanner)</h2>
                    <span class="badge bg-danger bg-opacity-10 text-danger border border-danger font-monospace"
                        style="color: #ec4899 !important; border-color: #ec4899 !important;">CNN / Computer
                        Vision</span>
                </div>
                <p class="text-gray-400 mb-4">
                    CNN 如何「看」圖片？它使用一個小小的 <strong class="text-white">Kernel (過濾器)</strong> 在圖片上滑動。<br>
                    下方的例子是一個「垂直邊緣檢測器」。點擊「單步掃描」觀察運算過程。
                </p>

                <div class="cnn-layout d-flex flex-wrap justify-content-center gap-4 align-items-center">

                    <!-- Input Grid -->
                    <div class="grid-box text-center">
                        <h5 class="text-secondary-custom mb-3 small font-monospace">INPUT IMAGE (5x5)</h5>
                        <div class="grid input-grid p-1 bg-secondary bg-opacity-25 rounded border border-secondary">
                            <div v-for="(row, r) in inputGrid" :key="r" class="d-flex">
                                <div v-for="(val, c) in row" :key="c"
                                    class="cell d-flex align-items-center justify-content-center border border-dark rounded-1 m-1 fw-bold"
                                    style="width: 40px; height: 40px; transition: all 0.3s;" :style="{
                                        backgroundColor: val === 1 ? '#e2e8f0' : '#1e293b',
                                        color: val === 1 ? '#0f172a' : '#64748b',
                                        transform: isInScan(r, c) ? 'scale(0.95)' : 'scale(1)',
                                        borderColor: isInScan(r, c) ? '#ec4899 !important' : ''
                                    }" :class="{ 'scanning-border': isInScan(r, c) }">
                                    {{ val }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Operator -->
                    <div class="operator d-flex flex-column align-items-center gap-3">
                        <div
                            class="kernel-display text-center p-3 rounded bg-black border border-secondary border-opacity-50">
                            <h5 class="text-secondary-custom mb-2 small font-monospace">KERNEL (3x3)</h5>
                            <div class="d-inline-block border border-secondary border-opacity-50 p-1 rounded">
                                <div v-for="(row, r) in kernel" :key="r" class="d-flex">
                                    <div v-for="(val, c) in row" :key="c"
                                        class="d-flex align-items-center justify-content-center border border-secondary border-opacity-25 bg-dark text-white fw-bold m-1"
                                        style="width: 25px; height: 25px; font-size: 12px;">
                                        {{ val }}
                                    </div>
                                </div>
                            </div>
                            <p class="small text-gray-400 mt-2 mb-0">垂直邊緣檢測</p>
                        </div>

                        <i class="bi bi-arrow-right display-6 text-gray-400 d-none d-lg-block"></i>
                        <i class="bi bi-arrow-down display-6 text-gray-400 d-lg-none"></i>

                        <button class="btn btn-danger w-100 fw-bold" @click="stepScan"
                            style="background-color: #ec4899; border-color: #ec4899;">
                            <i class="bi bi-play-fill me-1"></i> 單步掃描
                        </button>
                    </div>

                    <!-- Output Grid -->
                    <div class="grid-box text-center">
                        <h5 class="text-secondary-custom mb-3 small font-monospace">FEATURE MAP (3x3)</h5>
                        <div class="grid output-grid p-1 bg-secondary bg-opacity-25 rounded border border-secondary">
                            <div v-for="(row, r) in featureMap" :key="r" class="d-flex">
                                <div v-for="(val, c) in row" :key="c"
                                    class="cell d-flex align-items-center justify-content-center border border-dark rounded-1 m-1 fw-bold"
                                    style="width: 40px; height: 40px; transition: all 0.3s;" :style="{
                                        backgroundColor: r === scanPos.r && c === scanPos.c ? '#fce7f3' : '#1e293b',
                                        color: r === scanPos.r && c === scanPos.c ? '#be185d' : '#94a3b8',
                                        borderColor: r === scanPos.r && c === scanPos.c ? '#ec4899' : ''
                                    }">
                                    {{ val }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="math-log mt-4 p-3 rounded bg-black border border-secondary border-opacity-25 text-center font-monospace small">
                    <span class="text-gray-400 me-2">運算過程:</span>
                    <span class="text-white">{{ calculationText }}</span>
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

.scanning-border {
    border: 2px solid #ec4899 !important;
    z-index: 10;
}

/* Custom Range Input Style */
.form-range::-webkit-slider-thumb {
    background: var(--neon-cyan);
}
</style>
