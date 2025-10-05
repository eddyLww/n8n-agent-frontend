import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import Home from './views/Home.vue'
import ArticleHome from './views/ArticleHome.vue'
import ArticleList from './views/ArticleList.vue'
import ArticleRewrite from './views/ArticleRewrite.vue'
import SearchHome from './views/SearchHome.vue'
import ResourceDetail from './views/ResourceDetail.vue'
import VideoHome from './views/VideoHome.vue'
import VideoGenerate from './views/VideoGenerate.vue'
import './style.css'

/**
 * 路由
 */
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/article', name: 'ArticleHome', component: ArticleHome },
  { path: '/article/list/:category', name: 'ArticleList', component: ArticleList },
  { path: '/article/rewrite', name: 'ArticleRewrite', component: ArticleRewrite },
  { path: '/search', name: 'SearchHome', component: SearchHome },
  { path: '/resource/detail', name: 'ResourceDetail', component: ResourceDetail },
  { path: '/video', name: 'VideoHome', component: VideoHome },
  { path: '/video/generate', name: 'VideoGenerate', component: VideoGenerate }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
