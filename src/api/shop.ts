import request, { METHOD } from '@/utils/request'

// 购物信息分页条件查询
export function shopQueryPage (data:any) {
  return request({
    url: '/shop/queryPage',
    method: METHOD.POST,
    data
  })
}

// 购物信息条件查询
export function shopQueryList (data:any) {
  return request({
    url: '/shop/queryList',
    method: METHOD.POST,
    data
  })
}

// 保存/修改 购物信息
export function shopSaveOrUpdate (data:any) {
  return request({
    url: '/shop/saveOrUpdate',
    method: METHOD.POST,
    data
  })
}

// 保存/修改 购物信息
export function shopDeleteById (data:any) {
  return request({
    url: '/shop/deleteById',
    method: METHOD.GET,
    data
  })
}