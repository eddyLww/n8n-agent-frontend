<template>
  <div class="article-list">
    <div class="container">
      <!-- 头部导航 -->
      <div class="header">
        <button class="back-btn" @click="goBack">
          ← 返回
        </button>
        <h2 class="title">{{ getCategoryName($route.params.category) }} 文章列表</h2>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在加载文章...</p>
      </div>

      <!-- 文章列表 -->
      <div v-else-if="articles.length > 0" class="articles-container">
        <div 
          v-for="article in articles" 
          :key="article.id"
          class="article-card"
          @click="goToRewrite(article.url)"
        >
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-content">{{ article.content }}</p>
          <div class="article-meta">
            <div class="meta-item">
              <span class="meta-icon">👁️</span>
              <span class="meta-text">{{ article.viewNum }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">❤️</span>
              <span class="meta-text">{{ article.favourNum }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <span class="meta-text">{{ formatDate(article.createTime) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">📄</div>
        <h3>暂无文章</h3>
        <p>该分类下暂时没有文章，请稍后再试</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNewsByCategory } from '../api/news'

export default {
  name: 'ArticleList',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const articles = ref([])
    const loading = ref(true)

    const categoryNames = {
      top: '推荐',
      yule: '娱乐',
      tiyu: '体育',
      junshi: '军事',
      keji: '科技',
      caijing: '财经',
      youxi: '游戏',
      qiche: '汽车',
      jiankang: '健康',
      shehui: '社会',
      yuer: '育儿',
      guoji: '国际',
      guonei: '国内'
    }

    const getCategoryName = (category) => {
      return categoryNames[category] || category
    }

    const loadArticles = async () => {
      try {
        loading.value = true
        const category = route.params.category
        const response = await getNewsByCategory(category)
        articles.value = response.data || []
      } catch (error) {
        console.error('加载文章失败:', error)
        articles.value = []
      } finally {
        loading.value = false
      }
    }

    const goBack = () => {
      router.go(-1)
    }

    const goToRewrite = (url) => {
      router.push({
        path: '/article/rewrite',
        query: { url }
      })
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      loadArticles()
    })

    return {
      articles,
      loading,
      getCategoryName,
      goBack,
      goToRewrite,
      formatDate
    }
  }
}
</script>

<style scoped>
.article-list {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.back-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.title {
  color: white;
  font-size: 2rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.articles-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.article-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.4;
}

.article-content {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 0.9rem;
}

.meta-icon {
  font-size: 1rem;
}

.meta-text {
  font-weight: 500;
}

.loading {
  text-align: center;
  color: white;
  padding: 60px 0;
}

.loading p {
  margin-top: 20px;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  color: white;
  padding: 60px 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.empty-state p {
  opacity: 0.8;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .article-card {
    padding: 15px;
  }
  
  .article-title {
    font-size: 1.1rem;
  }
  
  .article-meta {
    gap: 15px;
  }
}
</style>
