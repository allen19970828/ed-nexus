<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { animate } from 'motion'

onMounted(() => {
    document.title = 'EduNLP 教育智能實驗室 | EdTech-俞良澄';
    animate('.hero-content', { opacity: [0, 1], y: [30, 0] }, { duration: 0.8 });
});

// ==========================================
// Lab 1: Transformer 注意力機制 (Self-Attention)
// ==========================================
// 模擬句子
const attentionSentence = ref("The animal didn't cross the street because it was too tired")
const tokens = computed(() => attentionSentence.value.split(" "))

// 模擬的注意力權重矩陣 (Simulated Attention Weights)
const attentionWeights = {
    "it": { "The": 0.0, "animal": 0.8, "didn't": 0.0, "cross": 0.1, "the": 0.0, "street": 0.0, "because": 0.1, "it": 1.0, "was": 0.0, "too": 0.0, "tired": 0.0 },
    "tired": { "The": 0.0, "animal": 0.7, "didn't": 0.0, "cross": 0.0, "the": 0.0, "street": 0.0, "because": 0.0, "it": 0.9, "was": 0.1, "too": 0.5, "tired": 1.0 },
    "street": { "The": 0.1, "animal": 0.0, "didn't": 0.1, "cross": 0.7, "the": 0.5, "street": 1.0, "because": 0.0, "it": 0.0, "was": 0.0, "too": 0.0, "tired": 0.0 }
}

const hoveredToken = ref(null)

const getOpacity = (targetToken) => {
    if (!hoveredToken.value) return 0.1
    const weights = attentionWeights[hoveredToken.value]
    // 如果沒有定義權重，給一個基於距離的預設衰減值 (模擬局部注意力)
    if (!weights) {
        return 0.1
    }
    return weights[targetToken] || 0.05
}

// ==========================================
// Lab 2: 蘇格拉底式 AI 導師 (Socratic Tutor)
// ==========================================
// 概念來源：報告中的 Sakshm AI / Disha
const chatHistory = ref([
    { role: 'ai', text: '你好！我是你的 AI 程式設計導師。今天我們來學 Python 的迴圈。請問：如何印出 0 到 4 的數字？' }
])
const userMessage = ref('')

// 簡單的關鍵字規則引擎 (模擬 NLP 意圖識別)
const processReply = () => {
    if (!userMessage.value.trim()) return

    // 1. 加入用戶訊息
    chatHistory.value.push({ role: 'user', text: userMessage.value })

    const input = userMessage.value.toLowerCase()
    let reply = ""

    // 2. 蘇格拉底式引導邏輯 (不給答案，只給提示)
    if (input.includes('print(0, 1, 2, 3, 4)')) {
        reply = "這是一個方法，但如果要印出 0 到 100 呢？有沒有更聰明的方法來重複執行？"
    } else if (input.includes('for') && input.includes('range(5)')) {
        reply = "太棒了！完全正確。range(5) 會產生 0,1,2,3,4。你掌握了 range 的左閉右開特性！"
    } else if (input.includes('for') && input.includes('range(4)')) {
        reply = "很接近了！但是 range(4) 會停在哪個數字呢？記得電腦通常是從 0 開始數的。"
    } else if (input.includes('while')) {
        reply = "用 while 也可以，但對於固定次數的迴圈，有沒有更簡潔的語法？試試看 f... 開頭的？"
    } else {
        reply = "試著思考一下「範圍 (Range)」的概念。在 Python 中，我們通常用哪個關鍵字來進行迭代？"
    }

    // 3. 延遲模擬打字感
    setTimeout(() => {
        chatHistory.value.push({ role: 'ai', text: reply })
    }, 600)

    userMessage.value = ''
}

// ==========================================
// Lab 3: 自動評分與情感分析 (AES & Sentiment)
// ==========================================
const essayText = ref("我認為這門課程非常有幫助。雖然內容有點難，特別是數學的部分讓我感到困惑，但是老師的解釋很清晰。我學到了很多關於 NLP 的知識，這讓我感到很興奮！")

const analysisResult = reactive({
    sentiment: '中性',
    score: 0,
    keywords: [],
    feedback: ''
})

// 模擬 NLP 分析管道
const analyzeEssay = () => {
    const text = essayText.value

    // 1. 情感分析 (基於簡單的詞庫匹配)
    const positiveWords = ['有幫助', '清晰', '學到', '興奮', '棒', '喜歡']
    const negativeWords = ['難', '困惑', '不懂', '糟', '問題']

    let posCount = 0
    let negCount = 0

    positiveWords.forEach(w => { if (text.includes(w)) posCount++ })
    negativeWords.forEach(w => { if (text.includes(w)) negCount++ })

    const totalSentiment = posCount - negCount
    if (totalSentiment > 1) analysisResult.sentiment = '正向 Positive 😊'
    else if (totalSentiment < -1) analysisResult.sentiment = '負向 Negative 😟'
    else analysisResult.sentiment = '中性 Neutral 😐'

    // 2. 關鍵字提取 (NER 模擬)
    analysisResult.keywords = ['課程', '數學', '老師', 'NLP'].filter(k => text.includes(k))

    // 3. 自動評分 (AES 邏輯模擬：長度 + 詞彙豐富度 + 情感平衡)
    let baseScore = 60
    if (text.length > 20) baseScore += 10
    if (text.length > 50) baseScore += 10
    if (analysisResult.keywords.length >= 2) baseScore += 10
    if (posCount > 0 && negCount > 0) baseScore += 10 // 批判性思考加分

    analysisResult.score = Math.min(100, baseScore)

    // 4. 生成回饋
    if (analysisResult.score > 85) analysisResult.feedback = "優秀的反饋！內容詳實且包含具體細節。"
    else if (analysisResult.score > 70) analysisResult.feedback = "寫得不錯，但可以嘗試加入更多具體的學習例子。"
    else analysisResult.feedback = "內容稍顯簡短，請嘗試多描述一些你的具體感受。"
}

</script>

<template>
    <div class="nlp-page" style="margin-top: 76px;">

        <!-- Hero Section -->
        <div class="container py-5 hero-content">
            <div class="row align-items-center mb-5">
                <div class="col-lg-10 mx-auto text-center">
                    <span class="badge border border-success text-success mb-3 px-3 py-2">Natural Language
                        Processing</span>
                    <h1 class="display-3 fw-bold text-white mb-3">
                        智慧教育實驗室 <span class="text-primary-custom">EduNLP</span>
                    </h1>
                    <h4 class="text-secondary-custom font-monospace mb-4">NLP in Education</h4>
                    <p class="lead text-gray-300 mx-auto" style="max-width: 800px;">
                        探索 NLP 如何改變學習。從 Transformer 的注意力機制，到蘇格拉底式 AI 導師與自動化評分系統。
                    </p>
                </div>
            </div>
        </div>

        <div class="container pb-5">

            <!-- Section 1: Attention Mechanism -->
            <section class="card card-custom p-4 mb-5 border-success">
                <div
                    class="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                    <h2 class="h3 text-white fw-bold mb-0">1. Transformer 注意力機制</h2>
                    <span
                        class="badge bg-success bg-opacity-10 text-success border border-success font-monospace">Self-Attention</span>
                </div>
                <p class="text-gray-400 mb-4">
                    現代 NLP 的基石是 <strong>Transformer</strong> 與 <strong>注意力機制</strong>。
                    它解決了長距離依賴的問題。請將滑鼠懸停在下方的單詞上（特別是 <strong class="text-white">"it"</strong>），觀察它「關注」了哪些詞來理解語意。
                </p>

                <div class="attention-box bg-dark p-4 rounded border border-secondary border-opacity-25 text-center">
                    <div class="tokens-container d-flex flex-wrap gap-2 justify-content-center mb-4 position-relative">
                        <span v-for="(token, index) in tokens" :key="index"
                            class="token px-3 py-2 rounded border transition-all position-relative fw-bold"
                            :class="hoveredToken === token ? 'bg-success text-white border-success shadow-lg' : 'bg-black text-gray-300 border-secondary border-opacity-50'"
                            @mouseover="hoveredToken = token" @mouseleave="hoveredToken = null"
                            style="cursor: pointer; z-index: 2;">
                            {{ token }}
                            <!-- Visualizing attention lines using absolute divs is tricky in responsive, 
                             using opacity on tokens themselves might be cleaner or SVG overlay.
                             Here implementing simpler opacity feedback for connected tokens -->
                        </span>

                        <!-- Feedback for connected tokens (Simulated logic using class/style on sibling tokens would be complex in Vue loop without shared state, 
                          instead we check hoveredToken in the loop above) -->
                    </div>

                    <!-- Dynamic Explanation Box -->
                    <div class="explanation p-3 rounded bg-black border border-secondary border-opacity-25"
                        style="min-height: 60px;">
                        <div v-if="hoveredToken === 'it'" class="text-gray-300 fading-text">
                            <strong class="text-info">🤖 模型解讀：</strong> 當模型看到 "it" 時，它強烈關注 <strong
                                class="text-success">"animal"</strong> (權重高)，因為它知道是動物累了，而不是街道累了。這就是語意消歧義。
                        </div>
                        <div v-else-if="hoveredToken" class="text-gray-300 fading-text">
                            <strong class="text-secondary-custom">👁️ 當前關注：</strong> <span class="text-white">{{
                                hoveredToken }}</span> <br>
                            <small class="text-muted">(其他高亮單詞代表 Attention 權重較高)</small>
                        </div>
                        <div v-else class="text-gray-500 fading-text">
                            👆 請將滑鼠移動到單詞上 (試試 "it")
                        </div>
                    </div>

                    <!-- Visual helper: We modify styles of OTHER tokens based on hoveredToken -->
                    <component :is="'style'">
                        {{hoveredToken ? tokens.map(t => {
                            const op = getOpacity(t);
                            return op > 0.1 ? `.token:not(:hover):nth-child(${tokens.indexOf(t) + 1}) { border-color:
                        rgba(16, 185, 129, ${op}) !important; color: rgba(16, 185, 129, ${op + 0.5}) !important; }` : ''
                        }).join(' ') : ''}}
                    </component>
                </div>
            </section>

            <div class="row g-4">
                <!-- Section 2: Socratic Tutor -->
                <div class="col-lg-6">
                    <section class="card card-custom p-4 h-100 border-info">
                        <div
                            class="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                            <h2 class="h3 text-white fw-bold mb-0">2. 蘇格拉底式 AI 導師 (ITS)</h2>
                        </div>
                        <p class="text-gray-400 mb-4">
                            像 <strong>Sakshm AI</strong> 這樣的系統使用「蘇格拉底教學法」。它不會直接給你答案，而是通過提問引導你思考。<br>
                            <span class="text-info small"><i class="bi bi-lightbulb"></i> 試著回答錯誤看看！</span>
                        </p>

                        <div class="chat-interface d-flex flex-column bg-black rounded border border-secondary border-opacity-25 overflow-hidden"
                            style="height: 400px;">
                            <div class="messages flex-grow-1 p-3 overflow-auto d-flex flex-column gap-3">
                                <div v-for="(msg, i) in chatHistory" :key="i"
                                    class="message d-flex gap-2 align-items-end"
                                    :class="msg.role === 'user' ? 'flex-row-reverse' : ''">

                                    <div class="avatar d-flex align-items-center justify-content-center rounded-circle fs-5"
                                        style="width: 32px; height: 32px;"
                                        :class="msg.role === 'ai' ? 'bg-info text-dark' : 'bg-primary text-white'">
                                        {{ msg.role === 'ai' ? '🤖' : '🧑‍🎓' }}
                                    </div>

                                    <div class="bubble p-2 px-3 rounded-3 text-white shadow-sm"
                                        style="max-width: 85%; font-size: 0.95em; line-height: 1.5;"
                                        :class="msg.role === 'ai' ? 'bg-dark border border-secondary border-opacity-50 rounded-bottom-right-0' : 'bg-primary border border-primary rounded-bottom-left-0'">
                                        {{ msg.text }}
                                    </div>
                                </div>
                            </div>

                            <div
                                class="input-area p-2 bg-dark border-top border-secondary border-opacity-25 d-flex gap-2">
                                <input v-model="userMessage" @keyup.enter="processReply" type="text"
                                    class="form-control bg-black text-white border-secondary border-opacity-50"
                                    placeholder="輸入你的程式碼或想法..." />
                                <button @click="processReply" class="btn btn-info fw-bold">發送</button>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Section 3: Auto Grader -->
                <div class="col-lg-6">
                    <section class="card card-custom p-4 h-100 border-warning">
                        <div
                            class="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                            <h2 class="h3 text-white fw-bold mb-0">3. 自動評測 (AES)</h2>
                        </div>
                        <p class="text-gray-400 mb-4">
                            <strong>AES 系統</strong>利用 NLP 分析學生作業。這裡演示了如何結合情感分析與關鍵字提取來進行自動評分。
                        </p>

                        <div class="grader-interface d-flex flex-column gap-3">
                            <textarea v-model="essayText" rows="6"
                                class="form-control bg-black text-white border-secondary border-opacity-50"
                                placeholder="輸入你的學習心得..."></textarea>

                            <button class="btn btn-warning w-100 fw-bold" @click="analyzeEssay">
                                <i class="bi bi-stars me-1"></i> 開始 AI 評分
                            </button>

                            <div v-if="analysisResult.score > 0"
                                class="result-panel p-3 rounded border border-success border-opacity-50 bg-success bg-opacity-10 d-flex gap-3 align-items-center animate__animated animate__fadeIn">
                                <div class="score-circle position-relative d-flex align-items-center justify-content-center rounded-circle"
                                    :style="`width: 70px; height: 70px; background: conic-gradient(#10b981 ${analysisResult.score}%, rgba(255,255,255,0.1) 0)`">
                                    <div class="bg-black rounded-circle position-absolute d-flex align-items-center justify-content-center text-success fw-bold fs-4"
                                        style="width: 58px; height: 58px; top: 6px; left: 6px;">
                                        {{ analysisResult.score }}
                                    </div>
                                </div>

                                <div class="metric-list flex-grow-1 small text-gray-300">
                                    <div class="mb-1"><strong>情感極性：</strong> <span
                                            :class="analysisResult.sentiment.includes('Positive') ? 'text-success' : (analysisResult.sentiment.includes('Negative') ? 'text-danger' : 'text-warning')">{{
                                                analysisResult.sentiment }}</span></div>
                                    <div class="mb-1"><strong>關鍵字：</strong> <span class="text-info">{{
                                        analysisResult.keywords.join(', ') }}</span></div>
                                    <div
                                        class="mt-2 pt-2 border-top border-secondary border-opacity-25 fst-italic text-white">
                                        "{{ analysisResult.feedback }}"
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
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

.text-gray-500 {
    color: #6b7280;
}

.token {
    transition: all 0.2s ease;
}

.transition-all {
    transition: all 0.3s ease;
}
</style>
