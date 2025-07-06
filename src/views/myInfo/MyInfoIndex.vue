<template>
  <Header/>
  <br>
  <div class="myInfo">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      style="width: 200px; float: left; display: inline-block"
      mode="vertical"
    >
      <a-menu-item key="/myInfoIndex/userInfo">
        <router-link :to="{path: '/myInfoIndex/userInfo'}">
          <user-outlined />我的基本信息
        </router-link>
      </a-menu-item>
<!--      <a-menu-item key="/myInfoIndex/goodsInfo">-->
<!--        <router-link :to="{path: '/myInfoIndex/goodsInfo'}">-->
<!--          <form-outlined />我的商品信息-->
<!--        </router-link>-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="/myInfoIndex/supplyInfo">-->
<!--        <router-link :to="{path: '/myInfoIndex/supplyInfo'}">-->
<!--          <form-outlined />我的供应信息-->
<!--        </router-link>-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="/myInfoIndex/purchaseInfo">-->
<!--        <router-link :to="{path: '/myInfoIndex/purchaseInfo'}">-->
<!--          <form-outlined />我的求购信息-->
<!--        </router-link>-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="/myInfoIndex/externalStaffInfo">-->
<!--        <router-link :to="{path: '/myInfoIndex/externalStaffInfo'}">-->
<!--          <form-outlined />我的入驻信息-->
<!--        </router-link>-->
<!--      </a-menu-item>-->
    </a-menu>
    <div style="display: inline-block; float: left;margin-left: 100px">
      <router-view/>
    </div>
  </div>
  <br>
  <Footer/>
</template>
<script setup lang="ts">
import Header from '@/components/Header.vue'
import { defineComponent, ref } from 'vue'
import { FormOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import Footer from "@/components/Footer.vue";


  const router = useRouter()
  const selectedKeys = ref([router.currentRoute.value.path])



</script>
<style lang="less" scoped>
  .myInfo{
    width: 1200px;
    display: inline-block;
    margin: 30px auto;
  }
</style>
