import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import user from './user'
import search from './search'
import notice from './notice'
import socket from './socket'

export default new Vuex.Store({
    modules:{
        user,
        search,
        notice,
        socket
    }
})