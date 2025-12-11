<script setup>
import { onMounted } from 'vue';
import { animate, inView, stagger } from 'motion';
import EnaNetwork from '../components/EnaNetwork.vue';

onMounted(() => {
    document.title = 'ENA 認識網絡分析 | EdTech-俞良澄';

    // Hero 動畫
    animate('.hero-content', { opacity: [0, 1], y: [30, 0] }, { duration: 0.8 });

    // Theory Cards 動畫
    inView('.section-theory', () => {
        animate('.theory-card', { opacity: [0, 1], x: [-50, 0] }, { delay: stagger(0.2), duration: 0.6 });
    });

    // Simulator 動畫
    inView('.section-viz', () => {
        animate('.viz-container', { opacity: [0, 1], scale: [0.95, 1] }, { duration: 0.8 });
    });

    // Content 動畫
    inView('.article-content', () => {
        animate('.fade-up', { opacity: [0, 1], y: [20, 0] }, { delay: stagger(0.1), duration: 0.6 });
    });

    // Application Icons 動畫
    inView('.section-apps', () => {
        animate('.app-icon-box', { opacity: [0, 1], y: [20, 0] }, { delay: stagger(0.1), duration: 0.6 });
    });
});
</script>

<template>
    <div class="ena-page" style="margin-top: 76px;">

        <!-- Hero Section -->
        <div class="container py-5 hero-content">
            <div class="row align-items-center mb-5">
                <div class="col-lg-10 mx-auto text-center">
                    <span class="badge border border-info text-info mb-3 px-3 py-2">Quantitative Ethnography</span>
                    <h1 class="display-3 fw-bold text-white mb-3">
                        認識網絡分析 <span class="text-primary-custom">ENA</span>
                    </h1>
                    <h4 class="text-secondary-custom font-monospace mb-4">Epistemic Network Analysis</h4>
                    <p class="lead text-gray-300 mx-auto" style="max-width: 800px;">
                        這是一種創新的混合方法論，它將「定性的深度」與「量化的廣度」結合。
                        透過視覺化概念之間的<strong>共現關係 (Co-occurrences)</strong>，揭示學習者大腦中的認知結構。
                    </p>
                </div>
            </div>
        </div>

        <!-- [RESTORED] Theory Cards Section -->
        <div class="section-theory container py-5 border-bottom border-secondary border-opacity-25">
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card card-custom p-4 h-100 theory-card opacity-0">
                        <div class="display-4 text-info mb-3"><i class="bi bi-diagram-3"></i></div>
                        <h4 class="text-white">超越頻率</h4>
                        <p class="text-gray-400">傳統分析只計算「這個詞出現幾次」。ENA 關注的是「這些詞如何連接」。知識不是孤立的點，而是點與點之間的連線。</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card card-custom p-4 h-100 theory-card opacity-0">
                        <div class="display-4 text-warning mb-3"><i class="bi bi-braces"></i></div>
                        <h4 class="text-white">量化民族誌</h4>
                        <p class="text-gray-400">ENA 植根於量化民族誌 (Quantitative Ethnography)。它利用大數據的統計嚴謹性，來驗證我們對小樣本質性訪談的觀察。
                        </p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card card-custom p-4 h-100 theory-card opacity-0">
                        <div class="display-4 text-success mb-3"><i class="bi bi-layers"></i></div>
                        <h4 class="text-white">動態結構</h4>
                        <p class="text-gray-400">學習是動態的。ENA 可以比較不同時間點、不同群體（如高分群 vs 低分群）的認知網絡結構差異。</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Simulator Section -->
        <div class="section-viz bg-black bg-opacity-50 py-5 border-bottom border-secondary border-opacity-25">
            <div class="container">
                <div class="d-flex align-items-center mb-4 justify-content-center">
                    <h2 class="h3 text-white fw-bold mb-0"><i class="bi bi-cpu me-2 text-warning"></i>認知結構模擬器</h2>
                </div>
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="viz-container">
                            <EnaNetwork />
                            <p class="text-center text-muted small mt-3">
                                <i class="bi bi-info-circle me-1"></i>
                                此模擬器展示了高/低績效組在協作學習中的不同認知路徑。點擊上方按鈕切換不同視角。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Full Report Section -->
        <div class="container py-5 article-content">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="d-flex align-items-center mb-5">
                        <h2 class="h3 text-white fw-bold mb-0">完整研究報告</h2>
                        <div class="ms-3 flex-grow-1" style="height: 1px; background: rgba(6, 182, 212, 0.3);"></div>
                    </div>

                    <!-- Intro -->
                    <div class="fade-up mb-5">
                        <h3 class="text-primary-custom fw-bold mb-3">1. 概述</h3>
                        <p class="text-gray-300 lh-lg">
                            認知連線的科學：認識網絡分析 (Epistemic Network Analysis, ENA)
                            是一種創新的<strong>混合方法論</strong>，融合了定性研究的深度理解和定量研究的嚴謹性。
                            ENA 通過編碼和分割定性數據來構建網絡模型，視覺化概念、知識、行為或其他認知元素之間的<strong>共現關係 (Co-occurrences)</strong>。
                        </p>
                    </div>

                    <!-- Theory (Detailed Text) -->
                    <div class="fade-up mb-5">
                        <h3 class="text-primary-custom fw-bold mb-3">2. 理論基礎與發展</h3>
                        <p class="text-gray-300 lh-lg">
                            傳統學術界常有「定性 vs 定量」之爭。ENA 提出了一個統一框架：
                            定量方法適合估計參數，定性方法適合深度探索。
                            ENA 的核心假設是：<strong>代碼在數據段中的共現模式，反映了具有意義的認知結構。</strong>
                        </p>
                    </div>

                    <!-- Core Concepts -->
                    <div class="fade-up mb-5">
                        <h3 class="text-primary-custom fw-bold mb-3">3. 核心概念</h3>
                        <ul class="list-unstyled">
                            <li class="mb-3">
                                <strong class="text-info">認識 (Epistemic)</strong>：指知識、信念的結構。關注概念之間如何「相互聯繫」，而非單個概念的頻率。
                            </li>
                            <li class="mb-3">
                                <strong class="text-purple">網絡 (Network)</strong>：強調關係至上。節點代表代碼，連線代表共現頻率。
                            </li>
                            <li class="mb-3">
                                <strong class="text-success">分析 (Analysis)</strong>：包含定量建模、SVD 降維與視覺化解釋。
                            </li>
                        </ul>
                    </div>

                    <!-- Workflow (Merged Visual + Text) -->
                    <div class="fade-up mb-5">
                        <h3 class="text-primary-custom fw-bold mb-3">4. 技術工作流程：ROCK 標準</h3>

                        <!-- [RESTORED] Visual Workflow & Code Block -->
                        <div class="row align-items-center mb-5">
                            <div class="col-lg-5 mb-4 mb-lg-0">
                                <div class="list-group bg-transparent">
                                    <div
                                        class="list-group-item bg-transparent border-secondary border-opacity-25 text-gray-300 py-3">
                                        <strong class="text-info">1. 編碼 (Coding)</strong>
                                        <p class="small mb-0">定義認知要素（代碼），例如「批判性思考」、「情感支持」。</p>
                                    </div>
                                    <div
                                        class="list-group-item bg-transparent border-secondary border-opacity-25 text-gray-300 py-3">
                                        <strong class="text-info">2. 分割 (Segmentation)</strong>
                                        <p class="small mb-0">將數據切分為對話單元（Stanza），例如「一分鐘」或「一個回應」。</p>
                                    </div>
                                    <div
                                        class="list-group-item bg-transparent border-secondary border-opacity-25 text-gray-300 py-3">
                                        <strong class="text-info">3. 共現矩陣 (Co-occurrence)</strong>
                                        <p class="small mb-0">計算在同一時間窗口內，代碼同時出現的頻率。</p>
                                    </div>
                                    <div
                                        class="list-group-item bg-transparent border-secondary border-opacity-25 text-gray-300 py-3">
                                        <strong class="text-info">4. SVD 降維</strong>
                                        <p class="small mb-0">使用奇異值分解 (SVD) 將複雜的高維數據投射到二維平面，形成可視化網絡。</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-7">
                                <div class="card card-custom p-0 overflow-hidden border-0">
                                    <div class="bg-dark p-2 border-bottom border-secondary border-opacity-25 d-flex">
                                        <div class="rounded-circle bg-danger me-1" style="width:10px;height:10px;">
                                        </div>
                                        <div class="rounded-circle bg-warning me-1" style="width:10px;height:10px;">
                                        </div>
                                        <div class="rounded-circle bg-success" style="width:10px;height:10px;"></div>
                                    </div>
                                    <div class="p-4 bg-black font-monospace text-success small">
                                        <p class="mb-1"><span class="text-purple">import</span> rENA</p>
                                        <p class="mb-1">data = load("conversation_logs.csv")</p>
                                        <p class="mb-1">units = ["Student_ID"]</p>
                                        <p class="mb-1">codes = ["Leadership", "Reasoning", "Support"]</p>
                                        <p class="mb-3">conversation = ["Group_ID"]</p>
                                        <p class="mb-1 text-gray-400"># Accumulate adjacency vectors</p>
                                        <p class="mb-1">accum = <span class="text-info">ena.accumulate.data</span>(</p>
                                        <p class="mb-1 ps-3">units = units,</p>
                                        <p class="mb-1 ps-3">conversation = conversation,</p>
                                        <p class="mb-1 ps-3">codes = codes,</p>
                                        <p class="mb-1 ps-3">window.size.back = 4</p>
                                        <p class="mb-1">)</p>
                                        <p class="mb-1 text-warning">set = ena.make.set(accum)</p>
                                        <p class="mb-0 blink">_</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p class="text-gray-300 mb-3">
                            為了確保數據管理的透明性，ENA 推薦使用 <strong>ROCK (Reproducible Open Coding Kit)</strong> 標準。
                        </p>

                        <div class="table-responsive mb-4">
                            <table class="table table-dark table-hover border border-secondary border-opacity-25">
                                <thead>
                                    <tr>
                                        <th class="text-info">標準元素</th>
                                        <th class="text-info">描述</th>
                                        <th class="text-info">範例</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>話語 (Utterance)</td>
                                        <td class="text-gray-400">最小可編碼單位</td>
                                        <td class="font-monospace text-warning small">句子、回答</td>
                                    </tr>
                                    <tr>
                                        <td>標識符 (Identifier)</td>
                                        <td class="text-gray-400">機器可讀 ID</td>
                                        <td class="font-monospace text-warning small">[[cid=1]]</td>
                                    </tr>
                                    <tr>
                                        <td>代碼 (Code)</td>
                                        <td class="text-gray-400">研究概念</td>
                                        <td class="font-monospace text-warning small">[[批判性思考]]</td>
                                    </tr>
                                    <tr>
                                        <td>節段 (Section Break)</td>
                                        <td class="text-gray-400">定義分割</td>
                                        <td class="font-monospace text-warning small">---&lt;&lt;Break&gt;&gt;---</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Conclusion -->
                    <div class="fade-up mb-5">
                        <h3 class="text-primary-custom fw-bold mb-3">5. 結論</h3>
                        <p class="text-gray-300 lh-lg">
                            認識網絡分析 (ENA)
                            透過系統地編碼定性數據並可視化共現模式，特別適用於<strong>比較不同群體</strong>（如新手與專家）的認知差異，以及<strong>追蹤動態發展</strong>。
                        </p>
                    </div>

                    <!-- References -->
                    <div class="fade-up section-refs border-top border-secondary border-opacity-25 pt-4">
                        <h5 class="text-muted mb-3">主要參考資源</h5>
                        <p class="small text-muted">
                            本報告引用了 Quantitative Ethnography 社群的權威文獻，包括 Shaffer 等人的基礎理論研究、rENA
                            套件文檔以及多篇關於教育協作與醫療決策的實證研究論文。
                            <br> Sources:
                            <span class="font-monospace">Journal of Learning Analytics, International Journal of
                                Computer-Supported Collaborative Learning, etc.</span>
                        </p>
                    </div>

                </div>
            </div>
        </div>

        <!-- [RESTORED] Application Icons Section -->
        <div class="bg-black bg-opacity-25 py-5 section-apps">
            <div class="container">
                <h3 class="text-white fw-bold text-center mb-5">跨領域應用</h3>
                <div class="row g-4 text-center">
                    <div class="col-md-3">
                        <div class="p-3 app-icon-box opacity-0">
                            <i class="bi bi-mortarboard display-4 text-primary-custom mb-3"></i>
                            <h5 class="text-white">教育協作</h5>
                            <p class="small text-gray-400">分析 CSCL 環境中學生的互動模式。</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="p-3 app-icon-box opacity-0">
                            <i class="bi bi-hospital display-4 text-secondary-custom mb-3"></i>
                            <h5 class="text-white">醫療決策</h5>
                            <p class="small text-gray-400">比較專業醫師與新手在診斷過程中的思維路徑。</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="p-3 app-icon-box opacity-0">
                            <i class="bi bi-controller display-4 text-info mb-3"></i>
                            <h5 class="text-white">遊戲化學習</h5>
                            <p class="small text-gray-400">追蹤玩家在虛擬實習中的工程設計思維發展。</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="p-3 app-icon-box opacity-0">
                            <i class="bi bi-robot display-4 text-warning mb-3"></i>
                            <h5 class="text-white">人機協作</h5>
                            <p class="small text-gray-400">分析人類與 AI 助教之間的溝通與信任建立。</p>
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

.text-purple {
    color: #8b5cf6;
}

.opacity-0 {
    opacity: 0;
}

.table-dark {
    background-color: transparent;
    --bs-table-bg: transparent;
}

.blink {
    animation: blink 1s infinite;
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}
</style>
