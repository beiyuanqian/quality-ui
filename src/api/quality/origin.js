import request from '@/utils/request'

//问题来源list
export function originList(query) {
  return request({
    url:'/quality/origin/',
    method: 'get',
    params: query
  })
}

//问题详情selectById
export function originGet(originId) {
  return request({
    url:'/quality/origin/' + originId + '/',
    method: 'get'
  })
}

//问题来源add
export function originAdd(data) {
  return request({
    url:'/quality/origin/',
    method: 'post',
    data: data
  })
}

//问题来源update
export function originUpdate(data) {
  return request({
    url:'/quality/origin/'+ data.id + '/',
    method: 'put',
    data: data
  })
}

//问题来源delete
export function originDelete(originId) {
  return request({
    url: '/quality/origin/' + originId+ '/',
    method: 'delete'
  })

}
