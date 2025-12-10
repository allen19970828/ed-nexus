<script setup>
import { ref, onMounted } from 'vue';
import { animate, stagger, inView } from 'motion';
import Swal from 'sweetalert2';

// --- 資料層 ---
const papers = [
    {
        id: 'p1', year: '2025', type: 'Journal Article',
        title: '以測驗層次和試題層次探討音樂節奏認知診斷測驗之效度化歷程',
        journal: '測驗學刊 (Journal of Educational Measurement)',
        status: 'Accepted / In Press',
        abstract: '本研究旨在開發一套基於認知診斷模型 (CDM) 的音樂節奏測驗。透過 G-DINA 模型分析，我們成功指認出五種核心節奏屬性...',
        tags: ['CDM', 'Music Psychology', 'Psychometrics'], link: '#'
    },
    {
        id: 'p2', year: '2024', type: 'Conference Paper',
        title: '結合金融情境之數學互動式試題對於學生學習成效之探討',
        journal: 'Global Chinese Conference on Computers in Education (GCCCE)',
        status: 'Published',
        abstract: '探討將即時股市數據 API 導入國中數學函數教學之成效。實驗組學生在學習動機與遷移測驗表現上顯著優於控制組...',
        tags: ['FinTech', 'Math Education', 'Interactive Learning'], link: '#'
    },
    {
        id: 'p3', year: '2023', type: 'Master Thesis',
        title: '認知診斷模式應用於音樂節奏成效之探討',
        journal: 'National Taichung University of Education',
        status: 'Completed',
        abstract: '碩士論文。本研究構建了音樂節奏能力的 Q 矩陣，並比較了不同 CDM 模型（DINA, DINO, G-DINA）在小學高年級學生數據上的適配度...',
        tags: ['Thesis', 'DINA Model', 'R Language'], link: '#'
    }
];

const copyCitation = (paper) => {
    const citation = `${paper.title}. ${paper.journal}, (${paper.year}).`;
    navigator.clipboard.writeText(citation).then(() => {
        const Toast = Swal.mixin({
            toast: true, position: 'top-end', showConfirmButton: false, timer: 2000,
            timerProgressBar: true, background: '#06b6d4', color: '#000'
        });
        Toast.fire({ icon: 'success', title: 'Citation Copied!' });
    });
};

onMounted(() => {
    document.title = '學術研究 | EdTech-俞良澄';

    // 1. 動畫邏輯
    animate('.page-header', { opacity: [0, 1], y: [-30, 0] }, { duration: 1 });

    inView('.paper-list', () => {
        animate('.paper-item',
            { opacity: [0, 1], x: [-50, 0] },
            { delay: stagger(0.2), duration: 0.6 }
        );
    });

    // 2. 防呆保險機制 (Failsafe)
    // 1.5秒後如果動畫沒跑完，強制顯示
    setTimeout(() => {
        document.querySelectorAll('.opacity-0').forEach(el => {
            el.classList.remove('opacity-0');
            el.style.opacity = 1;
        });
    }, 1500);
});
</script>

<template>
    <div class="research-page" style="margin-top: 76px;">
        <div class="container py-5">
            <div class="row mb-5 page-header opacity-0">
                <div class="col-lg-8">
                    <h5 class="text-secondary-custom letter-spacing-2">ACADEMIC ARCHIVES</h5>
                    <h1 class="display-4 fw-bold text-white">
                        學術研究 <span class="text-primary-custom">資料庫</span>
                    </h1>
                    <p class="lead text-gray-400">
                        收錄關於 認知診斷模型 (CDM)、教育大數據與數位學習科技 的研究成果與論文發表。
                    </p>
                </div>
            </div>

            <div class="paper-list">
                <div v-for="paper in papers" :key="paper.id" class="paper-item opacity-0 mb-5 position-relative">
                    <div class="timeline-line"></div>
                    <div class="timeline-dot"></div>

                    <div class="card card-custom p-4 ms-4 ms-md-5 hover-glow">
                        <div class="row">
                            <div
                                class="col-md-2 text-md-center border-end border-secondary border-opacity-25 mb-3 mb-md-0">
                                <h2 class="display-6 fw-bold text-primary-custom mb-0">{{ paper.year }}</h2>
                                <span class="badge border border-secondary text-secondary-custom mt-2">{{ paper.type
                                    }}</span>
                            </div>
                            <div class="col-md-10 ps-md-4">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h4 class="text-white fw-bold mb-0 paper-title">{{ paper.title }}</h4>
                                    <div class="btn-group">
                                        <button @click="copyCitation(paper)" class="btn btn-sm btn-outline-secondary"><i
                                                class="bi bi-quote"></i></button>
                                        <button class="btn btn-sm btn-outline-custom"><i
                                                class="bi bi-file-earmark-arrow-down"></i></button>
                                    </div>
                                </div>
                                <p class="text-info small mb-3 fst-italic">{{ paper.journal }} <span
                                        class="text-muted">| {{ paper.status }}</span></p>
                                <p class="text-gray-300 mb-3 small">{{ paper.abstract }}</p>
                                <div class="d-flex gap-2 flex-wrap">
                                    <span v-for="tag in paper.tags" :key="tag"
                                        class="badge bg-dark border border-secondary text-gray-400">#{{ tag }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

.timeline-line {
    position: absolute;
    top: 0;
    bottom: -3rem;
    left: 14px;
    width: 2px;
    background: linear-gradient(to bottom, var(--neon-cyan), transparent);
    opacity: 0.3;
}

.paper-item:last-child .timeline-line {
    display: none;
}

.timeline-dot {
    position: absolute;
    top: 2rem;
    left: 9px;
    width: 12px;
    height: 12px;
    background: var(--neon-cyan);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--neon-cyan);
    z-index: 1;
}

.hover-glow {
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
}

.hover-glow:hover {
    transform: translateX(10px);
    border-left: 3px solid var(--neon-cyan);
    box-shadow: 0 5px 20px rgba(6, 182, 212, 0.1);
}

.paper-title {
    line-height: 1.4;
}

/* 確保 opacity-0 有定義 */
.opacity-0 {
    opacity: 0;
}
</style>