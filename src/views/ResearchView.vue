<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import Swal from 'sweetalert2'
import { animate, stagger } from 'motion'

// 1. 設定標題 (取代 useHead)
onMounted(() => {
    document.title = '學術研究實驗室 | EdTech Nexus'

    // Initial animation for hero section
    animate('.hero-content',
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.8, easing: 'ease-out' }
    )
})

// --- 資料層 ---

// 2. 主題標籤 (Topics)
const categories = [
    { id: 'all', name: '全域資料' },
    { id: 'ai', name: '人工智慧 (AI)' },
    { id: 'web3', name: 'Web3 & 區塊鏈' },
    { id: 'assessment', name: '教育測驗' },
    { id: 'statistics', name: '教育統計' },
    { id: 'music-tech', name: '音樂科技' },
    { id: 'e-learning', name: '數位學習' },
    { id: 'digital-teaching', name: '數位教學' }
]

const activeCategory = ref('all')

// 3. 模擬文章數據
const researches = ref([
    {
        id: 101,
        title: '基於認知診斷模型 (CDM) 的 AI 音樂家教系統開發',
        abstract: '本研究旨在建構一個結合 DINA 模型與生成式 AI 的適性化音樂學習系統，透過即時分析學生的節奏錯誤類型，生成客製化的練習曲目。',
        tags: ['assessment', 'ai', 'music-tech'],
        status: 'drafting',
        progress: 65,
        date: '2025-12-10',
        icon: 'bi-music-note-list'
    },
    {
        id: 102,
        title: 'Web3 去中心化身份 (DID) 在跨校學分抵免之應用',
        abstract: '探討如何利用靈魂綁定代幣 (SBT) 解決跨校修課的信任機制問題，並提出一個基於 Ethereum 的概念驗證原型。',
        tags: ['web3', 'digital-teaching'],
        status: 'review',
        progress: 100,
        date: '2025-11-20',
        icon: 'bi-box-seam'
    },
    {
        id: 103,
        title: '數位學習環境中的學習投入度分析：多層次線性模型 (HLM) 的觀點',
        abstract: '利用 HLM 分析 50 所小學的數位學習平台 Log 數據，探討班級層次變項（教師數位素養）對學生個別層次投入度的影響。',
        tags: ['statistics', 'e-learning', 'digital-teaching'],
        status: 'published',
        progress: 100,
        date: '2025-10-15',
        icon: 'bi-graph-up-arrow'
    },
    {
        id: 104,
        title: '自動化作曲演算法在國小音樂創作教學之成效研究',
        abstract: '比較傳統教學法與 AI 輔助創作工具對於國小高年級學生音樂創造力與學習動機之差異分析。',
        tags: ['music-tech', 'digital-teaching', 'ai'],
        status: 'published',
        progress: 100,
        date: '2025-09-01',
        icon: 'bi-file-earmark-music'
    },
    {
        id: 105,
        title: '電腦化適性測驗 (CAT) 在偏鄉補救教學的實施困境與突破',
        abstract: '質性研究：訪談 12 位偏鄉教師，歸納硬體限制與數位落差對 CAT 實施的影響，並提出離線版輕量化模型的解決方案。',
        tags: ['assessment', 'digital-teaching'],
        status: 'drafting',
        progress: 30,
        date: '2026-01-05',
        icon: 'bi-people'
    }
])

// --- 邏輯層 ---

const filteredResearches = computed(() => {
    if (activeCategory.value === 'all') return researches.value
    return researches.value.filter(item => item.tags.includes(activeCategory.value))
})

// Watch for changes in the filtered list to re-animate cards
watch(filteredResearches, async () => {
    await nextTick()

    // 1. Animate Cards Entrance
    animate(
        '.research-card',
        { opacity: [0, 1], y: [20, 0] },
        {
            delay: stagger(0.1),
            duration: 0.5,
            easing: 'ease-out'
        }
    )

    // 2. Animate Progress Bars (Similar to AboutView)
    const bars = document.querySelectorAll('.research-progress')
    bars.forEach((bar, index) => {
        const targetWidth = bar.dataset.width
        animate(
            bar,
            { width: [0, `${targetWidth}%`] },
            {
                duration: 1.5,
                delay: 0.3 + (index * 0.1), // Stagger slightly after card entrance
                easing: 'ease-out'
            }
        )
    })
}, { immediate: true })

const getTagName = (tagId) => {
    const cat = categories.find(c => c.id === tagId)
    return cat ? cat.name : tagId
}

// 模擬「新增研究」
const openEditor = () => {
    console.log('Button clicked! Opening SweetAlert...')

    Swal.fire({
        title: '啟動研究矩陣',
        input: 'text',
        inputLabel: '請輸入研究主題 (Research Topic)',
        inputPlaceholder: 'Ex: AI 在......的應用',
        background: '#0b0f19',
        color: '#fff',
        confirmButtonText: '建立專案',
        confirmButtonColor: '#06b6d4',
        showCancelButton: true,
        cancelButtonText: '取消',
        customClass: {
            popup: 'swal2-cyberpunk-popup',
            input: 'bg-dark text-white border-secondary'
        },
        preConfirm: (title) => {
            if (!title) {
                Swal.showValidationMessage('主題不能為空 / Subject required')
                return false
            }
            return title
        }
    }).then((result) => {
        if (result.isConfirmed) {
            console.log('Project created:', result.value)

            researches.value.unshift({
                id: Date.now(),
                title: result.value,
                abstract: '初始化專案結構中... 正在載入文獻回顧模組... (此為模擬數據)',
                tags: ['ai'],
                status: 'drafting',
                progress: 0,
                date: new Date().toISOString().split('T')[0],
                icon: 'bi-file-earmark-code'
            })

            Swal.fire({
                icon: 'success',
                title: '專案已建立',
                text: '已同步至雲端資料庫',
                background: '#0b0f19',
                color: '#fff',
                confirmButtonColor: '#06b6d4',
                timer: 1500,
                customClass: { popup: 'swal2-cyberpunk-popup' }
            })
        }
    }).catch(err => {
        console.error('SweetAlert Error:', err)
    })
}
</script>

<template>
    <div class="research-page bg-dark-theme text-white" style="margin-top: 76px;">

        <section class="py-5 position-relative overflow-hidden">
            <div class="position-absolute top-0 end-0 text-white opacity-05 display-1 fw-bold user-select-none pe-5 pt-3"
                style="z-index: 0; font-family: monospace;">
                RESEARCH
            </div>

            <div class="container position-relative" style="z-index: 1;">
                <div class="row align-items-end">
                    <div class="col-lg-8">
                        <div class="hero-content" style="opacity: 0;">
                            <h6 class="text-secondary-custom letter-spacing-2 mb-2">
                                <i class="bi bi-hdd-network me-2"></i>ACADEMIC LAB
                            </h6>
                            <h1 class="display-4 fw-bold text-white text-glow mb-3">
                                學術研發<span class="text-primary-custom">矩陣</span>
                            </h1>
                            <p class="text-gray-400 lead">
                                這裡記錄了教育科技領域的前沿探索。從 <span class="text-white">AI 測驗</span> 到 <span class="text-white">Web3
                                    認證</span>，
                                每一行代碼與文字都是通往未來的路徑。
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-4 text-lg-end mt-4 mt-lg-0">
                        <div class="d-inline-block">
                            <button class="btn btn-primary-custom w-100 w-lg-auto" @click="openEditor">
                                <i class="bi bi-plus-lg me-2"></i> 新增研究專案
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="sticky-top bg-blur-dark border-bottom border-secondary border-opacity-25 py-3"
            style="z-index: 10; top: 76px;">
            <div class="container">
                <div class="d-flex flex-nowrap overflow-auto gap-2 pb-2 pb-lg-0 hide-scrollbar">
                    <button v-for="cat in categories" :key="cat.id"
                        class="btn btn-sm rounded-pill text-nowrap px-3 transition-all"
                        :class="activeCategory === cat.id ? 'btn-primary-custom' : 'btn-outline-secondary text-gray-300'"
                        @click="activeCategory = cat.id">
                        {{ cat.name }}
                    </button>
                </div>
            </div>
        </section>

        <section class="py-5">
            <div class="container">
                <div class="row g-4">
                    <div v-if="filteredResearches.length === 0" class="col-12 text-center py-5">
                        <i class="bi bi-inbox fs-1 text-secondary-custom opacity-50"></i>
                        <p class="text-muted mt-3">此分類尚無研究數據</p>
                    </div>

                    <div class="col-lg-6" v-for="(item, index) in filteredResearches" :key="item.id">
                        <div class="h-100 research-card" style="opacity: 0;">
                            <div class="card card-custom h-100 p-0 overflow-hidden group-hover-effect">
                                <div class="status-strip" :class="item.status"></div>

                                <div class="card-body p-4 bg-dark-card">
                                    <div class="d-flex justify-content-between align-items-start mb-3">
                                        <div class="d-flex gap-2 align-items-center">
                                            <div
                                                class="icon-box rounded bg-dark border border-secondary border-opacity-25 d-flex align-items-center justify-content-center text-primary-custom">
                                                <i :class="`bi ${item.icon}`"></i>
                                            </div>
                                            <span v-if="item.status === 'drafting'"
                                                class="badge bg-warning text-dark"><i
                                                    class="bi bi-pencil-fill me-1"></i> 撰寫中</span>
                                            <span v-else-if="item.status === 'published'" class="badge bg-success"><i
                                                    class="bi bi-check-circle-fill me-1"></i> 已發表</span>
                                            <span v-else class="badge bg-info text-dark"><i
                                                    class="bi bi-eye-fill me-1"></i> 審查中</span>
                                        </div>
                                        <small class="text-muted font-monospace">{{ item.date }}</small>
                                    </div>

                                    <h4 class="card-title text-white mb-3 hover-text-cyan cursor-pointer">{{ item.title
                                    }}</h4>
                                    <p class="card-text text-gray-400 mb-4 line-clamp-3">{{ item.abstract }}</p>

                                    <!-- Progress Bar Section: Show for 'drafting' OR 'published' -->
                                    <div v-if="item.status === 'drafting' || item.status === 'published'" class="mb-4">
                                        <div class="d-flex justify-content-between small mb-1">
                                            <span
                                                :class="item.status === 'published' ? 'text-success' : 'text-warning'">
                                                {{ item.status === 'published' ? '發表進度' : '撰寫進度' }}
                                            </span>
                                            <span class="text-white">{{ item.progress }}%</span>
                                        </div>
                                        <div class="progress bg-dark" style="height: 4px;">
                                            <div class="progress-bar research-progress"
                                                :class="item.status === 'published' ? 'bg-success' : 'bg-warning'"
                                                role="progressbar" :data-width="item.progress" style="width: 0%"></div>
                                        </div>
                                    </div>

                                    <div
                                        class="d-flex flex-wrap gap-2 mt-auto pt-3 border-top border-secondary border-opacity-10">
                                        <span v-for="tag in item.tags" :key="tag" class="badge badge-cyber fw-normal">
                                            # {{ getTagName(tag) }}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    class="card-footer bg-dark bg-opacity-50 border-top border-secondary border-opacity-25 d-flex justify-content-end p-2">
                                    <button class="btn btn-sm text-secondary-custom hover-light">
                                        <i class="bi bi-pencil-square me-1"></i> 編輯
                                    </button>
                                    <button class="btn btn-sm text-primary-custom hover-light">
                                        <i class="bi bi-file-earmark-pdf me-1"></i> 預覽
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<style scoped>
/* 定義專案變數 (模擬全域樣式) */
.research-page {
    --neon-cyan: #06b6d4;
    --neon-purple: #8b5cf6;
    --bg-dark: #0b0f19;
    --text-main: #e2e8f0;
}

.bg-dark-theme {
    background-color: #0b0f19;
    min-height: 100vh;
}

.bg-dark-card {
    background-color: rgba(30, 41, 59, 0.5);
}

/* 自定義按鈕與文字顏色 */
.text-primary-custom {
    color: var(--neon-cyan) !important;
}

.text-secondary-custom {
    color: var(--neon-purple) !important;
}

.btn-primary-custom {
    background-color: var(--neon-cyan);
    color: #000;
    border: none;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-primary-custom:hover {
    background-color: #0891b2;
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
    color: #fff;
}

.badge-cyber {
    background: rgba(6, 182, 212, 0.1);
    color: var(--neon-cyan);
    border: 1px solid rgba(6, 182, 212, 0.2);
}

.text-glow {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

/* 基礎樣式 */
.text-gray-300 {
    color: #d1d5db;
}

.text-gray-400 {
    color: #9ca3af;
}

.bg-blur-dark {
    background: rgba(11, 15, 25, 0.85);
    backdrop-filter: blur(10px);
}

.opacity-05 {
    opacity: 0.05;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.icon-box {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.hover-text-cyan {
    transition: color 0.3s;
}

.hover-text-cyan:hover {
    color: var(--neon-cyan) !important;
}

/* 狀態條 */
.status-strip {
    height: 3px;
    width: 100%;
}

.status-strip.drafting {
    background: #ffc107;
    box-shadow: 0 0 10px rgba(255, 193, 7, 0.4);
}

.status-strip.published {
    background: #198754;
    box-shadow: 0 0 10px rgba(25, 135, 84, 0.4);
}

.status-strip.review {
    background: #0dcaf0;
    box-shadow: 0 0 10px rgba(13, 202, 240, 0.4);
}

.card-custom {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease, border-color 0.3s ease;
}

.group-hover-effect:hover {
    transform: translateY(-5px);
    border-color: var(--neon-cyan);
}

.hover-light:hover {
    color: #fff !important;
}

.cursor-pointer {
    cursor: pointer;
}

/* Motion library replaces customized CSS animations */
</style>