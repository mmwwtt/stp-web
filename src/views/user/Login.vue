<template>
  <div class="bg">
    <img src="../../imgs/bg3.png" alt="" class="bg-img">
    <a-form :model="form" :rules="rulesLogin" @finish="finish" class="login">

      <a-form-item name="userName">
        <a-input v-model:value="form.userName" placeholder="请填写用户名"
                 style="background-color:#65a15a; border: none;"/>
      </a-form-item>
      <a-form-item name="password">
        <a-input-password v-model:value="form.password" placeholder="请填写密码"
                          style="background-color:#65a15a; border: none;"/>
      </a-form-item>
      <a-form-item style="height: 40px; text-align: center;">
        <a-button type="primary" html-type="submit" style="width:280px;background-color:#65a15a; border: none">登入
        </a-button>
      </a-form-item>
      <router-link :to="{path: '/user/register'}" style="float: left">
        <a-button type="primary" style="background-color:#65a15a; border: none">前往注册</a-button>
      </router-link>
      <a-button type="primary" href="https://www.baidu.com"
                style="float: right; font-size: 12px;background-color:#65a15a; border: none">
        忘记密码
      </a-button>
    </a-form>
  </div>
</template>

<script setup lang="ts">

import {onMounted, reactive, ref} from 'vue'
import {message} from 'ant-design-vue'
import {useRouter} from 'vue-router'
import type {User} from "@/type.ts";
import {userVerifyLogin} from "@/api/user.ts";

const isLogin = ref(false)
const router = useRouter()
const form = reactive({
  userName: '',
  password: ''
})
const user = reactive<User>({})

onMounted(() => {
  if (window.sessionStorage.getItem('userInfo') != null) {
    isLogin.value = true
  }
})

const rulesLogin = reactive({
  userName: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  }],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }]
})
const finish = () => {
  Object.assign(user, form)
  userVerifyLogin(user).then(res => {
      window.sessionStorage.setItem('userInfo', JSON.stringify(res))
      router.push({path: '/index'})
      isLogin.value = true
      message.success('登入成功')
  })
}
</script>

<style scoped lang="less">
:deep(.ant-input) {
  background-color: #65a15a !important;
}

:deep(.ant-btn-primary) {
  color: #eee;
}

.bg {
  background-image: url("../../imgs/bg1.png");
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .bg-img {
    width: 500px;
    position: absolute;
    left: 200px;
    top: 200px;
  }

  .login {
    width: 300px;
    position: absolute;
    right: 500px;
    top: 350px;
    padding: 10px;
    text-align: left;
  }
}
</style>
