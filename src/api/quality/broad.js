import request from '@/utils/request'

//问题大类list
export function broadList(query) {
  return request({
    url:'/quality/broad/',
    method: 'get',
    params: query
  })
}

//问题大类selectById
export function broadGet(broadId) {
  return request({
    url:'/quality/broad/' + broadId + '/',
    method: 'get'
  })
}

//问题大类add
export function broadAdd(data) {
  return request({
    url:'/quality/broad/',
    method: 'post',
    data: data
  })
}

//问题大类update
export function broadUpdate(data) {
  return request({
    url:'/quality/broad/'+ data.id + '/',
    method: 'put',
    data: data
  })
}

//问题大类delete
export function broadDelete(broadId) {
  return request({
    url: '/quality/broad/' + broadId+ '/',
    method: 'delete'
  })

}
