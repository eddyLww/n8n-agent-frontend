<template>
  <div class="resource-detail">
    <div class="container">
      <!-- 头部导航 -->
      <div class="header">
        <button class="back-btn" @click="goBack">
          ← 返回
        </button>
        <h2 class="title">资源详情</h2>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在加载资源详情...</p>
      </div>

      <!-- 资源详情 -->
      <div v-else-if="resourceDetail" class="detail-section">
        <div class="resource-card">
          <div class="resource-header">
            <h3 class="resource-title">{{ resourceDetail.filename }}</h3>
            <div class="resource-meta">
              <span class="file-size">{{ formatFileSize(routeSize) }}</span>
              <span class="source">{{ getSourceName(routeType) }}</span>
              <span class="status" :class="{ valid: resourceDetail.valid === 1 }">
                {{ resourceDetail.valid === 1 ? '资源有效' : '资源无效' }}
              </span>
            </div>
          </div>

          <!-- 文件列表 -->
          <div v-if="fileList.length > 0" class="file-list-section">
            <h4 class="section-title">文件列表</h4>
            <div class="file-list">
              <div 
                v-for="(file, index) in fileList" 
                :key="index"
                class="file-item"
              >
                <span class="file-icon">📄</span>
                <span class="file-name">{{ file.filename }}</span>
                <span v-if="file.size" class="file-size">{{ formatFileSize(file.size) }}</span>
              </div>
            </div>
          </div>

          <!-- 资源信息 -->
          <div class="resource-info">
            <div class="info-item">
              <span class="info-label">创建时间:</span>
              <span class="info-value">{{ formatDate(resourceDetail.ctime) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">更新时间:</span>
              <span class="info-value">{{ formatDate(resourceDetail.utime) }}</span>
            </div>
            <div v-if="resourceDetail.haspwd && resourceDetail.pwd" class="info-item">
              <span class="info-label">提取码:</span>
              <span class="info-value password">{{ resourceDetail.pwd }}</span>
            </div>
          </div>

          <!-- 下载按钮 -->
          <div class="download-section">
            <button 
              class="download-btn"
              @click="goToDownload"
              :disabled="!resourceDetail.url"
            >
              🚀 前往网盘下载
            </button>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else class="error-state">
        <div class="error-icon">❌</div>
        <h3>加载失败</h3>
        <p>无法获取资源详情，请重试</p>
        <button class="retry-btn" @click="loadResourceDetail">
          重新加载
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getResourceDetail } from '../api/search'

export default {
  name: 'ResourceDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const resourceDetail = ref(null)
    const fileList = ref([])
    
    // 从路由参数中获取数据
    const routeType = ref(route.query.type)
    const routeSize = ref(route.query.size)

    const goBack = () => {
      router.go(-1)
    }

    const loadResourceDetail = async () => {
      const { id, type, parent } = route.query
      
      if (!id || !type) {
        alert('缺少必要的参数')
        router.go(-1)
        return
      }

      try {
        loading.value = true
        const params = {
          t: Date.now(),
          version: 'v2',
          size: 15,
          id,
          type,
          parent: parent || ''
        }

        const response = await getResourceDetail(params)
        resourceDetail.value = response.data
        
        // 如果有文件列表，解析并显示
        if (response.data.filelist && Array.isArray(response.data.filelist)) {
          fileList.value = response.data.filelist
        }
      } catch (error) {
        console.error('加载资源详情失败:', error)
        resourceDetail.value = null
      } finally {
        loading.value = false
      }
    }

    const formatFileSize = (size) => {
      if (!size || size === 0) return '未知大小'
      const bytes = parseInt(size)
      if (bytes >= 1073741824) {
        return (bytes / 1073741824).toFixed(1) + 'G'
      } else {
        return (bytes / 1048576).toFixed(1) + 'M'
      }
    }

    const getSourceName = (type) => {
      const sources = {
        baidu: '百度网盘',
        aliyundrive: '阿里云',
        quark: '夸克',
        xunleipan: '迅雷'
      }
      return sources[type] || type
    }

    const formatDate = (dateString) => {
      if (!dateString) return '未知'
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const goToDownload = () => {
      if (!resourceDetail.value || !resourceDetail.value.url) {
        alert('下载链接不可用')
        return
      }

      let downloadUrl = resourceDetail.value.url
      const type = routeType.value

      // 根据不同的网盘类型处理URL
      switch (type) {
        case 'baidu':
          if (resourceDetail.value.pwd) {
            downloadUrl += `?pwd=${resourceDetail.value.pwd}`
          }
          break
        case 'aliyundrive':
          // 阿里云直接使用URL
          break
        case 'quark':
          // 夸克去掉?后面的参数
          downloadUrl = downloadUrl.split('?')[0]
          break
        case 'xunleipan':
          if (resourceDetail.value.pwd) {
            downloadUrl += `?pwd=${resourceDetail.value.pwd}`
          }
          break
        default:
          break
      }

      // 在新窗口中打开下载链接
      window.open(downloadUrl, '_blank')
    }

    onMounted(() => {
      loadResourceDetail()
    })

    return {
      loading,
      resourceDetail,
      fileList,
      routeType,
      routeSize,
      goBack,
      loadResourceDetail,
      formatFileSize,
      getSourceName,
      formatDate,
      goToDownload
    }
  }
}
</script>

<style scoped>
.resource-detail {
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

.detail-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.resource-card {
  max-width: 800px;
  margin: 0 auto;
}

.resource-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.resource-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.4;
}

.resource-meta {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.file-size {
  font-weight: 500;
  color: #333;
  font-size: 1.1rem;
}

.source {
  color: #666;
  font-size: 1rem;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status.valid {
  background: #4CAF50;
  color: white;
}

.status:not(.valid) {
  background: #f44336;
  color: white;
}

.file-list-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.file-list {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.file-item:last-child {
  border-bottom: none;
}

.file-icon {
  font-size: 1.2rem;
}

.file-name {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.file-size {
  color: #666;
  font-size: 12px;
}

.resource-info {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #666;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.info-value.password {
  background: #ff9800;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.download-section {
  text-align: center;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.download-btn {
  padding: 15px 40px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.download-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
}

.download-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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

.error-state {
  text-align: center;
  color: white;
  padding: 60px 0;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.error-state p {
  opacity: 0.8;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 10px 20px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #f57c00;
  transform: translateY(-1px);
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
  
  .detail-section {
    padding: 20px;
  }
  
  .resource-title {
    font-size: 1.4rem;
  }
  
  .resource-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .download-btn {
    padding: 12px 30px;
    font-size: 1rem;
  }
}
</style>
