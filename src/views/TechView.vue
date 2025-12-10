<script setup>
import { ref, computed, onMounted } from 'vue';
import { animate, stagger, inView } from 'motion';

// --- 資料層 ---
const docs = [
    {
        id: 'T01', title: 'Transformer 架構解析', subtitle: 'Attention Is All You Need',
        category: 'AI / NLP', difficulty: 'Hard',
        desc: '深度解析 Self-Attention 機制如何讓機器理解語言的上下文關聯。從 Encoder 到 Decoder 的數學原理拆解。',
        code: `def scaled_dot_product(q, k, v):\n  d_k = q.size(-1)\n  scores = torch.matmul(q, k) / math.sqrt(d_k)\n  return F.softmax(scores) @ v`, link: '#'
    },
    {
        id: 'T02', title: '零知識證明 (ZKP) 於教育證書之應用', subtitle: 'Zero-Knowledge Proofs',
        category: 'Cryptography', difficulty: 'Medium',
        desc: '如何在不洩露學生成績隱私的前提下，向第三方證明該學生已修畢特定課程並通過門檻。',
        code: `circuit CheckGrade(private score, public threshold) {\n  assert(score >= threshold);\n  return true;\n}`, link: '#'
    },
    {
        id: 'T03', title: 'WebXR 光線投射與互動', subtitle: 'Raycasting in Three.js',
        category: 'VR / AR', difficulty: 'Easy',
        desc: '在虛擬空間中，如何透過手把發出的隱形射線來選取物件？探討 3D 空間座標轉換與碰撞偵測原理。',
        code: `const raycaster = new THREE.Raycaster();\nraycaster.setFromCamera(pointer, camera);\nconst intersects = raycaster.intersectObjects(scene.children);`, link: '#'
    },
    {
        id: 'T04', title: '自適應學習演算法 (CAT)', subtitle: 'Item Response Theory',
        category: 'Algorithm', difficulty: 'Hard',
        desc: '基於 IRT 理論的電腦化適性測驗。如何根據學生上一題的對錯，動態決定下一題的難度係數。',
        code: `theta_new = theta_old + (u - P(theta)) / I(theta)\n# Newton-Raphson Method`, link: '#'
    }
];

const searchQuery = ref('');
const filteredDocs = computed(() => {
    if (!searchQuery.value) return docs;
    const q = searchQuery.value.toLowerCase();
    return docs.filter(d => d.title.toLowerCase().includes(q) || d.code.toLowerCase().includes(q));
});

onMounted(() => {
    document.title = '技術原理 | EdTech-俞良澄';

    // 1. 動畫邏輯
    animate('.search-bar', { opacity: [0, 1], scaleX: [0.8, 1] }, { duration: 0.8 });

    inView('.tech-grid', () => {
        animate('.tech-card',
            { opacity: [0, 1], y: [30, 0] },
            { delay: stagger(0.1), duration: 0.5 }
        );
    });

    // 2. 防呆保險機制 (Failsafe)
    setTimeout(() => {
        document.querySelectorAll('.opacity-0').forEach(el => {
            el.classList.remove('opacity-0');
            el.style.opacity = 1;
        });
    }, 1500);
});
</script>

<template>
    <div class="tech-page" style="margin-top: 76px;">
        <div class="container py-5">
            <div class="row mb-5 align-items-end">
                <div class="col-lg-6 mb-4 mb-lg-0">
                    <h5 class="text-secondary-custom font-monospace">/// TECHNICAL_DOCS</h5>
                    <h1 class="display-4 fw-bold text-white">
                        技術原理 <span class="text-primary-custom">白皮書</span>
                    </h1>
                </div>

                <div class="col-lg-6 search-bar opacity-0 origin-left">
                    <div class="input-group">
                        <span
                            class="input-group-text bg-transparent border-secondary text-primary-custom font-monospace">>_</span>
                        <input v-model="searchQuery" type="text"
                            class="form-control bg-transparent border-secondary text-white font-monospace"
                            placeholder="SEARCH_PROTOCOL...">
                        <button class="btn btn-outline-custom">EXECUTE</button>
                    </div>
                </div>
            </div>

            <div class="row g-4 tech-grid">
                <div class="col-lg-6" v-for="doc in filteredDocs" :key="doc.id">
                    <div class="tech-card opacity-0 h-100 position-relative">
                        <div class="corner-top-left"></div>
                        <div class="corner-bottom-right"></div>

                        <div class="card card-custom h-100 p-0 overflow-hidden border-0">
                            <div
                                class="card-header bg-dark bg-opacity-50 border-bottom border-secondary border-opacity-25 p-3 d-flex justify-content-between align-items-center">
                                <span class="badge border border-info text-info font-monospace">{{ doc.id }}</span>
                                <span class="text-muted small font-monospace">{{ doc.category }}</span>
                            </div>

                            <div class="card-body p-4">
                                <div class="d-flex justify-content-between mb-2">
                                    <h3 class="h4 text-white fw-bold mb-0">{{ doc.title }}</h3>
                                    <span class="badge"
                                        :class="{ 'bg-success': doc.difficulty === 'Easy', 'bg-warning text-dark': doc.difficulty === 'Medium', 'bg-danger': doc.difficulty === 'Hard' }">{{
                                        doc.difficulty }}</span>
                                </div>
                                <p class="text-secondary-custom small mb-3">{{ doc.subtitle }}</p>
                                <p class="text-gray-300 mb-4">{{ doc.desc }}</p>
                                <div
                                    class="code-preview bg-black p-3 rounded mb-3 border border-secondary border-opacity-25 position-relative">
                                    <pre class="m-0 text-success font-monospace small"><code>{{ doc.code }}</code></pre>
                                    <div class="scan-line"></div>
                                </div>
                                <a :href="doc.link"
                                    class="btn btn-sm btn-outline-custom w-100 font-monospace">VIEW_DOCUMENTATION <i
                                        class="bi bi-arrow-up-right ms-2"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="filteredDocs.length === 0" class="text-center py-5">
                <p class="text-danger font-monospace">ERROR: PROTOCOL_NOT_FOUND</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.text-gray-300 {
    color: #d1d5db;
}

.origin-left {
    transform-origin: left;
}

.form-control:focus {
    box-shadow: none;
    border-color: var(--neon-cyan);
    background: rgba(6, 182, 212, 0.1) !important;
}

.tech-card {
    transition: transform 0.3s ease;
}

.tech-card:hover {
    transform: translateY(-5px);
}

.corner-top-left {
    position: absolute;
    top: -1px;
    left: -1px;
    width: 20px;
    height: 20px;
    border-top: 3px solid var(--neon-cyan);
    border-left: 3px solid var(--neon-cyan);
    z-index: 2;
}

.corner-bottom-right {
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 20px;
    height: 20px;
    border-bottom: 3px solid var(--neon-purple);
    border-right: 3px solid var(--neon-purple);
    z-index: 2;
}

.code-preview {
    overflow: hidden;
}

.scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(6, 182, 212, 0.5);
    box-shadow: 0 0 10px var(--neon-cyan);
    animation: scan 3s linear infinite;
}

@keyframes scan {
    0% {
        top: 0%;
        opacity: 0;
    }

    10% {
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    100% {
        top: 100%;
        opacity: 0;
    }
}

/* 確保 opacity-0 有定義 */
.opacity-0 {
    opacity: 0;
}
</style>