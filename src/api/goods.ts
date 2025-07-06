import request, { METHOD } from '@/utils/request'

// 分页条件查询商品
export function goodsQueryPage (data:any) {
  return request({
    url: '/goods/queryPage',
    method: METHOD.POST,
    data
  })
}

// 条件查询商品
export function goodsQueryList (data:any) {
  return request({
    url: '/goods/queryList',
    method: METHOD.POST,
    data
  })
}


// 保存商品信息
export function goodsSaveOrUpdate (data:any) {
  return request({
    url: '/goods/saveOrUpdate',
    method: METHOD.POST,
    data
  })
}

// 条件查询商品
export function goodsQueryById (params:any) {
  return request({
    url: '/goods/queryById',
    method: METHOD.GET,
    params
  })
}
