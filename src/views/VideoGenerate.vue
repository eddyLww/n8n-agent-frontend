<template>
  <div class="container">
    <div class="card p-2">
      <h2 class="text-center text-primary mb-2">视频生成</h2>

      <div class="mb-2">
        <label class="text-secondary mb-1">标题</label>
        <input
          v-model="title"
          type="text"
          placeholder="请输入视频标题"
          class="input"
        />
      </div>

      <div class="mb-2">
        <label class="text-secondary mb-1">文案内容</label>
        <textarea
          v-model="content"
          rows="10"
          placeholder="请输入或生成的视频文案内容"
          class="textarea"
        ></textarea>
      </div>

      <div class="actions mt-2">
        <button class="btn btn-primary" @click="handleBaokuan" :disabled="loading">
          {{ loading && loadingType === 'baokuan' ? '生成中...' : '爆款一下' }}
        </button>
        <button class="btn btn-primary ml-1" @click="handleCreateVideo" :disabled="loading">
          {{ loading && loadingType === 'video' ? '生成中...' : '生成视频' }}
        </button>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTitleAndContent, createVideo } from '../api/video'

export default {
  name: 'VideoGenerate',
  setup() {
    const route = useRoute()
    const source = ref(route.query.source || 'baokuan')
    const title = ref('')
    const content = ref('')
    const loading = ref(false)
    const loadingType = ref('')

    onMounted(() => {
      // 根据来源可做不同初始化逻辑
      if (source.value === 'jianxun') {
        title.value = ''
        content.value = ''
      }
    })

    const handleBaokuan = async () => {
      loading.value = true
      loadingType.value = 'baokuan'
      try {
        const { data } = await getTitleAndContent({ source: source.value })
        if (data) {
          title.value = data.title || ''
          content.value = data.content || ''
        }
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
        loadingType.value = ''
      }
    }

    const handleCreateVideo = async () => {
      loading.value = true
      loadingType.value = 'video'
      try {
        await createVideo({ title: title.value, content: content.value, source: source.value })
        // 可根据返回数据做跳转或提示
        alert('已开始生成视频，请稍后在任务列表查看进度')
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
        loadingType.value = ''
      }
    }

    return {
      title,
      content,
      loading,
      loadingType,
      handleBaokuan,
      handleCreateVideo
    }
  }
}
</script>

<style scoped>
.input, .textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
}

.input:focus, .textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ml-1 { margin-left: 12px; }

@media (max-width: 768px) {
  .ml-1 { margin-left: 0; }
  .actions { justify-content: space-between; }
}
</style>


