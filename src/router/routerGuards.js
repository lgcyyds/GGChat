import router from './index'
import store from '@/store'
import { getToken } from '@/utils/localstorage'

router.beforeEach(async (to, from, next) => {
    const token = getToken()
    const nick = store.state.user.userInfo.nick
    if (token) {
        //已登陆
        //已经登陆了就不能去登录和注册页面
        if (to.path == '/login' || to.path == '/register') {
            next('/')
        } else {
            if (nick) {
                //查看有没有用户信息
                next()
            } else {
                try {
                    //只要有token调用这个方法就可以获取用户信息
                    await store.dispatch('getUserInfo')
                    next()
                } catch (error) {
                    //报错就说明没有token，那就给我回去登录
                    store.commit('clearUserInfo')
                    next('/login')
                }
            }
        }
    } else {
        //未登录
        if (to.path == '/login') {
            next()
        } else {
            next('/login')
        }
    }
})