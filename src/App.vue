<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { RouterView } from 'vue-router'; // 關鍵：引入 RouterView
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

// 訂閱功能維持在全域
const handleSubscribe = () => {
  Swal.fire({
    title: 'SUBSCRIBE',
    text: '加入 EDTECH NEXUS 週報，掌握最新教育科技趨勢！',
    icon: 'info',
    background: 'rgba(0, 0, 0, 0.9)',
    color: '#fff',
    confirmButtonText: 'CONFIRM',
    customClass: {
      popup: 'swal-cyberpunk',
      confirmButton: 'btn btn-primary-custom text-white',
      title: 'glitch-text'
    },
    buttonsStyling: false
  });
};

// 全域滑鼠特效
const cursorRef = ref(null);
const updateCursor = (e) => {
  if (cursorRef.value) {
    cursorRef.value.style.left = e.clientX + 'px';
    cursorRef.value.style.top = e.clientY + 'px';
  }
  const target = e.target;
  if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
    cursorRef.value?.classList.add('hovered');
  } else {
    cursorRef.value?.classList.remove('hovered');
  }
};

onMounted(() => {
  window.addEventListener('mousemove', updateCursor);
});
</script>

<template>
  <div class="cyber-grid"></div>
  <div class="scanlines"></div>
  <div ref="cursorRef" class="custom-cursor d-none d-lg-block"></div>

  <Navbar @open-subscribe="handleSubscribe" />

  <RouterView />

  <Footer />
</template>