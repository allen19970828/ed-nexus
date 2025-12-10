<script setup>
import { onMounted } from 'vue';
import { animate, inView } from 'motion';
import IccLab from '../components/IccLab.vue';
import IrtWiki from '../components/IrtWiki.vue';

onMounted(() => {
    document.title = 'IRT 實驗室 | EdTech-俞良澄';

    // 1. 動畫進場
    animate('.hero-content', { opacity: [0, 1], y: [30, 0] }, { duration: 0.8 });

    inView('.lab-section', () => {
        animate('.lab-container', { opacity: [0, 1], scale: [0.95, 1] }, { duration: 0.6 });
    });

    inView('.theory-section', () => {
        animate('.theory-card', { opacity: [0, 1], y: [30, 0] }, { duration: 0.6 });
    });

    // 2. 防呆保險機制 (1.5秒後強制顯示內容)
    setTimeout(() => {
        document.querySelectorAll('.opacity-0').forEach(el => {
            el.classList.remove('opacity-0');
            el.style.opacity = 1;
        });
    }, 1500);
});
</script>

<template>
    <div class="irt-page" style="margin-top: 76px;">

        <div class="container py-5 hero-content opacity-0">
            <div class="row text-center mb-5">
                <div class="col-lg-10 mx-auto">
                    <span class="badge border border-info text-info mb-3 px-3 py-2">INTERACTIVE MODULE</span>
                    <h1 class="display-3 fw-bold text-white mb-3">
                        IRT <span class="text-primary-custom">項目反應理論</span>
                    </h1>
                    <p class="lead text-gray-400">
                        超越傳統測驗總分 (CTT) 的現代統計框架。<br>
                        在這裡，我們將機率視覺化，深入解析 <strong>Rasch, 2PL, 3PL</strong> 模型。
                    </p>
                </div>
            </div>
        </div>

        <div class="lab-section bg-black bg-opacity-25 py-5">
            <div class="container">
                <div class="d-flex align-items-center mb-4">
                    <h2 class="h3 text-white fw-bold mb-0">
                        <span class="text-secondary-custom">01.</span> 參數實驗室 (The ICC Playground)
                    </h2>
                    <div class="ms-3 flex-grow-1" style="height: 1px; background: rgba(139, 92, 246, 0.3);"></div>
                </div>

                <div class="lab-container opacity-0">
                    <IccLab />
                </div>
            </div>
        </div>

        <div class="theory-section container py-5">
            <div class="d-flex align-items-center mb-4">
                <h2 class="h3 text-white fw-bold mb-0">
                    <span class="text-secondary-custom">02.</span> 理論基礎與模型
                </h2>
                <div class="ms-3 flex-grow-1" style="height: 1px; background: rgba(139, 92, 246, 0.3);"></div>
            </div>

            <div class="theory-card opacity-0">
                <IrtWiki />
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

.opacity-0 {
    opacity: 0;
}
</style>
