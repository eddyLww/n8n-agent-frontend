import request from './request'

export const getTitleAndContent = (params) => {
  return request.post('/n8n/video/getTitleAndContent', null, { params })
}

export const createVideo = (params) => {
  return request.post('/n8n/video/createVideo', null, { params })
}

export default {
  getTitleAndContent,
  createVideo
}


