import request, { METHOD } from '@/utils/request'

// 采购信息分页条件查询
export function purchaseQueryPage (data:any) {
  return request({
    url: '/purchase/queryPage',
    method: METHOD.POST,
    data
  })
}

// 求购信息条件查询
export function purchaseQueryList (data:any) {
  return request({
    url: '/purchase/queryList',
    method: METHOD.POST,
    data
  })
}

// 保存/修改 求购信息
export function purchaseSaveOrUpdate (data:any) {
  return request({
    url: '/purchase/saveOrUpdate',
    method: METHOD.POST,
    data
  })
}