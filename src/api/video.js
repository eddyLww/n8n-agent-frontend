import axios from 'axios'

// 独立实例，视频服务使用 8123
const videoRequest = axios.create({
  baseURL: 'http://localhost:8082/api',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export const getTitleAndContent = (payload) => {
  return videoRequest.post('/n8n/video/getTitleAndContent', payload)
}

export const createVideo = (payload) => {
  return videoRequest.post('/n8n/video/createVideo', payload)
}

export default {
  getTitleAndContent,
  createVideo
}


