import Vue from 'vue'
import App from './App'
import Vant from 'vant'
import 'vant/lib/index.css'
import wx from "weixin-js-sdk"
import _ from 'underscore'
import { api } from '@/api'
import { router } from './router'

const $wx = wx

Vue.prototype.$wx = $wx

router.afterEach((to,from)=>{
  // 持续更新微信 jssdk
  let uri = window.location.href.split('#')[0] || ""
  api.wechat.getConfig(uri).then(data=>{
    data && $wx.config(_.extend({}, {
      debug: process.env.NODE_ENV !== 'production', 
      jsApiList: ["getLocation"]
    }, data))
  })
})

$wx.ready(()=>{
  // 整个项目JSSDK 全局配置
  console.log('main wechat jssdk is ready')
})

$wx.error(()=>{
  console.log('main wechat jssdk is error')
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
