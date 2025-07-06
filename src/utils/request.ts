import axios from 'axios'
import { Modal } from 'ant-design-vue'
import type {ResponseData} from "@/type.ts";

export const METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
}

const service = axios.create({
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'http://localhost:8001/stp', // url = baseURL + request url
  timeout: 500000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 发送请求前，可以判断是否在headers携带token
    return config
  },
  error => {
    // 发送请求错误
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  // 通过自定义状态码判断请求状态
  response => {
    const res:ResponseData = response.data
    // 如果状态码非200, 就提示一个错误
    if (res.code !== 200) {
      Modal.error({
        title: '发送错误',
        content: res.message || '系统错误,请稍后再试!'
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    Modal.error({
      title: '请求失败',
      content: error.message || '系统错误,请稍后再试!'
    })
    return Promise.reject(error)
  }
)

export default service
