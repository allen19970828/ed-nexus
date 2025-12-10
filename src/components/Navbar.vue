<template>
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
        <div class="container">
            <a class="navbar-brand glitch-wrapper" href="#">
                <i class="bi bi-cpu fs-4 me-2 text-primary-custom"></i>
                <span class="glitch fw-bold" data-text="EDTECH NEXUS">EDTECH NEXUS</span>
                <span class="ms-3 fs-6 text-white opacity-75">教育科技週報</span>
            </a>

            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <i class="bi bi-list text-primary-custom fs-2"></i>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">首頁</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/research">最新學術研究</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/article-template">技術原理文章</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/aboutme">關於版主</router-link>
                    </li>
                    <li class="nav-item ms-lg-3">
                        <button class="btn btn-outline-custom btn-sm" @click="$emit('open-subscribe')">
                            <i class="bi bi-envelope me-2"></i>訂閱週報
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
defineEmits(['open-subscribe']);
</script>

<style scoped>
/* Navbar 樣式已整合至 cyberpunk.css，這裡可以留白或做微調 */
</style>