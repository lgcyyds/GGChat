import axios from 'axios'
import { baseURL } from './baseUrl'
import { Toast } from 'vant'
import { getToken } from '../utils/localstorage'
const requests = axios.create({
    baseURL: baseURL,
    timeout: 10000
})
requests.interceptors.request.use(config => {
    if (getToken()) {
        config.headers.token = getToken()
    }
    return config
})
requests.interceptors.response.use(res => {
    return res.data
}, error => {
    Toast({
        message: '请求失败',
        icon: 'cross'
    })
    console.log(error);
    
})
export default requests