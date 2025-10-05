<template>
  <div class="article-home">
    <button class="back-btn" @click="goBack">
      ← 返回
    </button>
    <div class="header">
      <h2 class="title">文章仿写</h2>
      <p class="subtitle">选择文章类型，开始您的创作之旅</p>
    </div>

    <div class="categories-grid">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="folder-card"
        @click="goToArticleList(category.id)"
      >
        <div class="fire-icon"></div>
        <h3 class="category-name">{{ category.name }}</h3>
        <!-- <p class="category-type">{{ category.type }}</p> -->
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'ArticleHome',
  setup() {
    const router = useRouter()

    const categories = [
      { id: 'top', name: '推荐', type: '(top)' },
      { id: 'yule', name: '娱乐', type: '(yule)' },
      { id: 'tiyu', name: '体育', type: '(tiyu)' },
      { id: 'junshi', name: '军事', type: '(junshi)' },
      { id: 'keji', name: '科技', type: '(keji)' },
      { id: 'caijing', name: '财经', type: '(caijing)' },
      { id: 'youxi', name: '游戏', type: '(youxi)' },
      { id: 'qiche', name: '汽车', type: '(qiche)' },
      { id: 'jiankang', name: '健康', type: '(jiankang)' },
      { id: 'shehui', name: '社会', type: '(shehui)' },
      { id: 'yuer', name: '育儿', type: '(yuer)' },
      { id: 'guoji', name: '国际', type: '(guoji)' },
      { id: 'guonei', name: '国内', type: '(guonei)' }
    ]

    const goToArticleList = (category) => {
      router.push(`/article/list/${category}`)
    }

    const goBack = () => {
      router.go(-1)
    }

    return {
      categories,
      goBack,
      goToArticleList
    }
  }
}
</script>

<style scoped>
.article-home {
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  color: #100000;
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.folder-card {
  position: relative;
  padding: 30px 20px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 15px rgba(255, 154, 158, 0.3);
}

.folder-card:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 20px 40px rgba(255, 154, 158, 0.4);
}

.folder-card .fire-icon {
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 20px;
}

.category-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.category-type {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .folder-card {
    padding: 20px 15px;
    min-height: 120px;
  }
  
  .category-name {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
