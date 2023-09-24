// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import * as API from './api'
import store from '@/store/index'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import '@/router/routerGuards'
import { baseURL, socketUrl } from './api/baseUrl'
// 淘宝移动端自适应布局
import 'lib-flexible'
//vant按需导入
import './plugins/vant'
import localforage from "localforage";
localforage.config({ driver: localforage.INDEXEDDB });
Vue.prototype.$localforage = localforage;
Vue.config.productionTip = false
/* eslint-disable no-new */
Vue.prototype.$baseUrl = baseURL

const SOCKETIO = new VueSocketIO({
  debug: false,
  connection: SocketIO(socketUrl),
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
  options: {
    autoConnect: false
  } //Optional options
})
Vue.use(SOCKETIO)

//如果token存在，那就不会有登录操作，就不能在登陆的时候连接socket
let token = localStorage.getItem('TOKEN')
if (token) {
  SOCKETIO.io.connect()
  setTimeout(() => {
    SOCKETIO.io.emit('login', store.state.user.userInfo._id)
  }, 100);
}



new Vue({
  router,
  store,
  beforeCreate() {
    Vue.prototype.$API = API
  },
  render: h => h(App),
}).$mount('#app')
