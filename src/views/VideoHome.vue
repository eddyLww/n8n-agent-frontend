<template>
  <div class="container">
    <button class="back-btn" @click="goBack">← 返回</button>
    <div class="header text-center mb-3">
      <h2 class="text-primary">视频生成首页</h2>
      <p class="text-muted">请选择生成方式</p>
    </div>

    <div class="grid grid-2">
      <div class="folder-card" @click="goGenerate('baokuan')">
        <div class="fire-icon"></div>
        <h3>爆款生成</h3>
        <p class="text-secondary mt-1">一键生成爆款文案与结构</p>
      </div>
      <div class="folder-card" @click="goGenerate('jianxun')">
        <div class="fire-icon"></div>
        <h3>新闻简讯</h3>
        <p class="text-secondary mt-1">从热点新闻快速生成视频文案</p>
      </div>
    </div>
  </div>
  
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'VideoHome',
  setup() {
    const router = useRouter()

    const goGenerate = (source) => {
      router.push({
        path: '/video/generate',
        query: { source }
      })
    }
    const goBack = () => {
      router.go(-1)
    }

    return { goGenerate, goBack }
  }
}
</script>

<style scoped>
.header h2 {
  font-weight: 700;
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
  margin-bottom: 16px;
}
</style>


