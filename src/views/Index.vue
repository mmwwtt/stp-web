
<template>
  <Header/>
  <br>
  <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal"
          style="margin:0 auto; display: inline-block; width:600px">
    <a-sub-menu key="allSort" title="全部分类" style="width: 150px; text-align: center;">
      <a-menu-item v-for="(goodsType) in goodsTypeList" :key="'/index/allGoodsBySort?goodsTypeCode=' + goodsType.code" >
        <router-link :to="{path: '/index/allGoodsBySort', query: {goodsTypeCode:goodsType.code}}">
          {{goodsType.name}}
        </router-link>
      </a-menu-item>
    </a-sub-menu>
    <a-menu-item key="/index/supply" style="width: 150px; text-align: center;">
      <router-link :to="{path: '/index/supply'}">
        产品供应
      </router-link>
    </a-menu-item>
    <a-menu-item key="/index/purchase" style="width: 150px; text-align: center;">
      <router-link :to="{path: '/index/purchase'}">
        产品求购
      </router-link>
    </a-menu-item>
    <a-menu-item key="/index/staff" style="width: 150px; text-align: center;">
      <router-link :to="{path: '/index/externalStaff'}">
        第三方入驻
      </router-link>
    </a-menu-item>
  </a-menu>
  <br>
  <router-view/>
  <Footer/>
</template>
<script setup lang="ts">
import {goodsTypeQuery} from '@/api/common'
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

const router = useRouter()
const goodsTypeList = ref()
const selectedKeys = ref<string[]>(['allSort'])

//组件挂在前执行
onMounted(() => {
  goodsTypeQuery().then(res => {
    goodsTypeList.value = res
  })

  // console.log('router.currentRoute.value.path:' + router.currentRoute.value.path)
  // if (router.currentRoute.value.path === '/index/allGoodsBySort') {
  //   selectedKeys.value[0] = router.currentRoute.value.path + '?goodsCategoryId=' + router.currentRoute.value.query.goodsCategoryId
  // } else {
  //   selectedKeys.value.push(router.currentRoute.value.path)
  // }
  // console.log(selectedKeys.value)
})
</script>
<style scoped lang="less">

</style>
