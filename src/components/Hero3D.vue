<script setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';

const canvasRef = ref(null);

onMounted(() => {
    const scene = new THREE.Scene();
    // 視角稍微拉遠一點 (z = 6)，以免物體太大壓迫感太重
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 500, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true });

    const updateSize = () => {
        // --- 新增這行：安全檢查 ---
        // 如果畫布還沒生成 (null)，就直接結束，不要往下執行
        if (!canvasRef.value) return;

        const container = canvasRef.value.parentElement;
        if (container) {
            renderer.setSize(container.clientWidth, container.clientHeight);
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
        }
    };

    // --- 關鍵修改：材質設定 ---
    const geometry = new THREE.IcosahedronGeometry(2.8, 0); //稍微變大一點點
    const material = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.8  // <--- 從 0.15 改成 0.8 (大幅增強亮度)
    });

    // 額外加一個核心，讓它看起來更有層次 (可選)
    const innerGeometry = new THREE.IcosahedronGeometry(1.0, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6, // 紫色核心
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const cyberShape = new THREE.Mesh(geometry, material);
    const coreShape = new THREE.Mesh(innerGeometry, innerMaterial);

    // 把兩個物體綁在一起
    const group = new THREE.Group();
    group.add(cyberShape);
    group.add(coreShape);
    scene.add(group);

    camera.position.z = 6;

    const animate = () => {
        requestAnimationFrame(animate);

        // 旋轉
        group.rotation.x += 0.002;
        group.rotation.y += 0.002;

        // 呼吸效果
        const time = Date.now() * 0.001;
        const scale = 1 + Math.sin(time) * 0.05;
        group.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    animate();
});
</script>

<template>
    <div class="canvas-container">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<style scoped>
.canvas-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* 增加一個濾鏡讓線條有發光感 */
    filter: drop-shadow(0 0 5px #06b6d4);
}
</style>