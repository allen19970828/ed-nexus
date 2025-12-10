<script setup>
import { onMounted } from 'vue';
import { animate, stagger, inView } from 'motion';

// --- 資料層 ---
const skills = [
    { name: '教育測驗與統計', level: 90, icon: 'bi-bar-chart-line', color: 'text-primary-custom' },
    { name: '認知診斷模型 (CDM)', level: 85, icon: 'bi-diagram-3', color: 'text-secondary-custom' },
    { name: '數位教學與班級經營', level: 95, icon: 'bi-person-video3', color: 'text-primary-custom' },
    { name: '音樂科技與電腦音樂', level: 88, icon: 'bi-music-note-beamed', color: 'text-secondary-custom' },
    { name: '鋼琴演奏與理論作曲', level: 92, icon: 'bi-piano', color: 'text-white' }
];

const experiences = [
    { role: '專任研究助理', org: '國立臺中教育大學', period: 'Current', desc: '參與高層次教育測驗計畫，負責數據分析與計畫執行。', type: 'Research' },
    { role: '代理教師兼導師', org: '臺中市神岡區豐洲國民小學', period: 'History', desc: '一線教學現場，結合數位工具進行班級經營與教學創新。', type: 'Teaching' },
    { role: '代理教師兼導師', org: '臺中市東勢區石角國民小學', period: 'History', desc: '偏鄉教育實踐，深耕基礎教育與學生輔導。', type: 'Teaching' },
    { role: '代理教師', org: '臺中市東勢區東勢國民小學', period: 'History', desc: '音樂專科教學，推動藝術與人文素養。', type: 'Music' }
];

const publications = [
    { title: '以測驗層次和試題層次探討音樂節奏認知診斷測驗之效度化歷程', status: '測驗學刊 (已接受)', tag: 'Journal' },
    { title: '認知診斷模式應用於音樂節奏成效之探討', status: '碩士論文', tag: 'Thesis' },
    { title: '結合金融情境之數學互動式題對於學生學習成效之探討', status: '研討會論文發表', tag: 'Conference' }
];

onMounted(() => {
    document.title = '關於我 | EdTech-俞良澄';

    // --- 1. Hero 區塊動畫 (立即執行) ---
    // 頭像：旋轉 + 彈性縮放
    animate('.avatar-entrance',
        { opacity: [0, 1], scale: [0.5, 1], rotate: [-15, 0] },
        { duration: 1.2, easing: 'spring(1, 80, 10, 0)' }
    );

    // 文字：從右側滑入
    animate('.text-entrance',
        { opacity: [0, 1], x: [100, 0] },
        { duration: 0.8, delay: 0.3 }
    );

    // --- 2. 滾動觸發動畫 (Scroll Trigger) ---

    // 3. 技能卡片 (進入視窗時觸發)
    inView('.skills-section', () => {
        // (1) 卡片本身的上浮動畫 (這部分沒問題，保留)
        animate('.skill-card',
            { opacity: [0, 1], y: [50, 0] },
            { delay: stagger(0.1), duration: 0.5 }
        );

        // (2) 進度條跑動 (修正版：針對每一條 Bar 個別處理)
        const bars = document.querySelectorAll('.progress-bar');

        bars.forEach((bar, index) => {
            // 確保 skills[index] 存在，避免報錯
            if (skills[index]) {
                animate(
                    bar,
                    { width: [0, `${skills[index].level}%`] }, // 從 0 跑到該技能的數值
                    {
                        duration: 1.5,
                        delay: 0.5 + (index * 0.1), // 加上一點延遲，讓它們像階梯一樣跑出來
                        easing: 'ease-out'
                    }
                );
            }
        });
    });

    // 學歷與著作
    inView('.academic-section', () => {
        animate('.academic-item',
            { opacity: [0, 1], x: [-30, 0] },
            { delay: stagger(0.1), duration: 0.6 }
        );
    });

    // 經歷卡片
    inView('.experience-section', () => {
        animate('.exp-card',
            { opacity: [0, 1], y: [30, 0] },
            { delay: stagger(0.1), duration: 0.6 }
        );
    });

    // --- 3. 保險機制 (Failsafe) ---
    // 如果 1.5 秒後動畫還沒讓元素出現，強制移除 opacity-0
    setTimeout(() => {
        document.querySelectorAll('.opacity-0').forEach(el => {
            el.classList.remove('opacity-0');
            el.style.opacity = 1;
        });
    }, 1500);
});
</script>

<template>
    <div class="about-page" style="margin-top: 76px;">

        <div class="container pt-4">
            <router-link to="/" class="btn btn-outline-custom btn-sm">
                <i class="bi bi-arrow-left me-2"></i> 返回首頁
            </router-link>
        </div>

        <section class="py-5 position-relative">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-5 text-center mb-5 mb-lg-0 avatar-entrance opacity-0">
                        <div class="position-relative d-inline-block">
                            <div class="avatar-frame"></div>
                            <div class="avatar-circle bg-dark d-flex align-items-center justify-content-center">
                                <img src="/img/my.png" class="img-fluid"
                                    style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div
                                class="position-absolute bottom-0 end-0 bg-black border border-info rounded px-3 py-1 text-info small">
                                <i class="bi bi-circle-fill text-success me-1" style="font-size: 8px;"></i> ONLINE
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-7 text-entrance opacity-0">
                        <h4 class="text-secondary-custom letter-spacing-2 mb-2">ALLEN YU (俞良澄)</h4>
                        <h1 class="display-4 fw-bold mb-4 text-white">
                            數據與旋律的<br><span class="text-primary-custom glitch-text">跨界指揮家</span>
                        </h1>
                        <p class="lead text-gray-300 mb-4">
                            從音樂系的感性思維，跨越到教育統計的理性分析。我致力於透過 <strong class="text-white">認知診斷模型 (CDM)</strong> 與 <strong
                                class="text-white">數位科技</strong>，解構學習的黑盒子。
                        </p>
                        <div class="d-flex gap-3">
                            <a href="mailto:allen19970828@gmail.com" class="btn btn-primary-custom">聯絡我</a>
                            <button class="btn btn-outline-custom">下載履歷</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5 bg-black bg-opacity-25 skills-section">
            <div class="container">
                <h3 class="section-title text-white mb-5"><i class="bi bi-cpu me-2"></i> 專長領域</h3>
                <div class="row g-4">
                    <div class="col-md-6 col-lg-4 skill-card opacity-0" v-for="(skill, index) in skills" :key="index">
                        <div
                            class="p-4 border border-secondary border-opacity-25 rounded bg-dark bg-opacity-50 h-100 card-custom hover-glow">
                            <i :class="`bi ${skill.icon} fs-2 mb-3 d-block ${skill.color}`"></i>
                            <h5 class="text-white mb-3">{{ skill.name }}</h5>
                            <div class="progress" style="height: 6px; background: rgba(255,255,255,0.1);">
                                <div class="progress-bar"
                                    :class="skill.color === 'text-primary-custom' ? 'bg-info' : 'bg-purple'"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5 academic-section">
            <div class="container">
                <div class="row">
                    <div class="col-lg-5 mb-5">
                        <h3 class="section-title text-white mb-4"><i class="bi bi-mortarboard me-2"></i> 學歷</h3>
                        <div class="timeline-box ps-4 border-start border-info border-opacity-25">
                            <div class="mb-5 position-relative academic-item opacity-0">
                                <span
                                    class="position-absolute top-0 start-0 translate-middle p-2 bg-info border border-light rounded-circle"
                                    style="left: -1.5rem !important;"></span>
                                <h5 class="text-white">理學碩士 (M.S.)</h5>
                                <p class="text-primary-custom">國立臺中教育大學</p>
                                <small class="text-muted d-block">教育資訊與測驗統計研究所</small>
                            </div>
                            <div class="position-relative academic-item opacity-0">
                                <span
                                    class="position-absolute top-0 start-0 translate-middle p-2 bg-purple border border-light rounded-circle"
                                    style="left: -1.5rem !important;"></span>
                                <h5 class="text-white">音樂學士 (B.M.)</h5>
                                <p class="text-secondary-custom">國立臺中教育大學</p>
                                <small class="text-muted d-block">音樂學系</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <h3 class="section-title text-white mb-4"><i class="bi bi-journal-code me-2"></i> 著作</h3>
                        <div class="list-group list-group-flush bg-transparent">
                            <div v-for="(pub, idx) in publications" :key="idx"
                                class="list-group-item bg-transparent border-bottom border-secondary border-opacity-25 text-white py-3 academic-item opacity-0">
                                <span class="badge badge-cyber mb-2">{{ pub.tag }}</span>
                                <h6 class="mb-1">{{ pub.title }}</h6>
                                <small class="text-primary-custom">{{ pub.status }}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5 bg-black bg-opacity-25 experience-section">
            <div class="container">
                <h3 class="section-title text-white text-center mb-5">
                    <i class="bi bi-terminal me-2"></i> 經歷
                </h3>
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="row g-3">
                            <div class="col-md-6 exp-card opacity-0" v-for="(exp, i) in experiences" :key="i">
                                <div class="card card-custom h-100 p-4 hover-glow">
                                    <div class="d-flex justify-content-between mb-3">
                                        <span class="badge border"
                                            :class="exp.type === 'Research' ? 'border-info text-info' : 'border-warning text-warning'">{{
                                                exp.type }}</span>
                                        <small class="text-muted">{{ exp.period }}</small>
                                    </div>
                                    <h5 class="text-white mb-1">{{ exp.role }}</h5>
                                    <p class="text-secondary-custom small mb-3">{{ exp.org }}</p>
                                    <p class="text-gray-400 small mb-0">{{ exp.desc }}</p>
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
.text-gray-300 {
    color: #d1d5db;
}

.text-gray-400 {
    color: #9ca3af;
}

.bg-purple {
    background-color: var(--neon-purple);
}

/* 頭像外框旋轉動畫 */
.avatar-frame {
    width: 220px;
    height: 220px;
    border: 2px dashed var(--neon-cyan);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: spin 20s linear infinite;
}

.avatar-circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 4px solid #0b0f19;
    box-shadow: 0 0 30px rgba(6, 182, 212, 0.3);
    overflow: hidden;
    z-index: 2;
}

/* 懸停發光特效 */
.hover-glow {
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.hover-glow:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(6, 182, 212, 0.2);
    border-color: var(--neon-cyan) !important;
}

@keyframes spin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

/* 確保 opacity-0 有被 CSS 定義 */
.opacity-0 {
    opacity: 0;
}
</style>