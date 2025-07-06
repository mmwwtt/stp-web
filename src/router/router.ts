import {createRouter, createWebHistory} from 'vue-router'

import Login from "@/views/user/Login.vue";
import Register from "@/views/user/Register.vue";
import Index from "@/views/Index.vue";
import MyInfoIndex from "@/views/myInfo/MyInfoIndex.vue";
import UserInfo from "@/views/myInfo/UserInfo.vue";
import Main from "@/views/Main.vue";
import GoodsDetailView from "@/views/GoodsDetailView.vue";
import AllGoodsBySort from "@/views/AllGoodsBySort.vue";
import Supply from "@/views/Supply.vue";
import Purchase from "@/views/Purchase.vue";
import ExternalStaff from "@/views/ExternalStaff.vue";
// import Home from "@/views/Home.vue";
// import Index from "@/views/Index.vue";
// import Main from "@/views/goods/Main.vue";
// import AllGoodsBySort from "@/views/goods/AllGoodsBySort.vue";
// import GoodsDetailView from "@/views/goods/GoodsDetailView.vue";
// import ShoppingCart from "@/views/ShoppingCart.vue";
// import Supply from "@/views/Supply.vue";
// import Purchase from "@/views/Purchase.vue";
// import Staff from "@/views/Staff.vue";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // {
        //     name: 'home',
        //     path: '/home',
        //     component: Home
        // },
        {
            path: '/',
            redirect: '/index',
        },
        {
            path: '/user/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/user/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/index',
            name: 'Index',
            component: Index,
            redirect: '/index/main',
            children: [
                {
                    path: '/index/main',
                    name: 'Main',
                    component: Main
                },
                {
                    path: '/index/allGoodsBySort',
                    name: 'AllGoodsBySort',
                    component: AllGoodsBySort
                },
                {
                    path: '/index/goodsDetail',
                    name: 'GoodsDetail',
                    component: GoodsDetailView
                },
        //         {
        //             path: '/index/shoppingCart',
        //             name: 'ShoppingCart',
        //             component: ShoppingCart
        //         },
                {
                    path: '/index/supply',
                    name: 'Supply',
                    component: Supply
                },
                {
                    path: '/index/purchase',
                    name: 'Purchase',
                    component: Purchase
                },
                {
                    path: '/index/externalStaff',
                    name: 'ExternalStaff',
                    component: ExternalStaff
                }
            ]
        },
        {
            path: '/myInfoIndex',
            name: 'MyInfoIndex',
            component: MyInfoIndex,
            children: [
                {
                    path: '/myInfoIndex/userInfo',
                    name: 'UserInfo',
                    component: UserInfo
                }
                // ,
                // {
                //     path: '/myInfoIndex/goodsInfo',
                //     name: 'MyGoodsInfo',
                //     component: () => import('../views/myInfo/GoodsInfo.vue')
                // },
                // {
                //     path: '/myInfoIndex/supplyInfo',
                //     name: 'MySupplyInfo',
                //     component: () => import('../views/myInfo/SupplyInfo.vue')
                // },
                // {
                //     path: '/myInfoIndex/purchaseInfo',
                //     name: 'MyPurchaseInfo',
                //     component: () => import('../views/myInfo/PurchaseInfo.vue')
                // },
                // {
                //     path: '/myInfoIndex/externalStaffInfo',
                //     name: 'MyExternalStaffInfo',
                //     component: () => import('../views/myInfo/ExternalStaff.vue')
                // }
            ]
        }
    ],
})

export default router
