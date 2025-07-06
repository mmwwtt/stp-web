import request, {METHOD} from '@/utils/request'

export function areaQueryByPreId(params: any) {
    return request({
        url: '/area/queryByPreId',
        method: METHOD.GET,
        params
    })
}

export function uploadImg(params: any) {
    return request({
        url: '/goods/uploadImg',
        method: METHOD.GET,
        params
    })
}

// 将文件转为二进制
export function tranFileToBytes(data: any) {
    return request({
        url: '/common/tranFileToBytes',
        method: METHOD.POST,
        data
    })
}

// 返回职位信息列表
export function positionQuery() {
    return request({
        url: '/common/position/query',
        method: METHOD.GET
    })
}

// 查询商品类别
export function goodsTypeQuery() {
    return request({
        url: '/common/goodsType/query',
        method: METHOD.GET
    })
}
