import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5223d7e0 = () => interopDefault(import('..\\nuxt\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _3790a670 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence.vue' /* webpackChunkName: "pages/index/essence" */))
const _69958718 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\counselor.vue' /* webpackChunkName: "pages/index/essence/counselor" */))
const _0b113ea3 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\hotnew.vue' /* webpackChunkName: "pages/index/essence/hotnew" */))
const _627ba358 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\hotnewDetail.vue' /* webpackChunkName: "pages/index/essence/hotnewDetail" */))
const _e30861b6 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\hotnotice.vue' /* webpackChunkName: "pages/index/essence/hotnotice" */))
const _9d8bdb8e = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\hotStock.vue' /* webpackChunkName: "pages/index/essence/hotStock" */))
const _59b958c9 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\reply_comment_hotDetail.vue' /* webpackChunkName: "pages/index/essence/reply_comment_hotDetail" */))
const _2c1f356c = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\SevenMultiptDay.vue' /* webpackChunkName: "pages/index/essence/SevenMultiptDay" */))
const _49b1fc66 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\snowhotnew.vue' /* webpackChunkName: "pages/index/essence/snowhotnew" */))
const _be920d5a = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\SnowTalking.vue' /* webpackChunkName: "pages/index/essence/SnowTalking" */))
const _79fd2504 = () => interopDefault(import('..\\nuxt\\pages\\index\\essence\\SnowTalkingDetail.vue' /* webpackChunkName: "pages/index/essence/SnowTalkingDetail" */))
const _9182585c = () => interopDefault(import('..\\nuxt\\pages\\index\\loginAndres.vue' /* webpackChunkName: "pages/index/loginAndres" */))
const _3ca2d8f2 = () => interopDefault(import('..\\nuxt\\pages\\index\\loginAndres\\login.vue' /* webpackChunkName: "pages/index/loginAndres/login" */))
const _138cb2be = () => interopDefault(import('..\\nuxt\\pages\\index\\loginAndres\\res.vue' /* webpackChunkName: "pages/index/loginAndres/res" */))
const _0688ddcc = () => interopDefault(import('..\\nuxt\\pages\\index\\market.vue' /* webpackChunkName: "pages/index/market" */))
const _882b5b4a = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\debtmarket.vue' /* webpackChunkName: "pages/index/market/debtmarket" */))
const _75dee20d = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\fundmarket.vue' /* webpackChunkName: "pages/index/market/fundmarket" */))
const _43748bf4 = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\groupdetail.vue' /* webpackChunkName: "pages/index/market/groupdetail" */))
const _becb57f2 = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\grouphotoday.vue' /* webpackChunkName: "pages/index/market/grouphotoday" */))
const _498033cb = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\hkmarket.vue' /* webpackChunkName: "pages/index/market/hkmarket" */))
const _2d562d7d = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\marketCenter.vue' /* webpackChunkName: "pages/index/market/marketCenter" */))
const _411792c6 = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\shmarket.vue' /* webpackChunkName: "pages/index/market/shmarket" */))
const _e69ccd16 = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\sizer.vue' /* webpackChunkName: "pages/index/market/sizer" */))
const _54ab2fa6 = () => interopDefault(import('..\\nuxt\\pages\\index\\market\\usmarket.vue' /* webpackChunkName: "pages/index/market/usmarket" */))
const _a479b8bc = () => interopDefault(import('..\\nuxt\\pages\\index\\newIndex.vue' /* webpackChunkName: "pages/index/newIndex" */))
const _644b64c9 = () => interopDefault(import('..\\nuxt\\pages\\index\\newIndex\\datashow.vue' /* webpackChunkName: "pages/index/newIndex/datashow" */))
const _4014827a = () => interopDefault(import('..\\nuxt\\pages\\index\\newIndex\\SevenMultiptDay.vue' /* webpackChunkName: "pages/index/newIndex/SevenMultiptDay" */))
const _d6af82d0 = () => interopDefault(import('..\\nuxt\\pages\\index\\newIndex\\snowhotnew.vue' /* webpackChunkName: "pages/index/newIndex/snowhotnew" */))

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
    component: _5223d7e0,
    name: "index",
    children: [{
      path: "essence",
      component: _3790a670,
      name: "index-essence",
      children: [{
        path: "counselor",
        component: _69958718,
        name: "index-essence-counselor"
      }, {
        path: "hotnew",
        component: _0b113ea3,
        name: "index-essence-hotnew"
      }, {
        path: "hotnewDetail",
        component: _627ba358,
        name: "index-essence-hotnewDetail"
      }, {
        path: "hotnotice",
        component: _e30861b6,
        name: "index-essence-hotnotice"
      }, {
        path: "hotStock",
        component: _9d8bdb8e,
        name: "index-essence-hotStock"
      }, {
        path: "reply_comment_hotDetail",
        component: _59b958c9,
        name: "index-essence-reply_comment_hotDetail"
      }, {
        path: "SevenMultiptDay",
        component: _2c1f356c,
        name: "index-essence-SevenMultiptDay"
      }, {
        path: "snowhotnew",
        component: _49b1fc66,
        name: "index-essence-snowhotnew"
      }, {
        path: "SnowTalking",
        component: _be920d5a,
        name: "index-essence-SnowTalking"
      }, {
        path: "SnowTalkingDetail",
        component: _79fd2504,
        name: "index-essence-SnowTalkingDetail"
      }]
    }, {
      path: "loginAndres",
      component: _9182585c,
      name: "index-loginAndres",
      children: [{
        path: "login",
        component: _3ca2d8f2,
        name: "index-loginAndres-login"
      }, {
        path: "res",
        component: _138cb2be,
        name: "index-loginAndres-res"
      }]
    }, {
      path: "market",
      component: _0688ddcc,
      name: "index-market",
      children: [{
        path: "debtmarket",
        component: _882b5b4a,
        name: "index-market-debtmarket"
      }, {
        path: "fundmarket",
        component: _75dee20d,
        name: "index-market-fundmarket"
      }, {
        path: "groupdetail",
        component: _43748bf4,
        name: "index-market-groupdetail"
      }, {
        path: "grouphotoday",
        component: _becb57f2,
        name: "index-market-grouphotoday"
      }, {
        path: "hkmarket",
        component: _498033cb,
        name: "index-market-hkmarket"
      }, {
        path: "marketCenter",
        component: _2d562d7d,
        name: "index-market-marketCenter"
      }, {
        path: "shmarket",
        component: _411792c6,
        name: "index-market-shmarket"
      }, {
        path: "sizer",
        component: _e69ccd16,
        name: "index-market-sizer"
      }, {
        path: "usmarket",
        component: _54ab2fa6,
        name: "index-market-usmarket"
      }]
    }, {
      path: "newIndex",
      component: _a479b8bc,
      name: "index-newIndex",
      children: [{
        path: "datashow",
        component: _644b64c9,
        name: "index-newIndex-datashow"
      }, {
        path: "SevenMultiptDay",
        component: _4014827a,
        name: "index-newIndex-SevenMultiptDay"
      }, {
        path: "snowhotnew",
        component: _d6af82d0,
        name: "index-newIndex-snowhotnew"
      }]
    }]
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
