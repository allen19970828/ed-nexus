<script setup>
import { ref, computed } from 'vue';
import { animate, stagger } from 'motion';
import HeroSection from '../components/HeroSection.vue';
import ArticleCard from '../components/ArticleCard.vue';

// 1. 文章資料庫 (模擬)
const allPosts = [
    {
        id: 107,
        title: '認知診斷模型 (CDM)：演進與未來實驗室',
        excerpt: '從傳統 DINA 到深度學習 NeuralCDM：探索 AI 如何透過 Q-Matrix 診斷學生的認知狀態與技能掌握度。',
        date: '2025-07-20',
        category: 'Interactive Lab',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
        link: '/survey-cdm'
    },
    {
        id: 106,
        title: 'RAG vs Fine-tuning：技術對決實驗室',
        excerpt: '基於微軟農業案例研究：模擬機制差異、使用權衡模擬器計算最佳策略，並分析實際實驗數據。',
        date: '2025-07-05',
        category: 'Interactive Lab',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
        link: '/rag-ft'
    },
    {
        id: 105,
        title: '資料包絡分析 (DEA)：效率評估實驗室',
        excerpt: '透過視覺化圖表探索效率前緣，比較 CCR 與 BCC 模型，並學習如何診斷組織運營效率。',
        date: '2025-06-20',
        category: 'Interactive Lab',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        link: '/dea'
    },
    {
        id: 104,
        title: '自然語言處理 (NLP)：教育智能實驗室',
        excerpt: '探索 Transformer 注意力機制如何理解語意，與蘇格拉底式 AI 導師對話，並體驗自動作文批改技術。',
        date: '2025-06-10',
        category: 'Interactive Lab',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
        link: '/nlp'
    },
    {
        id: 103,
        title: '類神經網路 (ANN)：機器學習實驗室',
        excerpt: '親手調整神經元的權重與偏差，觀察激活函數 (ReLU/Sigmoid) 的非線性特性，並透視 CNN 如何提取影像特徵。',
        date: '2025-06-01',
        category: 'Interactive Lab',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
        link: '/ann'
    },
    {
        id: 102,
        title: '古典測驗理論 (CTT)：信度與試題分析',
        excerpt: '從真分數模型 (O=T+E) 出發，互動式探索信度 (Reliability) 的意義，並親手計算試題的難度與鑑別度。',
        date: '2025-05-25',
        category: 'Interactive Lab',
        image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80',
        link: '/ctt'
    },
    {
        id: 101,
        title: '認知診斷模式 (CDM)：DINA/DINO 模擬器',
        excerpt: '教育測驗理論的進階應用。定義 Q 矩陣，並觀察粗心 (Slip) 與猜測 (Guess) 參數如何影響神經網路的診斷準確度。',
        date: '2025-05-20',
        category: 'Interactive Lab',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
        link: '/cdm'
    },
    {
        id: 100,
        title: '認識網絡分析 (ENA)：認知結構模擬器',
        excerpt: '將腦中的思維路徑視覺化。透過互動圖表，比較「高績效」與「低績效」學習者的思考差異。',
        date: '2025-05-15',
        category: 'Interactive Lab',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        link: '/ena'
    },
    {
        id: 99,
        title: 'IRT 互動實驗室：視覺化圖表教學',
        excerpt: '親手調整參數，搞懂 Rasch 與 3PL 模型。這是給教育工作者的互動式統計課。',
        date: '2025-05-01',
        category: 'Interactive Lab',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        link: '/irt-lab'
    },
];

// 2. 篩選邏輯
const currentCategory = ref('All');
const categories = ['All', 'Interactive Lab', 'AI Education', 'VR/AR', 'Blockchain', 'Coding'];

const filteredPosts = computed(() => {
    if (currentCategory.value === 'All') return allPosts;
    return allPosts.filter(post => post.category === currentCategory.value);
});

// 3. 切換分類並觸發動畫
const filterPosts = (category) => {
    currentCategory.value = category;

    // 重新觸發進場動畫 (簡單版)
    setTimeout(() => {
        animate(
            '.article-card-wrapper',
            { opacity: [0, 1], y: [20, 0] },
            { delay: stagger(0.1), duration: 0.4 }
        );
    }, 50); // 等 Vue 更新 DOM
};

const scrollToPosts = () => {
    const el = document.getElementById('post-list');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};
</script>

<template>
    <div>
        <div style="margin-top: 76px;">
            <HeroSection @scroll-to-posts="scrollToPosts" />
        </div>

        <section id="post-list" class="container py-5">

            <div class="row mb-5 align-items-end">
                <div class="col-lg-6">
                    <div class="d-flex align-items-center">
                        <h2 class="h2 fw-bold mb-0 text-white">最新傳輸 <span class="text-secondary-custom">///</span></h2>
                        <div class="ms-3 flex-grow-1" style="height: 1px; background: rgba(139, 92, 246, 0.3);"></div>
                    </div>
                </div>

                <div class="col-lg-6 mt-4 mt-lg-0 text-lg-end">
                    <div class="btn-group filter-group" role="group">
                        <button v-for="cat in categories" :key="cat" @click="filterPosts(cat)"
                            class="btn btn-sm btn-outline-custom position-relative overflow-hidden"
                            :class="{ 'active': currentCategory === cat }">
                            {{ cat }}
                            <div v-if="currentCategory === cat" class="active-bg"></div>
                        </button>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <TransitionGroup name="list">
                    <div v-for="post in filteredPosts" :key="post.id" class="col-md-4 article-card-wrapper">
                        <ArticleCard :post="post" />
                    </div>
                </TransitionGroup>

                <div v-if="filteredPosts.length === 0" class="col-12 text-center py-5">
                    <p class="text-muted font-monospace">
                        <i class="bi bi-exclamation-triangle me-2"></i>NO_DATA_FOUND_
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* 篩選按鈕樣式 */
.filter-group .btn {
    border-color: rgba(139, 92, 246, 0.3);
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.3s ease;
    z-index: 1;
}

.filter-group .btn:hover {
    color: #fff;
    border-color: var(--neon-cyan);
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
}

.filter-group .btn.active {
    color: #000;
    /* 選中時文字變黑，因為背景會發光 */
    border-color: var(--neon-cyan);
    font-weight: bold;
}

.active-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--neon-cyan);
    z-index: -1;
    box-shadow: 0 0 15px var(--neon-cyan);
}

/* Vue TransitionGroup 動畫 */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.list-leave-active {
    position: absolute;
    /* 讓離開的元素不佔位，達成平滑移動 */
}
</style>