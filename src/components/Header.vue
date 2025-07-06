<template>
  <div class="header">
    <div class="content">
      <router-link :to="{path:'/index'}">
        <span class="left" style="color: #EEEEEE">欢迎来到青苗家!</span>
      </router-link>
      <div v-if="userInfo.userId == undefined" class="right">
        <router-link :to="{path: '/user/login'}" style="cursor: pointer; color: #EEEEEE">
          登入
        </router-link>
        <router-link :to="{path: '/user/register'}" style="cursor: pointer; color: #EEEEEE">
          注册
        </router-link>
      </div>
      <div v-if="userInfo.userId != undefined" class="right">
        欢迎: {{ userInfo.userName }}
        <a-button type="text" @click="loginOut" style="color: #EEEEEE; font-size: 18px">注销</a-button>
        <router-link :to="{path: '/myInfoIndex/userInfo'}" style="cursor: pointer; color: #EEEEEE">
          我的信息
        </router-link>
      </div>
    </div>
    <a-space align="end" :size="200" class="header-main">
      <router-link :to="{path:'/index'}">
        <img src="../imgs/logo-50.png" alt="logo图片" class="logo">
      </router-link>
      <a-space align="end" size="0">
        <a-input v-model:value="searchWord" placeholder="请输入搜索的内容"/>
        <search-outlined class="search_icon" @click="search"/>
      </a-space>
      <a-space align="end" :size="20">
        <a-popover placement="bottom" trigger="click">
          <template #content>
            <a-tabs v-model:activeKey="activeKey" style="width: 230px">
              <a-tab-pane key="1">
                <template #tab>
                  <strong>Login</strong>
                </template>
                <div class="loginSmall">
                  <a-form class="login" v-if="userInfo.userId == undefined" :model="userForm" @finish="submitLogin">
                    <a-form-item name="userName" :rules="[{ required: true, message: '请填写用户名!' }]">
                      <a-input v-model:value="userForm.userName" placeholder="请填写用户名"/>
                    </a-form-item>

                    <a-form-item name="userPassword" :rules="[{ required: true, message: '请填写密码!' }]">
                      <a-input-password v-model:value="userForm.password" placeholder="请填写密码"/>
                    </a-form-item>

                    <a-form-item style="height: 40px;" class="submit">
                      <a-button type="primary" html-type="submit" class="submit">登入</a-button>
                    </a-form-item>
                    <a-button type="text" @click="activeKey='2'" style="float: left; font-size: 12px;">前往注册
                    </a-button>
                    <a-button type="text" href="https://www.baidu.com" style="float: right; font-size: 12px;">忘记密码
                    </a-button>
                  </a-form>
                  <a-result v-if="userInfo.userId != undefined" status="success" title="登入成功" sub-title="欢迎">
                    <a-button type="text" @click="loginOut">注销</a-button>
                  </a-result>
                </div>
              </a-tab-pane>

              <a-tab-pane key="2">
                <template #tab>
                  <strong>Register</strong>
                </template>
                <div class="registerSmall">
                  <a-form v-if="!isRegister" :model="userForm" @finish="submitRegister">
                    <a-form-item name="userName" :rules="[{ required: true, message: '请填写用户名!' }]">
                      <a-input v-model:value="userForm.userName" placeholder="请填写用户名"/>
                    </a-form-item>

                    <a-form-item name="password" :rules="[{ required: true, message: '请填写密码!' }]">
                      <a-input-password v-model:value="userForm.password" placeholder="请填写密码"/>
                    </a-form-item>

                    <a-form-item name="passwordAgain" :rules="[{ required: true, message: '请再次填写密码!' }]">
                      <a-input-password v-model:value="userForm.passwordAgain" placeholder="请再次填写密码"/>
                    </a-form-item>

                    <a-form-item style="height: 40px;">
                      <a-button type="primary" html-type="submit" class="submit">注册</a-button>
                    </a-form-item>
                  </a-form>
                  <a-result v-if="isRegister" status="success" title="注册成功成功" sub-title="欢迎成为青苗家的一员">
                    <a-button type="text" @click="activeKey='1'">前往登入</a-button>
                  </a-result>
                </div>
              </a-tab-pane>
            </a-tabs>
          </template>
          <user-outlined class="icon"/>
        </a-popover>
        <div @click="toShopCart()">
          <shopping-cart-outlined class="icon"/>
        </div>
      </a-space>
    </a-space>
    <hr>
  </div>
</template>
<script setup lang="ts">
import {ref, reactive, onBeforeMount} from 'vue'
import {useRouter} from 'vue-router'
import {
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons-vue'

import {message} from 'ant-design-vue'
import type {User} from "@/type.ts";
import {userSaveOrUpdate, userVerifyLogin} from "@/api/user.ts";

const searchWord = ref()
const isRegister = ref(false)
const activeKey = ref('1')
const router = useRouter()
const userInfo = reactive<User>({})
const userForm = reactive({
  userName: '',
  password: '',
  passwordAgain: ''
})

onBeforeMount(async () => {
  Object.assign(userInfo, JSON.parse(window.sessionStorage.getItem('userInfo') || '{}'))
})

const toShopCart = () => {
  if (userInfo === null) {
    message.success('请先登入')
    return
  }
  // router.push({
  //   path: '/index/shoppingCart'
  // })
}

// 提交表单-登录
const submitLogin = () => {
  userVerifyLogin(userForm).then(res => {
    message.success('登入成功')
    window.sessionStorage.setItem('userInfo', JSON.stringify(res))

    Object.assign(userInfo, JSON.parse(window.sessionStorage.getItem('userInfo') || '{}'))
  })
}

// 提交表单-注册
const submitRegister = () => {
  userSaveOrUpdate(userForm).then(() => {
    message.success('注册成功')
    isRegister.value = true
  })
}

const loginOut = () => {
  window.sessionStorage.removeItem('user')
  Object.assign(userInfo, {})
  router.push({
    path: '/index'
  })
  message.success('已注销')
}

const search = () => {
  if (searchWord.value === undefined || searchWord.value === '') {
    message.warning('搜索内容不能为空')
    return
  }
  // router.push({
  //   query: {keyWord: searchWord.value},
  //   path: '/index/allGoodsBySort'
  // })
}


</script>
<style lang="less">
.header {

  .content {
    width: 100%;
    height: 70px;
    background-color: #65a15a;
    overflow: hidden;
    display: inline-block;
    line-height: 70px;
    font-size: 18px;
    color: #f8fffa;
    padding: 5px 20%;

    .left {
      float: left;
    }

    .right {
      float: right;
    }
  }

  .header-main {
    width: 1150px;
    margin: 30px 0 30px 0;
    overflow: hidden;

    .logo {
      float: left;
      height: 70px;
    }

    .ant-input {
      width: 450px;
      height: 50px;
      font-size: 16px;
      line-height: 50px;
      border: 3px solid #66c18c;
      border-right: 0px;
      border-radius: 25px 0px 0px 25px;
      padding-left: 30px;
      outline: none;

      &:hover {
        border: 3px solid #65a15a;
        border-right: 0px;
      }

      &:focus {
        border: 3px solid #65a15a;
        border-right: 0px;
        box-shadow: none !important;
      }
    }

    .search_icon {
      width: 50px;
      height: 50px;
      line-height: 50px;
      font-size: 26px;
      color: #f8fffa;
      background-color: #66c18c;
      border-radius: 0 25px 25px 0;

      &:hover {
        cursor: pointer;
        background-color: #65a15a;
      }
    }

    .icon {
      font-size: 39px;
      cursor: pointer;
    }
  }
}

.loginSmall {
  .ant-form {
    width: 230px;
    margin: 0 auto;
    text-align: left;

    .ant-form-item, .ant-form-item-control {
      height: 50px;
      margin-bottom: 5px;
    }

    .remember {
      margin-top: -10px;
      height: 25px;
      line-height: 25px;
    }

    .submit {
      width: 230px;
      height: 40px;
      font-weight: 700;
      font-size: 16px;
    }
  }

  .ant-result {
    padding: 0;
    margin: 0;

    .ant-result-content {
      padding: 0;
      margin: 0;
      background-color: transparent;
    }
  }
}

.registerSmall {
  .ant-form {
    width: 230px;
    margin: 0 auto;
    text-align: left;

    .ant-form-item, .ant-form-item-control {
      height: 50px;
      margin-bottom: 5px;
    }

    .submit {
      width: 230px;
      height: 40px;
      font-weight: 700;
      font-size: 16px;
    }
  }

  .ant-result {
    padding: 0;
    margin: 0;

    .ant-result-content {
      padding: 0;
      margin: 0;
      background-color: transparent;
    }
  }
}
</style>
