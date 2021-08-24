import request from '@/utils/request'

//最新进度列表
export function DailyProgressList(query) {
  return request({
    url:'/qualityFollow/DailyProgress/',
    method: 'get',
    params: query
  })
}
//最新进度selectById
export function DailyProgressGet(qualityFollowId) {
  return request({
    url:'/qualityFollow/DailyProgress/' + qualityFollowId + '/',
    method: 'get'
  })
}

//最新进度add
export function DailyProgressAdd(data) {
  return request({
    url:'/qualityFollow/DailyProgress/',
    method: 'post',
    data: data
  })
}

//最新进度update
export function DailyProgressUpdate(data) {
  return request({
    url:'/qualityFollow/DailyProgress/'+ data.id + '/',
    method: 'put',
    data: data
  })
}

//最新进度delete
export function DailyProgressDelete(qualityFollowId) {
  return request({
    url: '/qualityFollow/DailyProgress/' + qualityFollowId+ '/',
    method: 'delete'
  })
}
