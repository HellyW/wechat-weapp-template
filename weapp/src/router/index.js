import Vue from 'vue'
import Router from 'vue-router'
import { routers } from './router'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  routes: routers
})

router.afterEach((to,from)=>{
  console.log('router afterEach is defined here')
})
