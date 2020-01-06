import axios from 'axios'
import { Notify } from 'vant'

let axiosIns = axios.create({})

axiosIns.defaults.baseURL = process.env.NODE_ENV !== 'production' ? '/proxy' : ''

axiosIns.defaults.responseType = 'json'

axiosIns.defaults.transformRequest = [function (data = {}) {
    // return qs.stringify(data)
    return JSON.stringify(data)
}]
axiosIns.interceptors.request.use(function (config) {
    // 配置config
    config.headers['Content-Type'] = 'application/json'
    config.headers.Accept = 'application/json'
    return config
})
axiosIns.interceptors.response.use(function (response) {
    let data = response.data
    let status = response.status
    if (status !== 200) return Promise.reject(new Error(`网络故障【${status}】`))
    if (data.ret) return Promise.reject(data)
    return Promise.resolve(data)
})

let ajaxMethod = ['get', 'post']

let request = {}

ajaxMethod.forEach((method) => {
    // 数组取值的两种方式
    request[method] = function (uri, data, config) {
        return new Promise(function (resolve, reject) {
            axiosIns[method](uri, data, config).then((res) => {
                resolve(res.data || res)
            }).catch((res) => {
                Notify({ type: 'danger', message: res.errMsg })
                reject(res.errMsg)
            })
        })
    }
})

export default request
