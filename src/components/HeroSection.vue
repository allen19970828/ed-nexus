<template>
    <header class="hero-section text-center text-lg-start position-relative">

        <div class="hero-bg">
            <Hero3D />
        </div>

        <div class="container position-relative z-1">
            <div class="row align-items-center">
                <div class="col-lg-7">
                    <span class="text-primary-custom fw-bold letter-spacing-2 text-uppercase mb-3 d-block">
                        <i class="bi bi-broadcast me-2"></i>Vol. 2025.42
                    </span>

                    <div class="text-backdrop">
                        <h1 class="hero-title mb-4">
                            重塑學習的邊界<br>
                            <span class="text-primary-custom">教育科技</span> 的下一個紀元
                        </h1>

                        <p class="lead text-secondary mb-5 font-monospace" style="max-width: 600px; min-height: 80px;">
                            <span class="text-primary-custom">> </span>
                            {{ typedText }}<span class="cursor-blink">_</span>
                        </p>
                    </div>

                    <div class="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                        <button class="btn btn-primary-custom btn-lg" @click="$emit('scroll-to-posts')">
                            閱讀最新一期 <i class="bi bi-arrow-right ms-2"></i>
                        </button>
                        <button class="btn btn-outline-custom btn-lg">
                            探索資料庫
                        </button>
                    </div>
                </div>

                <div class="col-lg-5 d-none d-lg-block text-center">
                    <div class="cyber-decoration">
                        <div class="ring-outer"></div>
                        <div class="ring-inner"></div>
                        <i class="bi bi-robot cyber-icon"></i>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Hero3D from './Hero3D.vue';

defineEmits(['scroll-to-posts']);

const typedText = ref('');
const fullText = "每週為您解析 AI 輔助教學、沉浸式學習環境與區塊鏈證書的最新動態。";
const typingSpeed = 50;

onMounted(() => {
    let i = 0;
    const interval = setInterval(() => {
        if (i < fullText.length) {
            typedText.value += fullText.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, typingSpeed);
});
</script>

<style scoped>
.hero-section {
    padding: 8rem 0 6rem 0;
    min-height: 80vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
}

/* --- 關鍵修改：背景層 --- */
.hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;

    /* 原本是 opacity: 0.5，現在改為 1 (不透明)，或者直接刪除這行 */
    opacity: 1;

    pointer-events: none;
    /* 加一點混合模式，讓線條跟深色背景融合得更好 */
    mix-blend-mode: screen;
}

/* 為了怕背景太亮影響閱讀，給文字區塊加一點點黑底光暈 */
.text-backdrop {
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.2;
    text-shadow: 0 0 15px rgba(var(--neon-cyan-rgb), 0.3);
}

/* 右側裝飾 (保持不變) */
.cyber-decoration {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 0 auto;
}

.ring-outer {
    width: 100%;
    height: 100%;
    border: 2px solid var(--neon-cyan);
    border-radius: 50%;
    position: absolute;
    box-shadow: 0 0 30px rgba(6, 182, 212, 0.2);
}

.ring-inner {
    width: 86%;
    height: 86%;
    border: 1px dashed var(--neon-purple);
    border-radius: 50%;
    position: absolute;
    top: 7%;
    left: 7%;
    animation: spin 10s linear infinite;
}

.cyber-icon {
    font-size: 8rem;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 0 0 20px var(--neon-cyan);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.cursor-blink {
    animation: blink 1s step-end infinite;
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}
</style>