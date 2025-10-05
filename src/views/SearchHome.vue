<template>
  <div class="search-home">
    <div class="container">
      <!-- 头部导航 -->
      <div class="header">
        <button class="back-btn" @click="goHome">
          ← 返回
        </button>
        <h2 class="title">资料检索</h2>
      </div>

      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-bar">
          <input 
            v-model="searchForm.kw"
            type="text" 
            placeholder="请输入搜索关键词..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            🔍
          </button>
        </div>

        <!-- 筛选条件 -->
        <div class="filter-section">
          <div class="filter-row">
            <label class="filter-label">筛选:</label>
            <select v-model="searchForm.category" class="filter-select">
              <option value="0">文件类型</option>
              <option value="1">文件夹</option>
              <option value="2">视频</option>
              <option value="3">音乐</option>
              <option value="4">图片</option>
              <option value="5">文档</option>
              <option value="6">软件</option>
              <option value="7">压缩包</option>
              <option value="8">BT种子</option>
            </select>
            
            <select v-model="searchForm.sizeRange" class="filter-select">
              <option value="">文件大小</option>
              <option value="all">全部大小</option>
              <option value="small">小于20M</option>
              <option value="medium">20M-200M</option>
              <option value="large">200M-2G</option>
              <option value="xlarge">大于2G</option>
            </select>
            
            <select v-model="searchForm.diffDay" class="filter-select">
              <option value="">发布时间</option>
              <option value="7">最近一周</option>
              <option value="30">最近一月</option>
              <option value="180">最近半年</option>
              <option value="360">最近一年</option>
            </select>
            
            <select v-model="searchForm.searchType" class="filter-select">
              <option value="">查询类型</option>
              <option value="precise">精确查询</option>
              <option value="match">模糊查询</option>
            </select>
            
            <button class="clear-btn" @click="clearFilters">
              🧹 清除
            </button>
          </div>
          
          <div class="filter-row">
            <label class="filter-label">网盘:</label>
            <div class="cloud-drive-group">
              <div 
                class="cloud-drive-item"
                :class="{ active: searchForm.resType === 'baidu' }"
                @click="selectCloudDrive('baidu')"
              >
                <img src="/baidu_icon.png" alt="百度网盘" class="cloud-icon" />
                <span class="cloud-text">百度网盘</span>
              </div>
              <div 
                class="cloud-drive-item"
                :class="{ active: searchForm.resType === 'aliyundrive' }"
                @click="selectCloudDrive('aliyundrive')"
              >
                <img src="/ali_icon.png" alt="阿里云" class="cloud-icon" />
                <span class="cloud-text">阿里云</span>
              </div>
              <div 
                class="cloud-drive-item"
                :class="{ active: searchForm.resType === 'quark' }"
                @click="selectCloudDrive('quark')"
              >
                <img src="/quark_icon.png" alt="夸克" class="cloud-icon" />
                <span class="cloud-text">夸克</span>
              </div>
              <div 
                class="cloud-drive-item"
                :class="{ active: searchForm.resType === 'xunleipan' }"
                @click="selectCloudDrive('xunleipan')"
              >
                <img src="/xunlei.svg" alt="迅雷" class="cloud-icon" />
                <span class="cloud-text">迅雷</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-if="searchResults.length > 0" class="results-section">
        <div class="results-header">
          <span class="total-count">找到 <span class="highlight">{{ total }}</span> 个结果</span>
        </div>
        
        <div class="results-list">
          <div 
            v-for="(item, index) in searchResults" 
            :key="index"
            class="result-item"
            @click="goToResourceDetail(item.res)"
          >
            <div class="result-title">
              <h3 class="filename">{{ item.res.filename }}</h3>
            </div>
            
            <div class="file-list">
              <div 
                v-for="(file, fileIndex) in getFileList(item)" 
                :key="fileIndex"
                class="file-item"
                v-html="getHighlightedFilename(file, item.highs)"
              ></div>
            </div>
            
            <div class="result-meta">
              <span class="file-size">{{ formatFileSize(item.res.size) }}</span>
              <span class="source">{{ getSourceName(item.res.type) }}</span>
              <span class="status">资源有效</span>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            class="page-btn"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            上一页
          </button>
          
          <span class="page-info">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </span>
          
          <button 
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            下一页
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="hasSearched && searchResults.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>未找到相关资源</h3>
        <p>请尝试其他关键词或调整筛选条件</p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在搜索...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { searchResources } from '../api/search'

export default {
  name: 'SearchHome',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const hasSearched = ref(false)
    const searchResults = ref([])
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = 10

    const searchForm = reactive({
      kw: '',
      category: '0',
      sizeRange: '',
      diffDay: '',
      searchType: '',
      resType: 'baidu'
    })

    const totalPages = computed(() => {
      return Math.ceil(total.value / pageSize)
    })

    const goHome = () => {
      router.push('/')
    }

    const handleSearch = async () => {
      if (!searchForm.kw.trim()) {
        alert('请输入搜索关键词')
        return
      }

      try {
        loading.value = true
        hasSearched.value = true
        currentPage.value = 1
        
        const params = buildSearchParams()
        const response = await searchResources(params)
        
        searchResults.value = response.data.resources || []
        total.value = response.data.total || 0
        
        // 保存搜索状态
        saveSearchState()
      } catch (error) {
        console.error('搜索失败:', error)
        alert('搜索失败，请重试')
      } finally {
        loading.value = false
      }
    }

    const buildSearchParams = () => {
      const params = {
        t: Date.now(),
        version: 'v2',
        site: 'dalipan',
        page: currentPage.value,
        line: 0,
        kw: searchForm.kw,
        resType: searchForm.resType
      }
      

      // 文件类型
      if (searchForm.category) {
        params.category = searchForm.category
      }

      // 文件大小
      if (searchForm.sizeRange && searchForm.sizeRange !== 'all') {
        const sizeRanges = {
          small: { minSize: 1, maxSize: 20971520 },
          medium: { minSize: 20971520, maxSize: 209715200 },
          large: { minSize: 209715200, maxSize: 2147483648 },
          xlarge: { minSize: 2147483648, maxSize: 1099511627776 }
        }
        const range = sizeRanges[searchForm.sizeRange]
        if (range) {
          params.minSize = range.minSize
          params.maxSize = range.maxSize
        }
      }

      // 发布时间
      if (searchForm.diffDay) {
        params.diffDay = searchForm.diffDay
      }

      // 查询类型
      if (searchForm.searchType) {
        params.searchType = searchForm.searchType
      }

      return params
    }

    const clearFilters = () => {
      searchForm.category = ''
      searchForm.sizeRange = ''
      searchForm.diffDay = ''
      searchForm.searchType = ''
    }

    const selectCloudDrive = (resType) => {
      searchForm.resType = resType
      // 如果已经有搜索结果，自动重新搜索
      if (hasSearched.value && searchForm.kw.trim()) {
        handleSearch()
      }
    }

    const goToResourceDetail = (resource) => {
      // 保存当前搜索状态
      saveSearchState()
      
      router.push({
        path: '/resource/detail',
        query: {
          id: resource.id,
          type: resource.type,
          size: resource.size,
          parent: resource.fid || ''
        }
      })
    }

    const getFileList = (item) => {
      const filelist = item.res.filelist || []
      return filelist.slice(0, 5) // 只显示前5条
    }

    const getHighlightedFilename = (file, highs) => {
      if (!highs || !highs['filelist.filename']) {
        return file.filename
      }
      
      const highlights = highs['filelist.filename']
      let filename = file.filename
      
      highlights.forEach(highlight => {
        filename = filename.replace(
          new RegExp(highlight.replace(/<mark>/g, '').replace(/<\/mark>/g, ''), 'gi'),
          highlight
        )
      })
      
      return filename
    }

    const formatFileSize = (size) => {
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

    const changePage = async (page) => {
      if (page < 1 || page > totalPages.value) return
      
      try {
        loading.value = true
        currentPage.value = page
        
        const params = buildSearchParams()
        
        const response = await searchResources(params)
        
        searchResults.value = response.data.resources || []
        total.value = response.data.total || 0
        
        // 保存搜索状态
        saveSearchState()
      } catch (error) {
        console.error('搜索失败:', error)
        alert('搜索失败，请重试')
      } finally {
        loading.value = false
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        changePage(currentPage.value - 1)
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        changePage(currentPage.value + 1)
      }
    }

    // 恢复搜索状态
    const restoreSearchState = () => {
      const savedState = sessionStorage.getItem('searchState')
      if (savedState) {
        try {
          const state = JSON.parse(savedState)
          searchForm.kw = state.kw || ''
          searchForm.category = state.category || '0'
          searchForm.sizeRange = state.sizeRange || ''
          searchForm.diffDay = state.diffDay || ''
          searchForm.searchType = state.searchType || ''
          searchForm.resType = state.resType || 'baidu'
          searchResults.value = state.searchResults || []
          total.value = state.total || 0
          currentPage.value = state.currentPage || 1
          hasSearched.value = state.hasSearched || false
        } catch (error) {
          console.error('恢复搜索状态失败:', error)
        }
      }
    }

    // 保存搜索状态
    const saveSearchState = () => {
      const state = {
        kw: searchForm.kw,
        category: searchForm.category,
        sizeRange: searchForm.sizeRange,
        diffDay: searchForm.diffDay,
        searchType: searchForm.searchType,
        resType: searchForm.resType,
        searchResults: searchResults.value,
        total: total.value,
        currentPage: currentPage.value,
        hasSearched: hasSearched.value
      }
      sessionStorage.setItem('searchState', JSON.stringify(state))
    }

    // 清除搜索状态
    const clearSearchState = () => {
      sessionStorage.removeItem('searchState')
    }

    // 组件挂载时恢复状态
    onMounted(() => {
      restoreSearchState()
    })

    // 组件激活时恢复状态（从其他页面返回时）
    onActivated(() => {
      restoreSearchState()
    })

    return {
      searchForm,
      searchResults,
      total,
      currentPage,
      totalPages,
      loading,
      hasSearched,
      goHome,
      handleSearch,
      clearFilters,
      selectCloudDrive,
      goToResourceDetail,
      getFileList,
      getHighlightedFilename,
      formatFileSize,
      getSourceName,
      changePage,
      prevPage,
      nextPage
    }
  }
}
</script>

<style scoped>
.search-home {
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

.search-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  padding: 15px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.filter-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.filter-label {
  font-weight: 600;
  color: #333;
  min-width: 60px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.clear-btn {
  padding: 8px 15px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #f57c00;
  transform: translateY(-1px);
}

.cloud-drive-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.cloud-drive-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
}

.cloud-drive-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.cloud-drive-item.active {
  background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%);
  border-color: #ff9800;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
}

.cloud-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.cloud-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.cloud-drive-item.active .cloud-text {
  color: white;
}

.results-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.results-header {
  margin-bottom: 20px;
}

.total-count {
  font-size: 1.1rem;
  color: #333;
}

.highlight {
  color: #e74c3c;
  font-weight: 600;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-item {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.result-title {
  margin-bottom: 15px;
}

.filename {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.file-list {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.file-item {
  padding: 5px 0;
  color: #666;
  font-size: 14px;
}

.file-item:first-child {
  font-weight: 500;
  color: #333;
}

.result-meta {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.file-size {
  font-weight: 500;
  color: #333;
}

.source {
  color: #666;
}

.status {
  color: #4CAF50;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.page-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.page-info {
  color: #666;
  font-size: 14px;
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

.loading {
  text-align: center;
  color: white;
  padding: 60px 0;
}

.loading p {
  margin-top: 20px;
  font-size: 1.1rem;
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
  
  .search-section {
    padding: 20px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-label {
    min-width: auto;
  }
  
  .cloud-drive-group {
    justify-content: center;
    gap: 10px;
  }
  
  .cloud-drive-item {
    min-width: 100px;
    padding: 10px 12px;
  }
  
  .cloud-icon {
    width: 20px;
    height: 20px;
  }
  
  .cloud-text {
    font-size: 12px;
  }
  
  .result-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
