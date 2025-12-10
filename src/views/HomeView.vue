<script setup>
import { ref, computed } from 'vue';
import { animate, stagger } from 'motion';
import HeroSection from '../components/HeroSection.vue';
import ArticleCard from '../components/ArticleCard.vue';

// 1. 文章資料庫 (模擬)
const allPosts = [
    {
        id: 99,
        title: 'IRT 互動實驗室：視覺化圖表教學',
        excerpt: '親手調整參數，搞懂 Rasch 與 3PL 模型。這是給教育工作者的互動式統計課。',
        date: '2025-05-01',
        category: 'Interactive Lab',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        link: '/irt-lab'
    },
    {
        id: 2,
        title: '元宇宙校園：沉浸式學習新趨勢',
        excerpt: '虛擬實境 (VR) 如何打破物理限制，讓歷史與化學課變得身歷其境。',
        date: '2025-04-10',
        category: 'VR/AR',
        image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80'
    },
    {
        id: 3,
        title: '區塊鏈學歷證書的崛起',
        excerpt: 'Web3 技術如何確保學歷真實性，並實現終身學習履歷的去中心化。',
        date: '2025-04-05',
        category: 'Blockchain',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80'
    },
    {
        id: 4,
        title: 'No-Code 開發工具與運算思維',
        excerpt: '當寫程式變得像拼圖一樣簡單，我們該教孩子的不再是語法，而是邏輯架構。',
        date: '2025-03-28',
        category: 'Coding',
        image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80'
    },
    {
        id: 5,
        title: '生成式 AI 繪圖在美術課的應用',
        excerpt: 'Midjourney 與 Stable Diffusion 如何激發學生的創意，而非抹殺創作靈魂。',
        date: '2025-03-20',
        category: 'AI Education',
        image: 'https://images.unsplash.com/photo-1684469503461-9c3a3b018599?w=800&q=80'
    },
    {
        id: 6,
        title: 'Web3 錢包：未來的學生證',
        excerpt: '透過 NFT 技術，打造不可篡改且永久保存的校園參與證明 (POAP)。',
        date: '2025-03-15',
        category: 'Blockchain',
        image: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&q=80'
    }
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