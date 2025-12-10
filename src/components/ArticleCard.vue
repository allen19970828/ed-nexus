<template>
    <div class="card card-custom h-100">
        <div class="position-relative">
            <img :src="post.image" class="card-img-top" :alt="post.title">
            <span class="position-absolute top-0 end-0 m-3 badge badge-cyber rounded-pill">
                {{ post.category }}
            </span>
        </div>
        <div class="card-body p-4 d-flex flex-column">
            <div class="mb-2 text-secondary-custom small">
                <i class="bi bi-calendar3 me-1"></i> {{ post.date }}
            </div>
            <h5 class="card-title mb-3 fw-bold">{{ post.title }}</h5>
            <p class="card-text mb-4 flex-grow-1 text-muted">{{ post.excerpt }}</p>

            <router-link :to="post.link ? post.link : `/article/${post.id}`"
                class="btn btn-sm btn-outline-custom align-self-start">
                READ MORE_
            </router-link>

        </div>
    </div>
</template>

<script setup>
defineProps({
    post: {
        type: Object,
        required: true
    }
});
</script>