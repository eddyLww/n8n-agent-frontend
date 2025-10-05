import request from './request'

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
