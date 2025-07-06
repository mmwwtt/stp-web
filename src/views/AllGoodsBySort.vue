<template>
  <div class="allGoodsBySort">
    <div style="overflow:hidden;">
      <router-link v-for="goods in goodsPage.records" :key="goods.goodsId"
                   :to="{path:'/index/goodsDetail', query:{goodsId: goods.goodsId}}"
                   style="color: #000;float:left; margin: 10px 20px; width: 200px;height:350px">
        <img :src="goods.imgData" style="width: 200px;height:200px" alt="">
        <p>{{ goods.description }}</p>
        <a-rate v-model:value="goods.rate" disabled/>
        <p>
          ${{ (goods.price||0.0).toFixed(2) }}
        </p>
      </router-link>
    </div>
    <a-pagination v-model:current=goodsQuery.current style="display: block"
                  v-model:pageSize=goodsQuery.size
                  :total=goodsPage.total
                  :show-total="(total:number) => `共 ${total} 条数据`"
                  show-less-items
                  @change="changePage"/>
  </div>
</template>

<script setup lang="ts">
import {reactive, watchEffect, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {goodsQueryPage} from '@/api/goods'
import type {Goods, GoodsQuery, PageResult} from "@/type.ts";

const router = useRouter()
const goodsPage = reactive<PageResult<Goods>>({});
const goodsQuery = reactive<GoodsQuery>({
  keyWord: '',
  current: 1,
  size: 10,
  orderBySalesCount: true,
  goodsTypeCode: ''
})


onMounted(() => {
  watchEffect( async() => {
    goodsQuery.goodsTypeCode = router.currentRoute.value.query.goodsTypeCode as string;
    goodsQuery.keyWord = router.currentRoute.value.query.keyWord as string;
    await goodsQueryPage(goodsQuery).then((res: any) => {
      Object.assign(goodsPage, res)
    })
  })
})

const changePage = async () => {
  await goodsQueryPage(goodsQuery).then((res: any) => {
    Object.assign(goodsPage, res)
  })
}


</script>

<style scoped lang="less">
.allGoodsBySort {
  width: 1200px;
  margin: 50px auto 0;
}
</style>
