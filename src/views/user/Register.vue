<template>
  <div class="bg">
    <img src="../../imgs/bg3.png" alt="" class="bg-img">
    <div class="register">
      <a-form v-if="!isRegister" :model="form" :rules="rules" @finish="finish" autocomplete="off">
        <a-form-item name="userName">
          <a-input v-model:value="form.userName" placeholder="请填写用户名" autocomplete="new-password"
                   style="background-color:#65a15a; border: none;"/>
        </a-form-item>

        <a-form-item name="password">
          <a-input-password v-model:value="form.password" placeholder="请填写密码" autoComplete="new-password"
                            style="background-color:#65a15a; border: none;"/>
        </a-form-item>
        <a-form-item name="passwordAgain">
          <a-input-password v-model:value="form.passwordAgain" placeholder="请再次填写密码"  autoComplete="new-password"
                            style="background-color:#65a15a; border: none;"/>
        </a-form-item>
        <a-form-item style="height: 40px;">
          <a-button type="primary" html-type="submit"
                    style="background-color:#65a15a; border: none;width:280px">注册
          </a-button>
        </a-form-item>
      </a-form>
      <a-result v-if="isRegister" status="success" title="注册成功成功" ub-title="欢迎成为青苗家的一员"
                style="background-color:transparent!important;">
        <router-link :to="{path: '/user/login'}">
          <a-button type="primary">前往登入</a-button>
        </router-link>
      </a-result>
    </div>
  </div>
</template>

<script setup lang="ts">

import {reactive, ref} from 'vue'
import {message} from 'ant-design-vue'
import type {User} from "@/type.ts";
import {userSaveOrUpdate} from "@/api/user.ts";

const isRegister = ref(false)
const form = reactive({
  userName: '',
  password: '',
  passwordAgain: ''
})
const user = reactive<User>({})
const rules = reactive({
  userName: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  }, {
    min: 2,
    max: 15,
    message: '用户名长度需要在2-15之间'
  }],
  password: [{
    required: true,
    message: '请输入用户密码',
    trigger: 'blur'
  }, {
    min: 2,
    max: 15,
    message: '用户密码长度需要在2-15之间'
  }],
  passwordAgain: [{
    required: true,
    message: '请再次输入用户密码',
    tigger: 'blur'
  }]
})

const finish = () => {
  if (form.password !== form.passwordAgain) {
    message.error('两次密码输入不一致')
    return
  }

  Object.assign(user, form)
  userSaveOrUpdate(user).then(() => {
    message.success('注册成功')
    isRegister.value = true
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

  .register {
    width: 300px;
    position: absolute;
    right: 500px;
    top: 350px;
    padding: 10px;
    text-align: left;
  }

  :deep(.ant-result-content) {
    background-color: transparent !important;
  }
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important; /* 使用 !important 来确保覆盖 */
  -webkit-text-fill-color: #333 !important; /* 设置文本颜色 */
  transition: background-color 5000s ease-in-out 0s; /* 防止背景颜色的闪烁 */
}
</style>
