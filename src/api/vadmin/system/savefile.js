import request from '@/utils/request'

// 查询文件列表
export function listSaveFile(query) {
  return request({
    url: '/admin/system/savefile/',
    method: 'get',
    params: query
  })
}

//获取文件闲情
export function getSaveFile(fileId) {
  return request({
    url: '/admin/system/savefile/' + fileId + '/',
    method: 'get'
  })
}

// 新增文件
export function addSaveFile(data) {
  return request({
    url: '/admin/system/savefile/',
    method: 'post',
    data: data
  })
}


// 删除文件
export function delSaveFile(menuId) {
  return request({
    url: '/admin/system/savefile/' + menuId + '/',
    method: 'delete'
  })
}

// 清理废弃文件
export function clearSaveFile() {
  return request({
    url: '/admin/system/clearsavefile/',
    method: 'post'
  })
}

// 自定义下载文件
export function downloadFile(data) {
  return request({
    url: '/admin/system/savefile/downloadFile/',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
