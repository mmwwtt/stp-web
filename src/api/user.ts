import request, { METHOD } from '../utils/request'

// 新增/修改用户
export function userSaveOrUpdate (data:any) {
  return request({
    url: '/user/saveOrUpdate',
    method: METHOD.POST,
    data
  })
}

// 登入时验证用户名和密码
export function userVerifyLogin (data:any) {
  return request({
    url: '/user/verifyLogin',
    method: METHOD.POST,
    data
  })
}

