<template>
  <div class="container">
    <button class="back-btn" @click="goBack">← 返回</button>
    <div class="card p-2">
      <h2 class="text-center text-primary mb-2">{{ pageTitle }}</h2>

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

      <div class="video-actions mt-2">
        <button class="video-btn" @click="handleBaokuan" :disabled="loading">
          {{ loading && loadingType === 'baokuan' ? '生成中...' : '爆款一下' }}
        </button>
        <button class="video-btn ml-1" @click="handleCreateVideo" :disabled="loading">
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTitleAndContent, createVideo } from '../api/video'

export default {
  name: 'VideoGenerate',
  setup() {
    const route = useRoute()
    const router = useRouter()
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
      // 校验
      if (source.value === 'baokuan' && !String(title.value || '').trim()) {
        alert('请先填写标题')
        return
      }
      if (source.value === 'jianxun' && !String(content.value || '').trim()) {
        alert('请先填写文案内容')
        return
      }

      loading.value = true
      loadingType.value = 'baokuan'
      try {
        const { data } = await getTitleAndContent({
          title: title.value,
          content: content.value,
          source: source.value
        })
        if (data) {
          title.value = data.title ?? title.value
          content.value = data.content ?? content.value
          source.value = data.source ?? source.value
        }
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
        loadingType.value = ''
      }
    }

    const handleCreateVideo = async () => {
      // 校验
      if (source.value === 'baokuan' && !String(title.value || '').trim()) {
        alert('请先填写标题')
        return
      }
      if (source.value === 'jianxun' && !String(content.value || '').trim()) {
        alert('请先填写文案内容')
        return
      }

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

    const goBack = () => {
      router.go(-1)
    }

    const pageTitle = computed(() => source.value === 'jianxun' ? '简讯视频生成' : '爆款视频生成')

    return {
      title,
      content,
      loading,
      loadingType,
      pageTitle,
      handleBaokuan,
      handleCreateVideo,
      goBack
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

.video-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.video-btn {
  padding: 12px 28px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.video-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
}

.video-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.ml-1 { margin-left: 12px; }

@media (max-width: 768px) {
  .ml-1 { margin-left: 0; }
  .video-actions { justify-content: center; gap: 12px; }
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


