<script setup>
import { ref, computed } from 'vue';

// 模擬 ENA 的代碼 (Codes) - 這裡以「協作學習」為例
const nodes = [
    { id: 'leadership', x: 250, y: 50, label: '領導力' },
    { id: 'feedback', x: 400, y: 150, label: '提供回饋' },
    { id: 'reasoning', x: 350, y: 350, label: '邏輯推理' },
    { id: 'questioning', x: 150, y: 350, label: '提問' },
    { id: 'support', x: 100, y: 150, label: '情感支持' }
];

// 模擬兩組數據的連結強度 (Weights)
// Group A: 高績效 (結構緊密，偏向推理與領導)
const dataGroupA = {
    'leadership-reasoning': 0.9,
    'leadership-feedback': 0.8,
    'reasoning-feedback': 0.7,
    'reasoning-questioning': 0.6,
    'support-feedback': 0.3
};

// Group B: 低績效 (結構鬆散，偏向情感支持)
const dataGroupB = {
    'leadership-reasoning': 0.2,
    'leadership-feedback': 0.3,
    'reasoning-feedback': 0.2,
    'reasoning-questioning': 0.3,
    'support-feedback': 0.8,
    'support-questioning': 0.6
};

const currentView = ref('A'); // A, B, or Diff

// 計算當前要顯示的線條
const edges = computed(() => {
    const links = [];
    
    // 產生所有可能的連線組合
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const key = `${nodes[i].id}-${nodes[j].id}`;
            const keyReverse = `${nodes[j].id}-${nodes[i].id}`; // 處理反向鍵值
            
            const weightA = dataGroupA[key] || dataGroupA[keyReverse] || 0;
            const weightB = dataGroupB[key] || dataGroupB[keyReverse] || 0;
            
            let strokeWidth = 0;
            let color = '#444'; // 默認灰
            let opacity = 0.1;

            if (currentView.value === 'A') {
                strokeWidth = weightA * 8;
                color = '#06b6d4'; // Cyan
                opacity = weightA;
            } else if (currentView.value === 'B') {
                strokeWidth = weightB * 8;
                color = '#8b5cf6'; // Purple
                opacity = weightB;
            } else if (currentView.value === 'Diff') {
                // 差異圖邏輯：A減B
                const diff = weightA - weightB;
                strokeWidth = Math.abs(diff) * 8;
                // A強顯Cyan，B強顯Red
                color = diff > 0 ? '#06b6d4' : '#ef4444'; 
                opacity = Math.abs(diff);
            }

            if (strokeWidth > 0.5) { // 只顯示有意義的連結
                links.push({
                    x1: nodes[i].x, y1: nodes[i].y,
                    x2: nodes[j].x, y2: nodes[j].y,
                    strokeWidth, color, opacity
                });
            }
        }
    }
    return links;
});
</script>

<template>
    <div class="ena-viz-container card card-custom p-4">
        <div class="row h-100 align-items-center">
            <div class="col-md-4 border-end border-secondary border-opacity-25">
                <h4 class="text-white fw-bold mb-4">網絡結構模擬</h4>
                <p class="text-gray-400 small mb-4">
                    ENA 將定性數據轉化為網絡圖。節點代表「認知要素」，連線代表它們在對話中「共現 (Co-occurrence)」的頻率。
                </p>
                
                <div class="d-grid gap-3">
                    <button class="btn btn-outline-info" :class="{active: currentView==='A'}" @click="currentView='A'">
                        <i class="bi bi-people-fill me-2"></i>高績效組 (Group A)
                    </button>
                    <button class="btn btn-outline-purple" :class="{active: currentView==='B'}" @click="currentView='B'">
                        <i class="bi bi-people me-2"></i>低績效組 (Group B)
                    </button>
                    <button class="btn btn-outline-danger" :class="{active: currentView==='Diff'}" @click="currentView='Diff'">
                        <i class="bi bi-layers-half me-2"></i>差異圖 (Difference)
                    </button>
                </div>

                <div class="mt-4 p-3 bg-black rounded border border-secondary border-opacity-25 small">
                    <strong class="text-white">觀察重點：</strong>
                    <div v-if="currentView==='A'" class="text-info mt-2">
                        高績效者在「領導力」與「推理」之間有極強的連結，形成緊密的認知結構。
                    </div>
                    <div v-if="currentView==='B'" class="text-purple mt-2">
                        低績效者的連結較鬆散，主要集中在「情感支持」，缺乏深度認知連結。
                    </div>
                    <div v-if="currentView==='Diff'" class="text-white mt-2">
                        <span class="text-info">藍線</span> 代表 A 組較強的連結，<span class="text-danger">紅線</span> 代表 B 組較強的連結。這張圖直接揭示了兩組思維模式的差異。
                    </div>
                </div>
            </div>

            <div class="col-md-8 text-center position-relative">
                <svg width="500" height="400" viewBox="0 0 500 400" class="ena-svg">
                    <line v-for="(link, i) in edges" :key="i"
                        :x1="link.x1" :y1="link.y1"
                        :x2="link.x2" :y2="link.y2"
                        :stroke="link.color"
                        :stroke-width="link.strokeWidth"
                        stroke-linecap="round"
                        :opacity="link.opacity"
                        class="ena-link"
                    />
                    
                    <g v-for="node in nodes" :key="node.id">
                        <circle :cx="node.x" :cy="node.y" r="8" fill="#fff" class="ena-node" />
                        <circle :cx="node.x" :cy="node.y" r="15" fill="none" stroke="#fff" stroke-opacity="0.3" class="ena-node-pulse" />
                        <text :x="node.x" :y="node.y + 30" fill="#cbd5e1" font-size="14" text-anchor="middle" font-weight="bold">
                            {{ node.label }}
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    </div>
</template>

<style scoped>
.text-purple { color: #8b5cf6; }
.btn-outline-purple {
    color: #8b5cf6; border-color: #8b5cf6;
}
.btn-outline-purple:hover, .btn-outline-purple.active {
    background-color: #8b5cf6; color: white;
}
.text-gray-400 { color: #9ca3af; }

.ena-svg {
    max-width: 100%;
    filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
}

.ena-link {
    transition: all 0.5s ease;
}

.ena-node {
    filter: drop-shadow(0 0 5px white);
}
</style>
