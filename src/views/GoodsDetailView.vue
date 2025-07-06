<template>
  <div class="detailed-goods-info">
    <a-carousel arrows dots-class="slick-dots slick-thumb" style="width: 500px; float: left; margin-right: 30px">
      <div v-for="goodsDetailItem in goods.goodsDetailList" :key="goodsDetailItem.goodsDetailId">
        <img :src="goodsDetailItem.imgData" alt=""/>
      </div>
    </a-carousel>
    <div class="info">
      <div class="detailed-info">
        <h2>{{ goods.description }}</h2>
        <span>价格:</span>
        <del>${{ ((goodsDetail.price || 0.0) * 1.2).toFixed(2) }}元</del>
        <span style="width: 90px">${{ (goodsDetail.price || 0.0).toFixed(2) }}元</span>
        <br>
        <span>库存:</span>
        {{ goodsDetail.quantity }} 件
        <br>
        <span>配送至:</span> <Area @selectedArea="selectedArea" style="width: 280px"/>
        <br>
        <span>详细地址:</span>
        <a-input v-model:value="shopping.areaDetailed" style="width: 280px"/>
      </div>
      <div class="detailed-goods-choice">
        <div class="title">选择品种</div>
        <div class="detailed-goods-show">
          <div style="overflow: hidden">
            <div v-for="(goodsDetail,index) in goods.goodsDetailList"
                 :key="goodsDetail.goodsDetailId"
                 class="detailed-goods-item-show" :class="index==curIdx ? 'borderGreen': ''"
                 @click="changeDetailImg(index)">
              <img :src="goodsDetail.imgSmallData" alt="">
              <span>{{ goodsDetail.title }}</span>
            </div>
          </div>
          <div class="goods-count">
            <a-input-number v-model:value="count" size="large" :min="1"
                            :max="goodsDetail.quantity"/>
            <a-button type="primary" @click="addCart()" style="margin-left:20px; height: 40px">
              <shopping-cart-outlined/>
              加入购物车
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {goodsQueryById} from "@/api/goods.ts";
import type {Goods, GoodsDetail, GoodsQuery, Shopping} from "@/type.ts";
import {ShoppingCartOutlined} from '@ant-design/icons-vue'
import {message} from "ant-design-vue";
import Area from "@/components/Area.vue";

const router = useRouter()

const selectedAreaData = ref()
const count = ref()
const curIdx = ref(0)

const query = reactive<GoodsQuery>({})
const goods = reactive<Goods>({})
const goodsDetail = reactive<GoodsDetail>({})
const shopping = reactive<Shopping>({})

const changeDetailImg = (index: number) => {
  curIdx.value = index
  if (goods && goods.goodsDetailList && Array.isArray(goods.goodsDetailList)) {
    Object.assign(goodsDetail, goods.goodsDetailList[index]);
  }
}

onMounted(() => {
  query.goodsId = parseInt(router.currentRoute.value.query.goodsId as string, 10)
  goodsQueryById({goodsId: query.goodsId}).then((res: any) => {
    setTimeout(() => {
      Object.assign(goods, res)
    }, 100)
  })
})

const selectedArea = (data: any) => {
  selectedAreaData.value = data
}
const addCart = async () => {
  if (window.sessionStorage.getItem('userInfo') === null) {
    message.error('请先登入')
    return
  }
  if (selectedAreaData.value.length < 3) {
    message.warn('请补全地址')
    return
  }
  shopping.areaId1 = selectedAreaData.value[0].areaId
  shopping.areaId2 = selectedAreaData.value[1].areaId
  shopping.areaId3 = selectedAreaData.value[2].areaId
  shopping.quantity = count.value
  shopping.goodsDetailId = goodsDetail.goodsDetailId
  shopping.userId = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').userId
  // updateOrAddShoppingInfo(shopping).then(() => {
  //   message.success('加入购物车成功')
  // })
}


</script>
<style scoped lang="less">
.borderGreen {
  border: 1px solid green !important;
}

.detailed-goods-info {
  display: inline-block;
  font-size: 16px;
  width: 1400px;
  margin: 40px auto 0;

  h3 {
    text-align: left;
  }

  .info {
    float: left;

    .detailed-info {
      text-align: left;

      * {
        margin: 5px;
      }

      span {
        display: inline-block;
        text-align: right;
        width: 70px;
      }
    }

    .detailed-goods-choice {
      width: 750px;
      margin: 30px auto 0;

      .title {
        float: left;
        display: inline-block;
      }

      .detailed-goods-show {
        display: inline-block;
        width: 600px;

        .detailed-goods-item-show {
          float: left;
          background-color: #eee;
          display: inline-block;
          margin: 10px;
          float: left;
          width: 250px;
          height: 60px;
          text-align: left;
          cursor: pointer;
          border: 1px solid transparent;

          img {
            width: 60px;
            margin-right: 15px
          }

          &:hover {
            border: 1px solid green;
          }
        }

        .goods-count {
          margin-top: 40px;
          width: 650px;
          text-align: left;
        }
      }
    }
  }
}

/*走马灯样式 */
.ant-carousel :deep(.slick-dots) {
  position: relative;
  height: auto;
}

.ant-carousel :deep(.slick-slide img) {
  border: 5px solid #fff;
  display: block;
  margin: auto;
}

.ant-carousel :deep(.slick-thumb) {
  bottom: 0px;
  cursor: pointer;
}

</style>
