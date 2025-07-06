import request, { METHOD } from '@/utils/request'

// 条件查询供应信息
export function supplyQueryList (data:any) {
  return request({
    url: '/supply/queryList',
    method: METHOD.POST,
    data
  })
}

// 条件查询供应信息
export function supplyQueryPage (data:any) {
  return request({
    url: '/supply/queryPage',
    method: METHOD.POST,
    data
  })
}


// 新增/更新 供应信息
export function supplySaveOrUpdate (data:any) {
  return request({
    url: '/supply/saveOrUpdate',
    method: METHOD.POST,
    data
  })
}
