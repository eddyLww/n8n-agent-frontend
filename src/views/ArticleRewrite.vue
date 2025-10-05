<template>
  <div class="article-rewrite">
    <div class="container">
      <!-- 头部导航 -->
      <div class="header">
        <button class="back-btn" @click="goBack">
          ← 返回
        </button>
        <h2 class="title">文章伪原创</h2>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <!-- 原文章区域 -->
        <div class="section">
          <div class="section-header">
            <h3 class="section-title">原文章</h3>
            <div class="section-actions">
              <!--
                <button 
                class="btn btn-primary" 
                @click="loadOriginalArticle"
                :disabled="loadingOriginal"
              >
                {{ loadingOriginal ? '加载中...' : '加载原文' }}
              </button>
              -->
            </div>
          </div>
          <div class="text-area">
            <textarea 
              v-model="originalContent"
              placeholder="点击上方按钮加载原文章内容..."
              readonly
              class="content-textarea"
            ></textarea>
          </div>
        </div>

         <!-- 伪原创区域 -->
         <div class="section">
           <div class="section-header">
             <h3 class="section-title">伪原创内容</h3>
           </div>
           <div class="text-area">
             <textarea 
               v-model="rewriteContent"
               placeholder="点击下方按钮生成伪原创内容..."
               class="content-textarea"
             ></textarea>
           </div>
           <div class="section-actions">
             <button 
               class="btn btn-primary" 
               @click="generateRewrite"
               :disabled="!originalContent || loadingRewrite"
             >
               {{ loadingRewrite ? '生成中...' : '生成伪原创' }}
             </button>
             <button 
               class="btn btn-secondary" 
               @click="copyContent"
               :disabled="!rewriteContent"
             >
               复制
             </button>
           </div>
         </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loadingOriginal || loadingRewrite" class="loading-overlay">
        <div class="spinner"></div>
        <p>{{ loadingOriginal ? '正在加载原文章...' : '正在生成伪原创内容...' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNewsContentByUrl, articleOriginal } from '../api/news'

export default {
  name: 'ArticleRewrite',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const originalContent = ref('')
    const rewriteContent = ref('')
    const loadingOriginal = ref(false)
    const loadingRewrite = ref(false)

    const goBack = () => {
      router.go(-1)
    }

    const loadOriginalArticle = async () => {
      const url = route.query.url
      if (!url) {
        alert('缺少文章URL参数')
        return
      }

      try {
        loadingOriginal.value = true
        const response = await getNewsContentByUrl(url)
        originalContent.value = response.data.fullText || ''
      } catch (error) {
        console.error('加载原文章失败:', error)
        alert('加载原文章失败，请重试')
      } finally {
        loadingOriginal.value = false
      }
    }

     const generateRewrite = async () => {
       if (!originalContent.value) {
         alert('请先加载原文章内容')
         return
       }

       try {
         loadingRewrite.value = true
         const response = await articleOriginal(originalContent.value)
         rewriteContent.value = response.data.output || ''
       } catch (error) {
         console.error('生成伪原创失败:', error)
         alert('生成伪原创失败，请重试')
       } finally {
         loadingRewrite.value = false
       }
     }

     const copyContent = async () => {
       if (!rewriteContent.value) {
         alert('没有内容可复制')
         return
       }

       try {
         await navigator.clipboard.writeText(rewriteContent.value)
         alert('内容已复制到剪贴板')
       } catch (error) {
         console.error('复制失败:', error)
         // 降级方案：使用传统方法
         const textArea = document.createElement('textarea')
         textArea.value = rewriteContent.value
         document.body.appendChild(textArea)
         textArea.select()
         document.execCommand('copy')
         document.body.removeChild(textArea)
         alert('内容已复制到剪贴板')
       }
     }

    onMounted(() => {
      // 如果有URL参数，自动加载原文章
      if (route.query.url) {
        loadOriginalArticle()
      }
    })

       return {
         originalContent,
         rewriteContent,
         loadingOriginal,
         loadingRewrite,
         goBack,
         loadOriginalArticle,
         generateRewrite,
         copyContent
       }
  }
}
</script>

<style scoped>
.article-rewrite {
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

.content-area {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 25px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

 .section-actions {
   display: flex;
   gap: 10px;
   margin-top: 15px;
   justify-content: center;
 }

.text-area {
  position: relative;
}

.content-textarea {
  width: 100%;
  min-height: 300px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  transition: all 0.3s ease;
}

.content-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.content-textarea[readonly] {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
}

.loading-overlay p {
  margin-top: 20px;
  font-size: 1.1rem;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
}

.btn-secondary:disabled {
  background: #adb5bd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
  
  .section {
    padding: 20px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .section-actions {
    justify-content: center;
  }
  
  .content-textarea {
    min-height: 250px;
    padding: 15px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .content-textarea {
    min-height: 200px;
  }
}
</style>
