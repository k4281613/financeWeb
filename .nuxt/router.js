import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _3968a311 = () => interopDefault(import('..\\nuxt\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _0e5f2ee2 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence.vue' /* webpackChunkName: "pages/index/essence" */))
const _48cb8b99 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\counselor.vue' /* webpackChunkName: "pages/index/essence/counselor" */))
const _248f1c7c = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\hotnew.vue' /* webpackChunkName: "pages/index/essence/hotnew" */))
const _1dd84e33 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\hotnewDetail.vue' /* webpackChunkName: "pages/index/essence/hotnewDetail" */))
const _6db1d3a6 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\hotnotice.vue' /* webpackChunkName: "pages/index/essence/hotnotice" */))
const _f23e0cd0 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\hotStock.vue' /* webpackChunkName: "pages/index/essence/hotStock" */))
const _17a8e78a = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\reply_comment_hotDetail.vue' /* webpackChunkName: "pages/index/essence/reply_comment_hotDetail" */))
const _e873d5a6 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\SevenMultiptDay.vue' /* webpackChunkName: "pages/index/essence/SevenMultiptDay" */))
const _513c8805 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\snowhotnew.vue' /* webpackChunkName: "pages/index/essence/snowhotnew" */))
const _eb043cd8 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\SnowTalking.vue' /* webpackChunkName: "pages/index/essence/SnowTalking" */))
const _e929cef6 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\SnowTalkingDetail.vue' /* webpackChunkName: "pages/index/essence/SnowTalkingDetail" */))
const _70826e71 = () => interopDefault(import('..\\nuxt\\pages\\index\\loginAndres.vue' /* webpackChunkName: "pages/index/loginAndres" */))
const _7e36cff0 = () => interopDefault(import('..\\nuxt\\pages\\index\\loginAndres\\login.vue' /* webpackChunkName: "pages/index/loginAndres/login" */))
const _f4683902 = () => interopDefault(import('..\\nuxt\\pages\\index\\loginAndres\\res.vue' /* webpackChunkName: "pages/index/loginAndres/res" */))
const _1d48dbcd = () => interopDefault(import('..\\nuxt\\pages\\index\\market.vue' /* webpackChunkName: "pages/index/market" */))
const _c9bf5248 = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\debtmarket.vue' /* webpackChunkName: "pages/index/market/debtmarket" */))
const _5514e68e = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\fundmarket.vue' /* webpackChunkName: "pages/index/market/fundmarket" */))
const _4aff1793 = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\groupdetail.vue' /* webpackChunkName: "pages/index/market/groupdetail" */))
const _eb3d8770 = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\grouphotoday.vue' /* webpackChunkName: "pages/index/market/grouphotoday" */))
const _888136e8 = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\hkmarket.vue' /* webpackChunkName: "pages/index/market/hkmarket" */))
const _171d15be = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\marketCenter.vue' /* webpackChunkName: "pages/index/market/marketCenter" */))
const _51b3675e = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\shmarket.vue' /* webpackChunkName: "pages/index/market/shmarket" */))
const _03790854 = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\sizer.vue' /* webpackChunkName: "pages/index/market/sizer" */))
const _722b3f32 = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\usmarket.vue' /* webpackChunkName: "pages/index/market/usmarket" */))
const _147ba563 = () => interopDefault(import('..\\nuxt\\pages\\index\\newIndex.vue' /* webpackChunkName: "pages/index/newIndex" */))
const _4381694a = () => interopDefault(import('..\\nuxt\\pages\\index\\newIndex\\datashow.vue' /* webpackChunkName: "pages/index/newIndex/datashow" */))
const _556cca4e = () => interopDefault(import('..\\nuxt\\pages\\index\\newIndex\\SevenMultiptDay.vue' /* webpackChunkName: "pages/index/newIndex/SevenMultiptDay" */))
const _7e6f26d9 = () => interopDefault(import('..\\nuxt\\pages\\index\\newIndex\\snowhotnew.vue' /* webpackChunkName: "pages/index/newIndex/snowhotnew" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _3968a311,
    name: "index",
    children: [{
      path: "essence",
      component: _0e5f2ee2,
      name: "index-essence",
      children: [{
        path: "counselor",
        component: _48cb8b99,
        name: "index-essence-counselor"
      }, {
        path: "hotnew",
        component: _248f1c7c,
        name: "index-essence-hotnew"
      }, {
        path: "hotnewDetail",
        component: _1dd84e33,
        name: "index-essence-hotnewDetail"
      }, {
        path: "hotnotice",
        component: _6db1d3a6,
        name: "index-essence-hotnotice"
      }, {
        path: "hotStock",
        component: _f23e0cd0,
        name: "index-essence-hotStock"
      }, {
        path: "reply_comment_hotDetail",
        component: _17a8e78a,
        name: "index-essence-reply_comment_hotDetail"
      }, {
        path: "SevenMultiptDay",
        component: _e873d5a6,
        name: "index-essence-SevenMultiptDay"
      }, {
        path: "snowhotnew",
        component: _513c8805,
        name: "index-essence-snowhotnew"
      }, {
        path: "SnowTalking",
        component: _eb043cd8,
        name: "index-essence-SnowTalking"
      }, {
        path: "SnowTalkingDetail",
        component: _e929cef6,
        name: "index-essence-SnowTalkingDetail"
      }]
    }, {
      path: "loginAndres",
      component: _70826e71,
      name: "index-loginAndres",
      children: [{
        path: "login",
        component: _7e36cff0,
        name: "index-loginAndres-login"
      }, {
        path: "res",
        component: _f4683902,
        name: "index-loginAndres-res"
      }]
    }, {
      path: "market",
      component: _1d48dbcd,
      name: "index-market",
      children: [{
        path: "debtmarket",
        component: _c9bf5248,
        name: "index-market-debtmarket"
      }, {
        path: "fundmarket",
        component: _5514e68e,
        name: "index-market-fundmarket"
      }, {
        path: "groupdetail",
        component: _4aff1793,
        name: "index-market-groupdetail"
      }, {
        path: "grouphotoday",
        component: _eb3d8770,
        name: "index-market-grouphotoday"
      }, {
        path: "hkmarket",
        component: _888136e8,
        name: "index-market-hkmarket"
      }, {
        path: "marketCenter",
        component: _171d15be,
        name: "index-market-marketCenter"
      }, {
        path: "shmarket",
        component: _51b3675e,
        name: "index-market-shmarket"
      }, {
        path: "sizer",
        component: _03790854,
        name: "index-market-sizer"
      }, {
        path: "usmarket",
        component: _722b3f32,
        name: "index-market-usmarket"
      }]
    }, {
      path: "newIndex",
      component: _147ba563,
      name: "index-newIndex",
      children: [{
        path: "datashow",
        component: _4381694a,
        name: "index-newIndex-datashow"
      }, {
        path: "SevenMultiptDay",
        component: _556cca4e,
        name: "index-newIndex-SevenMultiptDay"
      }, {
        path: "snowhotnew",
        component: _7e6f26d9,
        name: "index-newIndex-snowhotnew"
      }]
    }]
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
