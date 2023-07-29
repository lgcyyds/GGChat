import Vue from 'vue'
import VueRouter from 'vue-router'
import main from '../views/main/index.vue'

// 重写push|replace方法，解决路由重复跳转报错
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(this, location, () => { }, () => { })
  }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(this, location, () => { }, () => { })
  }
}

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/404'
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/Register',
    name: 'Register',
    component: () => import('../views/Register')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404')
  },
  {
    path: '/',
    name: 'main',
    component: main,
    redirect: '/message',
    children: [
      {
        path: '/message',
        name: 'message',
        component: () => import('../views/main/message')
      },
      {
        path: '/contacts',
        name: 'contacts',
        component: () => import('../views/main/contacts')
      },
      {
        path: '/space',
        name: 'space',
        component: () => import('../views/main/space')
      },
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/Search')
  },
  {
    path: '/userHome',
    name: 'userHome',
    component: () => import('../views/userHome')
  },
  {
    path: '/SpaceDetails',
    name: 'SpaceDetails',
    component: () => import('../views/SpaceDetails')
  },
  {
    path: '/UpdateInfo',
    name: 'UpdateInfo',
    component: () => import('../views/UpdateInfo')
  },
  {
    path: '/AgreeApply/:type',
    name: 'AgreeApply',
    component: () => import('../views/AgreeApply')
  },
  {
    path: '/MessageDetail/:type',
    name: 'MessageDetail',
    component: () => import('../views/MessageDetail')
  },
  {
    path: '/groupHome',
    name: 'groupHome',
    component: () => import('../views/groupHome')
  },
  {
    path: '/CreateOrUpdateGroup/:type',
    name: 'CreateOrUpdateGroup',
    component: () => import('../views/CreateOrUpdateGroup')
  },

]

const router = new VueRouter({
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})
export default router
