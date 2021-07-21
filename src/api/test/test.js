import request from '@/utils/request'

// 新增质量单
export function addQuality(data) {
  return request({
    url: '/quality/quality/',
    method: 'post',
    data: data
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/admin/permission/dept/treeselect/?status=1',
    method: 'get'
  })
}
