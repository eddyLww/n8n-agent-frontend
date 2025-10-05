import axios from 'axios'

// 创建axios实例
const request = axios.create({
  baseURL: 'https://fc-resource-node-api.krzb.net/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 添加认证请求头
    config.headers['x-authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlvbmlkIjoib1RJWk02Q2J3Y3k5YXNlZUxhSndWUkRNOEpsSSIsImlhdCI6MTc1NzI0MTU0OSwiZXhwIjoxNzU5ODMzNTQ5fQ.492lgr03YF5TRoiNl5V7mn0V-YV4dBkt3VL63_Vvxso'
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

export default request
