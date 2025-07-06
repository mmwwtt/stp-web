<template>
  <div>
    <a-table
        style="width: 1200px;margin: 30px auto"
        :columns="columns"
        rowKey="shoppingId"
        :data-source="shopCartList"
        :pagination="pagination"
    >
      <template #bodyCell="{record, index, column}">
        <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
        <template v-if="column.dataIndex === 'info'">
          <img :src="record.imgSmallData" alt="" style="margin-right: 15px; float: left">
          <div style="display: inline-block; float:left; margin-top: 10px">
            <span style=""> {{ record.goodsDetailedTitle }}</span>
            <br>
            <span>￥{{ record.goodsDetailedPrice.toFixed(2) }}</span>
          </div>
        </template>
        <template v-if="column.dataIndex === 'quantity'">
          <a-input-number v-model:value="record.quantity" size="large" :min="1" :max="record.quantity"/>
          {{ record.goodsDetailedUnit }}
        </template>
        <template v-if="column.dataIndex === 'price'">￥{{ (record.quantity * record.goodsDetailedPrice).toFixed(2) }}
        </template>
        <template v-if="column.dataIndex === 'delete'">
          <a-button @click="deleteShopCart(record.shoppingId,index)">删除</a-button>
        </template>
      </template>
      <template #footer style="text-align: right">
        <div style="text-align: right;padding-right: 50px">总价：￥{{ totalPrice.toFixed(2) }}元</div>
      </template>
    </a-table>

  </div>
</template>
<script setup lang="ts">

import {ref, computed, reactive, onMounted} from 'vue'
import {message} from 'ant-design-vue'
import type {User} from "@/type.ts";
import {shopDeleteById, shopQueryPage} from "@/api/shop.ts";

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: '20%',
    align: 'center'
  },
  {
    title: '商品信息',
    dataIndex: 'info',
    width: '35%',
    align: 'center'
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    width: '15%',
    align: 'center'
  },
  {
    title: '总价',
    dataIndex: 'price',
    width: '15%',
    align: 'center'
  },
  {
    title: '编辑',
    dataIndex: 'delete',
    width: '15%',
    align: 'center'
  }
]
const shopCartList = ref([])
const dataSource = ref([])
let userInfo = reactive<User>({})
onMounted(async () => {
  userInfo = JSON.parse(window.sessionStorage.getItem('userInfo')||'{}')
  await shopQueryPage({
    userId: userInfo.userId,
    current: pagination.current,
    pageSize: pagination.pageSize
  }).then((res:any) => {
    shopCartList.value = res.records
  })
})
const totalPrice = computed(() => {
  let sum = 0
  shopCartList.value.forEach((item:any) => {
    sum += item.price * item.quantity
  })
  return sum
})
const deleteShopCart = (shoppingId:number, index:number) => {
  shopDeleteById({shoppingId: shoppingId}).then(async () => {
    await shopQueryPage({
      userId: userInfo.userId,
      current: pagination.current,
      pageSize: pagination.pageSize
    }).then((res:any) => {
      shopCartList.value = res.records
    })
    message.success('商品移除成功')
  })
}
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ['5', '10', '20', '30', '40', '100'],
  showTotal: (total:number) => `共 ${total} 条数据`,
  onChange: async (current:number, pageSize:number) => {
    pagination.pageSize = pageSize
    pagination.current = current
    await shopQueryPage({
      userId: userInfo.userId,
      current: pagination.current,
      pageSize: pagination.pageSize
    }).then((res:any) => {
      shopCartList.value = JSON.parse(JSON.stringify(res))
    })
  }
})

</script>
<style scoped lang="less">
.ant-table-footer {
  text-align: right !important;
}
</style>
