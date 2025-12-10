// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入剛剛寫的路由設定

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/cyberpunk.css'

const app = createApp(App)

app.use(router) // 啟用路由
app.mount('#app')