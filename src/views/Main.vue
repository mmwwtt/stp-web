<template>
  <div class="content">
    <a-carousel arrows style="margin-top: 30px;">
      <template #prevArrow>
        <div class="custom-slick-arrow" style="left: 10px; zindex: 1">
          <left-circle-outlined/>
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 10px">
          <right-circle-outlined/>
        </div>
      </template>
      <template v-for="(goods) in bannerGoodsList" :key="goods.goodsId">
        <router-link :to="{path:'/index/goodsDetail', query:{goodsId: goods.goodsId}}" class="bannerImg"
                     style="color: #000">
          <span>{{ goods.description }}</span>
          <img :src="goods.imgData" alt="">
        </router-link>
      </template>
    </a-carousel>
    <br>
    <div style="margin: 30px auto; overflow:hidden;display: inline-block">
      <h1>今日热销</h1>
      <router-link v-for="(goods) in hotGoodsList" :key="goods.goodsId"
                   style="float:left;margin: 10px 20px; width: 200px; color: #000"
                   :to="{path:'/index/goodsDetail', query:{goodsId: goods.goodsId}}">
        <img :src="goods.imgData" style="width: 200px; height: 250px" alt="">
        <p>{{ goods.description }}</p>
        <a-rate v-model:value="goods.rate" disabled/>
        <p>
          <del>${{ (goods.price * 1.1).toFixed(2) }}</del>
          ${{ goods.price.toFixed(2) }}
        </p>
      </router-link>
    </div>
    <br>
    <div style="margin: 30px auto; overflow: hidden; display:inline-block; width: 1200px"
         v-for="(goodsType) in goodsTypeList" :key="goodsType.code">
      <router-link :to="{path:'/index/allGoodsBySort', query:{goodsTypeCode: goodsType.code}}">
        <h1>{{ goodsType.name }}</h1>
      </router-link>
      <router-link v-for="(goods) in goodsType.goodsList" :key="goods.goodsId"
                   style="display: inline-block;margin: 10px 20px; width: 200px;color: #000"
                   :to="{path:'/index/goodsDetail', query:{goodsId: goods.goodsId}}">
        <img :src="goods.imgData" style="width: 200px" alt="">
        <p>{{ goods.description }}</p>
        <a-rate v-model:value="goods.rate"/>
        <p>
          <del>${{ ((goods.price || 0.0) * 1.1).toFixed(2) }}</del>
          ${{ (goods.price || 0.0).toFixed(2) }}
        </p>
      </router-link>
    </div>
  </div>
  <br>
</template>

<script setup lang="ts">
import {LeftCircleOutlined, RightCircleOutlined} from '@ant-design/icons-vue'
import {onBeforeMount, ref, reactive} from 'vue'
import {goodsQueryList} from "@/api/goods.ts";
import type {GoodsType} from "@/type.ts";
import {goodsTypeQuery} from '@/api/common'
const bannerGoodsList = ref()
const hotGoodsList = ref()
const goodsTypeList = reactive<GoodsType[]>([])
onBeforeMount(async () => {
  // 初始化banner图展示的数据
  await goodsQueryList({
    size: 7,
    orderBySalesCount: true
  }).then((res: any) => {
    bannerGoodsList.value = res
  })

  // 所有商品中销量最高的4个
  await goodsQueryList({
    size: 4,
    orderBySalesCount: true
  }).then((res: any) => {
    hotGoodsList.value = res
  })

  //每个苗木类中销量高的4个
  await goodsTypeQuery().then((typeRes: any) => {
    const res = typeRes.map((typeItem: any) => {
      goodsQueryList({
        size: 4,
        orderBySalesCount: true,
        goodsTypeCode: typeItem.code
      }).then((goodsRes: any) => {
        typeItem.goodsList = goodsRes
      })
      return typeItem
    })
    setTimeout(() => {
      Object.assign(goodsTypeList, res)
    }, 100)
  })
})
</script>

<style scoped lang="less">
.content {
  color: #000;

  .ant-carousel {
    display: inline-block;
    width: 800px;

    .bannerImg {
      span {
        display: inline-block;
        height: 100px;
        width: 200px;
        font-size: 25px;
        text-align: left;
        line-height: 26px;
      }

      img {
        height: 500px;
        margin: 0 auto;
        float: right;
      }
    }
  }

  .ant-carousel :deep(.slick-slide) {
    text-align: center;
    height: 500px;
    line-height: 500px;
    background: #EEE;
    overflow: hidden;
  }

  .ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #65a15a;
    background-color: rgba(30, 45, 61, 0.11);
    opacity: 0.3;
    z-index: 1;
  }

  .ant-carousel :deep(.custom-slick-arrow:before) {
    display: none;
  }

  .ant-carousel :deep(.custom-slick-arrow:hover) {
    opacity: 0.5;
  }

  .ant-carousel :deep(.slick-slide h3) {
    color: #fff;
  }

}
</style>
