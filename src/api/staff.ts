import request, { METHOD } from '@/utils/request'

// 第三方员工信息 分页条件查询
export function staffQueryPage (data:any) {
  return request({
    url: '/staff/queryPage',
    method: METHOD.POST,
    data
  })
}

// 第三方员工信息 保存/修改
export function staffSaveOrUpdate (data:any) {
  return request({
    url: '/staff/saveOrUpdate',
    method: METHOD.POST,
    data
  })
}