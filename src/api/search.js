import axios from 'axios'

// 创建axios实例 （ 搜索云盘 专用）
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


/**
 * 搜索资源
 * @param {Object} params - 搜索参数
 * @returns {Promise} 搜索结果
 */
export const searchResources = (params) => {
    return request.get('/v1/pan/search', {
        params
    })
}

/**
 * 获取资源详情
 * @param {Object} params - 资源详情参数
 * @returns {Promise} 资源详情
 */
export const getResourceDetail = (params) => {
    return request.get('/v1/pan/detail', {
        params
    })
}
