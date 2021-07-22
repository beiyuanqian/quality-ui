import request from '@/utils/request'

//等级list
export function levelList(query) {
  return request({
    url:'/quality/level/',
    method: 'get',
    params: query
  })
}

//等级selectById
export function levelGet(levelId) {
  return request({
    url:'/quality/level/' + levelId + '/',
    method: 'get'
  })
}

//等级add
export function levelAdd(data) {
  return request({
    url:'/quality/level/',
    method: 'post',
    data: data
  })
}

//等级update
export function levelUpdate(data) {
  return request({
    url:'/quality/level/'+ data.id + '/',
    method: 'put',
    data: data
  })
}

//等级delete
export function levelDelete(levelId) {
  return request({
    url: '/quality/level/' + levelId+ '/',
    method: 'delete'
  })

}
