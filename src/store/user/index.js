import { getToken, delToken } from '@/utils/localstorage'
import { reqUserInfo } from '@/api/index'
import { Notify } from 'vant'
const state = {
    userInfo: {},
    token: getToken()
}
const mutations = {
    setUserInfo(state, userInfo) {
        state.userInfo = userInfo
    },
    //退出登录的时候用
    clearUserInfo(state) {
        state.userInfo = {}
        delToken()
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
        //登录
    SOCKET_login(state, data) {
        Notify({ type: 'success', message: `${state.userInfo.nick}已上线` })

    }
}
const actions = {
    //在全局路由守卫中使用，就是如果state中没有用户信息，就调用这个方法，参数在请求头
    async getUserInfo({ commit }) {
        const result = await reqUserInfo()
        if (result.status == 200) {
            commit('GETUSERINFO', result.data)
        }
    }
}
export default {
    state, mutations, actions
}