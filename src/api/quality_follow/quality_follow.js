import request from '@/utils/request'

//问题跟进列表
export function qualityFollowList(query) {
  return request({
    url:'/qualityFollow/questionFollow/',
    method: 'get',
    params: query
  })
}
//问题跟进selectById
export function qualityFollowGet(qualityFollowId) {
  return request({
    url:'/qualityFollow/questionFollow/' + qualityFollowId + '/',
    method: 'get'
  })
}

//问题跟进add
export function qualityFollowAdd(data) {
  return request({
    url:'/qualityFollow/questionFollow/',
    method: 'post',
    data: data
  })
}

//问题跟进update
export function qualityFollowUpdate(data) {
  return request({
    url:'/qualityFollow/qualityFollow/'+ data.id + '/',
    method: 'put',
    data: data
  })
}

//问题跟进delete
export function qualityFollowDelete(qualityFollowId) {
  return request({
    url: '/qualityFollow/questionFollow/' + qualityFollowId+ '/',
    method: 'delete'
  })

}
