import request from '@/utils/request'

//问题list
export function questionList(query) {
  return request({
    url:'/quality/question/',
    method: 'get',
    params: query
  })
}

//问题selectById
export function questionGet(questionId) {
  return request({
    url:'/quality/question/' + questionId + '/',
    method: 'get'
  })
}

//问题add
export function questionAdd(data) {
  return request({
    url:'/quality/question/',
    method: 'post',
    data: data
  })
}

//问题update
export function questionUpdate(data) {
  return request({
    url:'/quality/question/'+ data.id + '/',
    method: 'put',
    data: data
  })
}

//问题delete
export function questionDelete(questionId) {
  return request({
    url: '/quality/question/' + questionId+ '/',
    method: 'delete'
  })

}
