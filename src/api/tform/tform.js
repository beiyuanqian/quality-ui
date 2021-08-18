import request from '@/utils/request'

//问题list
export function formList(query) {
  return request({
    url:'/quality/question/',
    method: 'get',
    params: query
  })
}

//问题selectById
export function formGet(questionId) {
  return request({
    url:'/quality/question/' + questionId + '/',
    method: 'get'
  })
}

//问题add
export function formAdd(data) {
  return request({
    url:'/quality/question/',
    method: 'post',
    data: data
  })
}

//问题update
export function formUpdate(data) {
  return request({
    url:'/quality/question/'+ data.id + '/',
    method: 'put',
    data: data
  })
}

//问题delete
export function formDelete(questionId) {
  return request({
    url: '/quality/question/' + questionId+ '/',
    method: 'delete'
  })

}

//邮件发送
export function sendEmail(questionId, receiveList, href) {
  const data = {
    questionId,
    receiveList,
    href
  };
  return request({
    url: '/quality/question/sendEmail/',
    method: 'put',
    data: data
  })

}
