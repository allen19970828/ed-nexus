// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ArticleView from '../views/ArticleView.vue'
import AboutView from '../views/AboutView.vue' // 1. 引入 AboutView
import ResearchView from '../views/ResearchView.vue' // 2. 引入 ResearchView
import TechView from '../views/TechView.vue' // 3. 引入 TechView
import EnaView from '../views/EnaView.vue'
import CdmView from '../views/CdmView.vue'
import CttView from '../views/CttView.vue'
import AnnView from '../views/AnnView.vue'
import NlpView from '../views/NlpView.vue'
import DeaView from '../views/DeaView.vue'
import RagFtView from '../views/RagFtView.vue'
import SurveyCdmView from '../views/SurveyCdmView.vue'


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/article/:id',
      name: 'article',
      component: ArticleView
    },
    { 
      // 2. 加入這段設定
      path: '/aboutme', 
      name: 'about',
      component: AboutView 
    },
   // 2. 修改 research 路由，指向正確的組件
    {
      path: '/research',
      name: 'research',
      component: ResearchView
    },
    {
      path: '/irt-lab',
      name: 'irt-lab',
      component: () => import('../views/IrtLabView.vue')
    },
    {
        path: '/irt-intro',
        name: 'irt-intro',
        component: () => import('../views/IrtLabView.vue')
    },

    {
      path: '/article-template', // 這是你 Navbar 設定的路徑
      name: 'tech',
      component: TechView // 載入我們剛剛寫的 TechView
    },
    {
      path: '/ena',
      name: 'ena',
      component: EnaView
    },
    {
      path: '/cdm',
      name: 'cdm',
      component: CdmView
    },
    {
      path: '/ctt',
      name: 'ctt',
      component: CttView
    },
    {
      path: '/ann',
      name: 'ann',
      component: AnnView
    },
    {
      path: '/nlp',
      name: 'nlp',
      component: NlpView
    },
    {
      path: '/dea',
      name: 'dea',
      component: DeaView
    },
    {
      path: '/rag-ft',
      name: 'rag-ft',
      component: RagFtView
    },
    {
      path: '/survey-cdm',
      name: 'survey-cdm',
      component: SurveyCdmView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router