<template>
  <div class="home">
    <div class="container">
      <!-- 头部标题 -->
      <header class="header">
        <h1 class="title">N8N Agent 智能助手</h1>
        <p class="subtitle">让AI助力您的内容创作</p>
      </header>

      <!-- 应用入口 -->
      <div class="apps-section">
        <h2 class="section-title">选择应用</h2>
        <div class="apps-grid">
          <div 
            v-for="app in apps" 
            :key="app.id"
            class="app-card"
            :class="{ active: currentApp === app.id }"
            @click="switchApp(app.id)"
          >
            <div class="app-icon">
              <span v-html="app.icon"></span>
            </div>
            <h3 class="app-title">{{ app.name }}</h3>
            <p class="app-desc">{{ app.description }}</p>
            <div v-if="app.status" class="app-status" :class="app.status">
              {{ app.statusText }}
            </div>
          </div>
        </div>
      </div>

      <!-- 当前应用内容
      <div class="current-app">
        <div v-if="currentApp === 'article'" class="app-content">
          <h3>文章仿写</h3>
          <p>智能文章重写与优化功能</p>
          <button class="btn btn-primary" @click="goToArticleHome">
            进入文章仿写
          </button>
        </div>
        <div v-else-if="currentApp === 'video'" class="app-content">
          <h3>视频生成</h3>
          <p>AI视频内容创作功能</p>
          <p class="coming-soon">功能开发中，敬请期待...</p>
        </div>
        <div v-else-if="currentApp === 'search'" class="app-content">
          <h3>资料检索</h3>
          <p>智能信息搜索与整理功能</p>
          <p class="coming-soon">功能开发中，敬请期待...</p>
        </div>
      </div>
      -->

    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const currentApp = ref('article')

    const apps = ref([
      {
        id: 'article',
        name: '文章仿写',
        description: '智能文章重写与优化',
        icon: '📝',
        status: 'active',
        statusText: '已开发'
      },
      {
        id: 'video',
        name: '视频生成',
        description: 'AI视频内容创作',
        icon: '🎬',
        status: 'active',
        statusText: '已开发'
      },
      {
        id: 'search',
        name: '资料检索',
        description: '智能信息搜索与整理',
        icon: '🔍',
        status: 'active',
        statusText: '已开发'
      }
    ])

    const switchApp = (appId) => {
      if(appId === "article"){
        router.push('/article')
      } else if(appId === "search"){
        router.push('/search')
      } else if(appId === 'video') {
        router.push('/video')
      }
    }

    const goToArticleHome = () => {
      router.push('/article')
    }

    return {
      currentApp,
      apps,
      switchApp,
      goToArticleHome
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  text-align: center;
  padding: 40px 0;
  color: white;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.apps-section {
  margin-bottom: 40px;
}

.section-title {
  text-align: center;
  color: white;
  font-size: 2rem;
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.app-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  backdrop-filter: blur(10px);
}

.app-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.app-card.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.app-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.app-desc {
  color: #666;
  margin-bottom: 15px;
}

.app-card.active .app-desc {
  color: rgba(255, 255, 255, 0.8);
}

.app-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.app-status.active {
  background: #4CAF50;
  color: white;
}

.app-status.pending {
  background: #FF9800;
  color: white;
}

.current-app {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.app-content {
  text-align: center;
}

.app-content h3 {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.app-content p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 20px;
}

.coming-soon {
  color: #ff9800;
  font-weight: 500;
  font-style: italic;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .apps-grid {
    grid-template-columns: 1fr;
  }
  
  .app-card {
    padding: 20px;
  }
  
  .current-app {
    padding: 20px;
  }
}
</style>
