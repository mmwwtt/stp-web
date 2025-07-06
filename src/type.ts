export interface User {
    userId?: number,
    userName?: string,
    password?: string,
    phone?: string,
    createdDateTime?: string,
    lastUpdatedDateTime?: string
}

export interface Supply {
    supplyId?: number,
    userId?: number,
    title?: string,
    description?: string,
    typeCode?: string,
    place?: string,
    quantity?: number,
    height?: number,
    price?: number,
    imgData?: string,
}

export interface Purchase {
    purchaseId?: number,
    userId?: number,
    title?: string,
    description?: string,
    typeCode?: string,
    place?: string,
    quantity?: number,
    height?: number,
    price?: number,
    imgData?: string,
}

export interface PageResult<T> {
    total?: number,
    records?: Array<T>,
    size?: number,
    current?: number
}

export interface GoodsQuery {
    keyWord?: string
    size?: number,
    current?: number,
    goodsTypeCode?: string,
    goodsId?: number
    orderBySalesCount?:boolean
}

export interface Goods {
    goodsId?: number,
    userId?: number,
    title?: string,
    description?: string,
    salesCount?: number,
    categoryType?: number,
    price?: number,
    rate?: number,
    imgData?: string,
    goodsDetailList?: Array<GoodsDetail>
}
export interface GoodsType{
    code?:string,
    name?:string,
    goodsList?:Goods[]
}
export interface Shopping {
    shoppingId?: number,
    userId?: number,
    goodsDetailId?: number,
    quantity?: number,
    areaId1?: number,
    areaId2?: number,
    areaId3?: number,
    areaDetailed?: string
}


export interface GoodsDetail {
    goodsId?: number,
    goodsDetailId?: number,
    title?: string,
    quantity?: number,
    price?: number,
    imgData?: string,
    imgSmallData?: string
}

export interface ResponseData {
    code: number,
    data?: any,
    message?: string
}

export interface Area {
    areaId?: number,
    aresName?: string,
    preId?: number,
    level?: number
}

export interface Staff {
    externalStaffId?: number,
    userId?: number,
    name?: string,
    phone?: string,
    positionCode?: string,
    positionName?: string
    areaId1?: number,
    areaId2?: number,
    areaId3?: number,
    areaName1?: string,
    areaName2?: string,
    areaName3?: string
}

export interface Position {
    code?: string,
    name?: string
}