<template>
  <h1>基本信息</h1>
  <a-form :model="userInfo" name="basic" autocomplete="off" @finish="onFinish">
    <a-form-item name="userName" label="用户名" :labelCol="{ style: 'width: 100px' }">
      <a-input v-model:value="userInfo.userName" placeholder="请填写用户名"/>
    </a-form-item>

    <a-form-item name="userPassword" label="密码" :labelCol="{ style: 'width: 100px' }">
      <a-input-password v-model:value="userInfo.password" placeholder="请填写密码"/>
    </a-form-item>

    <a-form-item name="userPhone" label="手机号" :labelCol="{ style: 'width: 100px' }">
      <a-input v-model:value="userInfo.phone" placeholder="请填写手机号"/>
    </a-form-item>

    <a-form-item name="createDate" label="创建日期" :labelCol="{ style: 'width: 100px' }">
      <a-input v-model:value="userInfo.createdDateTime" disabled=""/>
    </a-form-item>

    <a-form-item style="height: 40px;" class="submit">
      <a-button type="primary" html-type="submit" class="submit">保存</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive} from 'vue'
import {message} from 'ant-design-vue'
import { userSaveOrUpdate} from '@/api/user.ts'
import {useRouter} from 'vue-router'
import type {User} from "@/type.ts";

onBeforeMount(async () => {
  Object.assign(userInfo, JSON.parse(window.sessionStorage.getItem('userInfo') || "{}"))
})

const router = useRouter()
const userInfo = reactive<User>({})
const onFinish = () => {
  userSaveOrUpdate(userInfo).then(() => {
    message.success('基本信息保存成功,请重新登入')
    window.sessionStorage.removeItem('userInfo')
    router.push({
      path: '/index'
    })
  })
}


</script>

<style scoped lang="less">

</style>
