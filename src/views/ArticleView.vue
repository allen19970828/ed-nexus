<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const articleId = route.params.id;

// --- 1. 模擬文章資料 (Mock Data) ---
const article = ref({
    title: 'AI 進入教室：是助手還是對手？',
    meta: {
        date: '2025.04.12',
        author: 'CyberDidact Unit-01',
        category: 'AI Education',
        readTime: '5 min read'
    },
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
    // 這裡模擬文章結構
    sections: [
        { id: 'intro', title: '前言：數位奇點', content: '當 ChatGPT 在 2022 年橫空出世，教育界的防火牆瞬間被擊穿。這不只是一個聊天機器人，這是人類知識獲取方式的徹底重構。我們不再需要背誦，而是需要學會「提問」。' },
        { id: 'sec1', title: '傳統教育的崩解', content: '過去的「填鴨式」教育在 AI 面前顯得蒼白無力。試想，當一個學生可以用 3 秒鐘生成一篇 500 字的歷史報告，老師改作業的意義何在？重點不再是產出結果，而是產出的過程與邏輯驗證。' },
        { id: 'sec2', title: 'AI 協作模式 (Co-Pilot)', content: '未來的教室將採用「人機協作」模式。AI 不是來取代老師，而是成為每個學生的專屬家教 (Personal Tutor)。它可以 24 小時不間斷地回答問題，並根據學生的程度調整難度。' },
        { id: 'code', title: '程式碼範例：Python AI 介接', content: '透過簡單的 API 呼叫，我們可以將 AI 整合進學習系統：' }, // 專門用來展示代碼塊
        { id: 'sec3', title: '倫理與挑戰', content: '然而，Deepfake、數據偏見與隱私權問題如同懸在頭上的達摩克利斯之劍。我們在擁抱便利的同時，是否正在出賣下一代的思考能力？這是每一位教育者必須深思的課題。' },
        { id: 'conclusion', title: '結論：進化或淘汰', content: '技術不會等待人類。我們要做的不是禁止 AI 進入校園，而是教導下一代如何駕馭這個強大的外骨骼。' }
    ]
});

// --- 2. 閱讀進度條邏輯 ---
const progressWidth = ref('0%');

const updateProgress = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
    progressWidth.value = `${scrolled}%`;
};

// --- 3. 側邊欄目錄高亮邏輯 (簡單版) ---
const activeSection = ref('');
const observer = ref(null);

onMounted(() => {
    window.addEventListener('scroll', updateProgress);

    // 建立 IntersectionObserver 來偵測目前讀到哪一段
    observer.value = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeSection.value = entry.target.id;
            }
        });
    }, { rootMargin: '-20% 0px -50% 0px' });

    // 觀察所有段落
    document.querySelectorAll('.article-section').forEach(section => {
        observer.value.observe(section);
    });
});

onUnmounted(() => {
    window.removeEventListener('scroll', updateProgress);
    if (observer.value) observer.value.disconnect();
});
</script>

<template>
    <div class="reading-progress-bar" :style="{ width: progressWidth }"></div>

    <div class="container article-container">
        <nav aria-label="breadcrumb" class="mb-4 fade-in-up">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link to="/"
                        class="text-secondary-custom text-decoration-none">Home</router-link></li>
                <li class="breadcrumb-item text-muted">Articles</li>
                <li class="breadcrumb-item active text-white" aria-current="page">ID: {{ articleId }}</li>
            </ol>
        </nav>

        <div class="row">
            <div class="col-lg-8">
                <article class="blog-post">
                    <header class="mb-5 fade-in-up">
                        <div class="mb-3">
                            <span class="badge badge-cyber rounded-pill me-2">{{ article.meta.category }}</span>
                            <span class="text-muted small"><i class="bi bi-clock me-1"></i>{{ article.meta.readTime
                            }}</span>
                        </div>
                        <h1 class="display-4 fw-bold mb-3 glitch-text">{{ article.title }}</h1>
                        <div class="d-flex align-items-center text-muted small">
                            <i class="bi bi-person-circle me-2"></i>
                            <span class="me-3">{{ article.meta.author }}</span>
                            <i class="bi bi-calendar3 me-2"></i>
                            <span>{{ article.meta.date }}</span>
                        </div>
                    </header>

                    <figure class="mb-5 fade-in-up" style="animation-delay: 0.1s;">
                        <img :src="article.image"
                            class="img-fluid rounded border border-secondary border-opacity-25 w-100" alt="Cover">
                        <figcaption class="figure-caption text-end mt-2 text-primary-custom">/// SYSTEM_IMAGE_LOADED
                        </figcaption>
                    </figure>

                    <div class="article-body">
                        <div v-for="(section, index) in article.sections" :key="section.id" :id="section.id"
                            class="article-section mb-5 fade-in-up"
                            :style="{ animationDelay: `${0.2 + (index * 0.1)}s` }">

                            <h2 class="h3 fw-bold mb-3 text-white position-relative d-inline-block">
                                {{ section.title }}
                                <div class="heading-underline"></div>
                            </h2>

                            <p class="lead text-light opacity-75 lh-lg">{{ section.content }}</p>

                            <div v-if="section.id === 'code'" class="code-block-wrapper my-4">
                                <div
                                    class="d-flex justify-content-between bg-dark px-3 py-2 border-bottom border-secondary">
                                    <span class="text-muted small">python_script.py</span>
                                    <span class="text-success small">● Active</span>
                                </div>
                                <pre class="m-0 p-3 bg-black text-warning"><code>import openai

def ask_tutor(question):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Explain this to a 5th grader: {question}",
        max_tokens=100
    )
    return response.choices[0].text</code></pre>
                            </div>
                        </div>
                    </div>
                </article>

                <div class="d-flex justify-content-between py-5 border-top border-secondary border-opacity-25 mt-5">
                    <router-link to="/" class="btn btn-outline-custom">
                        <i class="bi bi-arrow-left me-2"></i>回首頁
                    </router-link>
                    <button class="btn btn-primary-custom">
                        分享傳輸 <i class="bi bi-share ms-2"></i>
                    </button>
                </div>
            </div>

            <div class="col-lg-4 d-none d-lg-block">
                <div class="sticky-top" style="top: 100px; z-index: 10;">
                    <div class="card card-custom p-4">
                        <h5 class="fw-bold mb-4 text-primary-custom">
                            <i class="bi bi-list-columns-reverse me-2"></i>目錄導航
                        </h5>
                        <ul class="list-unstyled toc-list">
                            <li v-for="section in article.sections" :key="section.id" class="mb-3">
                                <a :href="`#${section.id}`"
                                    class="toc-link text-decoration-none d-block py-1 px-3 border-start border-2"
                                    :class="{ 'active': activeSection === section.id }">
                                    {{ section.title }}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="card card-custom p-4 mt-4 border-warning">
                        <h6 class="text-warning mb-3">/// PROMOTION</h6>
                        <p class="small text-muted">訂閱 Premium 方案以解鎖更多高階教學資源與原始碼下載。</p>
                        <button class="btn btn-sm btn-outline-warning w-100">UPGRADE_</button>
                    </div>

                    <!-- Related Tools Card -->
                    <div class="card card-custom p-4 mt-4 border-info">
                        <ul class="list-unstyled">
                            <li class="mb-2">
                                <a href="#/ena" class="text-decoration-none text-info">
                                    <i class="bi bi-diagram-3 me-2"></i>認知結構模擬器 (ENA)
                                </a>
                            </li>
                            <li class="mb-2">
                                <a href="#/cdm" class="text-decoration-none text-success">
                                    <i class="bi bi-grid-3x3 me-2"></i>Q 矩陣與機率模型 (CDM)
                                </a>
                            </li>
                            <li class="mb-2">
                                <a href="#/ctt" class="text-decoration-none text-primary-custom">
                                    <i class="bi bi-calculator me-2"></i>古典測驗理論 (CTT)
                                </a>
                            </li>
                            <li class="mb-2">
                                <a href="#/ann" class="text-decoration-none text-info">
                                    <i class="bi bi-cpu me-2"></i>類神經網路 (ANN)
                                </a>
                            </li>
                            <li class="mb-2">
                                <a href="#/nlp" class="text-decoration-none text-success">
                                    <i class="bi bi-chat-quote-fill me-2"></i>自然語言處理 (NLP)
                                </a>
                            </li>
                            <li class="mb-2">
                                <a href="#/dea" class="text-decoration-none text-warning">
                                    <i class="bi bi-graph-up-arrow me-2"></i>資料包絡分析 (DEA)
                                </a>
                            </li>
                            <li class="mb-2">
                                <a href="#/survey-cdm" class="text-decoration-none text-purple-custom">
                                    <i class="bi bi-grid-3x3 me-2"></i>認知診斷模型 (CDM)
                                </a>
                            </li>
                            <li class="mb-2">
                                <a href="#/rag-ft" class="text-decoration-none text-danger">
                                    <i class="bi bi-sliders me-2"></i>RAG vs Fine-tuning
                                </a>
                            </li>
                            <li>
                                <a href="#/irt-intro" class="text-decoration-none text-secondary-custom">
                                    <i class="bi bi-bar-chart-steps me-2"></i>IRT 參數實驗室
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.article-container {
    margin-top: 100px;
}

/* 頂部閱讀進度條 */
.reading-progress-bar {
    position: fixed;
    top: 76px;
    /* Navbar 高度 */
    left: 0;
    height: 3px;
    background: var(--neon-cyan);
    box-shadow: 0 0 10px var(--neon-cyan);
    z-index: 1040;
    transition: width 0.1s ease;
}

/* 標題裝飾線 */
.heading-underline {
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--neon-purple);
    box-shadow: 0 0 10px var(--neon-purple);
}

/* 代碼區塊風格 */
.code-block-wrapper {
    border: 1px solid #333;
    border-radius: 6px;
    overflow: hidden;
    font-family: 'Courier New', Courier, monospace;
}

/* 目錄連結 (TOC) */
.toc-link {
    color: rgba(255, 255, 255, 0.5);
    border-color: transparent;
    transition: all 0.3s;
}

.toc-link:hover {
    color: #fff;
    padding-left: 1.5rem !important;
    /* hover 時往右縮排 */
}

.toc-link.active {
    color: var(--neon-cyan);
    border-color: var(--neon-cyan) !important;
    background: linear-gradient(90deg, rgba(6, 182, 212, 0.1), transparent);
}

/* 進場動畫 */
.fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>