import request from './request'

export const getTitleAndContent = (params) => {
  return videoRequest.post('/n8n/video/getTitleAndContent', null, { params })
}

export const createVideo = (params) => {
  return videoRequest.post('/n8n/video/createVideo', null, { params })
}

export default {
  getTitleAndContent,
  createVideo
}


