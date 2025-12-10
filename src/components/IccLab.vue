<script setup>
import { ref, computed } from 'vue';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';

// 註冊 Chart.js 模組
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- 1. IRT 參數 ---
const params = ref({
    a: 1.0, // 鑑別度
    b: 0.0, // 難度
    c: 0.0, // 猜測度
    d: 1.0  // 失誤率 (4PL)
});

// --- 2. 快速設定按鈕 ---
const setModel = (type) => {
    switch (type) {
        case 'Rasch': params.value = { a: 1.0, b: 0.0, c: 0.0, d: 1.0 }; break;
        case '2PL': params.value = { a: 1.5, b: 0.5, c: 0.0, d: 1.0 }; break;
        case '3PL': params.value = { a: 1.2, b: 1.0, c: 0.25, d: 1.0 }; break;
        case 'Perfect': params.value = { a: 3.0, b: 0.0, c: 0.0, d: 1.0 }; break;
    }
};

// --- 3. 數學公式核心 ---
// P(θ) = c + (d - c) * (e^a(θ-b) / (1 + e^a(θ-b)))
const calculateProb = (theta, { a, b, c, d }) => {
    const L = a * (theta - b);
    const logistic = Math.exp(L) / (1 + Math.exp(L));
    return c + (d - c) * logistic;
};

// --- 4. 產生圖表數據 ---
const chartData = computed(() => {
    const labels = [];
    const dataPoints = [];
    // 計算 θ 從 -4 到 +4
    for (let t = -40; t <= 40; t += 2) {
        const theta = t / 10;
        labels.push(theta.toFixed(1));
        dataPoints.push(calculateProb(theta, params.value));
    }
    return {
        labels,
        datasets: [{
            label: '正確答題機率 P(θ)',
            data: dataPoints,
            borderColor: '#06b6d4', // Neon Cyan
            backgroundColor: 'rgba(6, 182, 212, 0.2)',
            borderWidth: 3,
            pointRadius: 0, // 線條平滑，不顯示點
            tension: 0.4    // 貝茲曲線
        }]
    };
});

// --- 5. 圖表外觀設定 ---
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
        legend: { labels: { color: '#fff' } },
        tooltip: {
            backgroundColor: 'rgba(11, 15, 25, 0.9)',
            titleColor: '#06b6d4',
            bodyColor: '#fff',
            borderColor: '#8b5cf6',
            borderWidth: 1
        }
    },
    scales: {
        x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#9ca3af' },
            title: { display: true, text: '能力值 (θ) Theta', color: '#fff' }
        },
        y: {
            min: 0, max: 1,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#06b6d4' },
            title: { display: true, text: '機率 Probability', color: '#06b6d4' }
        }
    }
};
</script>

<template>
    <div class="card card-custom p-4 h-100">
        <div class="row h-100">
            <div class="col-lg-4 border-end border-secondary border-opacity-25 pe-lg-4 d-flex flex-column">
                <h4 class="text-white fw-bold mb-4"><i class="bi bi-sliders me-2"></i>參數控制台</h4>

                <div class="btn-group w-100 mb-4">
                    <button @click="setModel('Rasch')" class="btn btn-sm btn-outline-custom">Rasch</button>
                    <button @click="setModel('2PL')" class="btn btn-sm btn-outline-custom">2PL</button>
                    <button @click="setModel('3PL')" class="btn btn-sm btn-outline-custom">3PL</button>
                    <button @click="setModel('Perfect')" class="btn btn-sm btn-outline-warning">理想題</button>
                </div>

                <div class="mb-3">
                    <div class="d-flex justify-content-between text-info mb-1"><label>難度 (b)</label><span
                            class="font-monospace">{{ params.b }}</span></div>
                    <input type="range" class="form-range cyber-range" min="-3" max="3" step="0.1"
                        v-model.number="params.b">
                </div>
                <div class="mb-3">
                    <div class="d-flex justify-content-between text-warning mb-1"><label>鑑別度 (a)</label><span
                            class="font-monospace">{{ params.a }}</span></div>
                    <input type="range" class="form-range cyber-range" min="0.1" max="4" step="0.1"
                        v-model.number="params.a">
                </div>
                <div class="mb-3">
                    <div class="d-flex justify-content-between text-success mb-1"><label>猜測度 (c)</label><span
                            class="font-monospace">{{ params.c }}</span></div>
                    <input type="range" class="form-range cyber-range" min="0" max="0.5" step="0.05"
                        v-model.number="params.c">
                </div>
                <div class="mb-auto">
                    <div class="d-flex justify-content-between text-danger mb-1"><label>失誤率 (d)</label><span
                            class="font-monospace">{{ params.d }}</span></div>
                    <input type="range" class="form-range cyber-range" min="0.8" max="1" step="0.01"
                        v-model.number="params.d">
                </div>

                <div
                    class="mt-4 p-2 bg-black rounded border border-secondary border-opacity-25 text-center font-monospace small text-muted">
                    P(θ) = {{ params.c }} + ...
                </div>
            </div>

            <div class="col-lg-8 mt-4 mt-lg-0 ps-lg-4" style="min-height: 350px;">
                <Line :data="chartData" :options="chartOptions" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.cyber-range::-webkit-slider-thumb {
    background: var(--neon-cyan);
    box-shadow: 0 0 10px var(--neon-cyan);
    cursor: pointer;
}

.cyber-range::-webkit-slider-runnable-track {
    background: #334155;
}
</style>
