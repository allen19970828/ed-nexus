<script setup>
import { ref } from 'vue';

const activeTab = ref('theory');

const content = {
    theory: {
        title: '理論基礎 (Foundations)',
        icon: 'bi-bank',
        items: [
            {
                subtitle: '核心概念',
                text: 'IRT 是一類潛在因子模型。核心思想是引入「潛在特質 (Latent Trait, θ)」來解釋受試者的反應。與 CTT (依賴總分) 不同，IRT 具有參數不變性：題目參數不隨受試者改變，能力估計不隨題目改變。'
            },
            {
                subtitle: '關鍵假設',
                list: [
                    '單維性 (Unidimensionality)：測驗主要測量單一能力。',
                    '局部獨立性 (Local Independence)：給定能力後，題目間無關連。',
                    '單調性 (Monotonicity)：能力越高，答對率越高。'
                ]
            }
        ]
    },
    models: {
        title: '模型類型 (Models)',
        icon: 'bi-diagram-3',
        items: [
            { subtitle: 'Rasch 模型 (1PL)', text: '最簡單的模型，假設所有題目鑑別度相同，只考慮難度 (b)。適用於樣本較小的情況。' },
            { subtitle: '2PL 模型', text: '引入鑑別度 (a)，允許題目區分高低手的能力不同。大規模教育測驗常用。' },
            { subtitle: '3PL 模型', text: '增加猜測參數 (c)，處理選擇題中低能力者可能猜對的情況。' },
            { subtitle: '4PL 模型', text: '增加失誤參數 (d)，考慮高手可能因粗心而答錯的情況 (上限 < 1)。' }
        ]
    },
    cat: {
        title: '自適應測驗 (CAT)',
        icon: 'bi-cpu',
        items: [
            { subtitle: '核心原理', text: '根據受試者上一題的反應，動態選擇「訊息量 (Information)」最大的題目。' },
            { subtitle: '效率提升', text: '研究顯示，CAT 只需傳統測驗 60% 的題數，就能達到相同的測量精準度。例如 ROAR-CAT 僅需 3 分鐘即可評估閱讀能力。' },
            { subtitle: '停止規則', text: '當標準誤 (SE) 小於特定閾值 (如 0.32) 或達到最大題數時停止。' }
        ]
    },
    apps: {
        title: '應用領域 (Applications)',
        icon: 'bi-globe',
        items: [
            { subtitle: '教育測驗', text: 'PISA、TIMSS、GRE 等高風險考試使用 IRT 進行試題等化 (Equating) 與題庫建置。' },
            { subtitle: '醫療健康 (PROMIS)', text: '用於測量患者自報的健康結果（如焦慮、疼痛）。透過 CAT，將 30 題問卷縮減為 4-5 題。' },
            { subtitle: '推薦系統', text: 'Netflix 電影評分預測也可視為矩陣補全問題，與 IRT 的潛在變量思想一致。' }
        ]
    }
};
</script>

<template>
    <div class="irt-wiki">
        <div
            class="nav nav-pills nav-fill mb-4 p-1 bg-dark bg-opacity-50 rounded border border-secondary border-opacity-25">
            <button v-for="(data, key) in content" :key="key" class="nav-link text-uppercase fw-bold letter-spacing-1"
                :class="{ 'active': activeTab === key }" @click="activeTab = key">
                <i :class="`bi ${data.icon} me-2`"></i> <span class="d-none d-md-inline">{{ data.title }}</span>
            </button>
        </div>

        <div class="card card-custom p-4 p-lg-5" style="min-height: 400px;">
            <div class="fade-in-content" :key="activeTab">
                <h2 class="text-white fw-bold mb-4">
                    <i :class="`bi ${content[activeTab].icon} text-primary-custom me-3`"></i>
                    {{ content[activeTab].title }}
                </h2>

                <div class="row g-4">
                    <div class="col-lg-6" v-for="(item, index) in content[activeTab].items" :key="index">
                        <div class="h-100 p-3 border-start border-4 border-info bg-black bg-opacity-25">
                            <h5 class="text-info mb-3">{{ item.subtitle }}</h5>
                            <p v-if="item.text" class="text-gray-300 mb-0">{{ item.text }}</p>
                            <ul v-if="item.list" class="text-gray-300 ps-3 mb-0">
                                <li v-for="(li, i) in item.list" :key="i" class="mb-2">{{ li }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.nav-pills .nav-link {
    color: #9ca3af;
    border-radius: 4px;
    transition: all 0.3s;
}

.nav-pills .nav-link:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
}

.nav-pills .nav-link.active {
    background: var(--neon-cyan);
    color: #000;
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
}

.text-gray-300 {
    color: #d1d5db;
}

.fade-in-content {
    animation: fadeIn 0.5s ease;
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
</style>
