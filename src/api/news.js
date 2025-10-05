import request from './request'

/**
 * 根据分类获取新闻列表
 * @param {string} category - 新闻分类
 * @returns {Promise} 新闻列表
 */
export const getNewsByCategory = (category) => {
  return request.post('/n8n/juhe/category', null, {
    params: { category }
  })
}

/**
 * 根据URL获取文章内容
 * @param {string} url - 文章URL
 * @returns {Promise} 文章内容
 */
export const getNewsContentByUrl = (url) => {
  return request.post('/n8n/juhe/url', null, {
    params: { url }
  })
}

/**
 * 文章伪原创
 * @param {string} article - 原文章内容
 * @returns {Promise} 伪原创内容
 */
export const articleOriginal = (article) => {
  return request.post('/n8n/article/original', null, {
    params: { article },
    timeout: 5 * 60 * 1000 // 5分钟 = 300000毫秒
  })
}
