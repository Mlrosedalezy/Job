// axios的全局配置，请求、响应拦截器
import axios from "axios";

let flog: boolean = false  // 一次只刷新一次token
let failedRequests: any = []; // 存储因 token 过期而失败的请求

// 刷新token接口
import { getRefreshToken } from '../api/api'

let instance = axios.create({
    // 基础配置
    baseURL: 'http://127.0.0.1:3000',
    timeout: 3 * 1000,  //超时时间，单位s
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {  //请求发送之前处理
        // 获取accessToken（短），refrechToken（长），（登录后存储在本地中）
        const authorization = localStorage.getItem('accessToken') || ''

        //本地存在，加入请求头中
        if (authorization) {
            config.headers.authorization = `Bearer ${authorization}`
        }
        // console.log(config);

        return config
    }, (error) => {  //错误请求处理
        return Promise.reject(error)
    }
)

// 响应拦截器
instance.interceptors.response.use(
    (response) => {  //响应的处理
        // 获取到配置和后端响应的数据
        let { data, config } = response
        console.log('响应信息', data);

        // // 短token过期
        if (data.status == 401) {
            // 移除过期的短token
            localStorage.removeItem('accessToken')
            // 携带长token去刷新token
            refreshToekn(config)
        } else {
            return data
        }
    }, (error) => {  //错误响应处理
        return Promise.reject(error)
    }
)

// 刷新token
const refreshToekn = async (config: any) => {
    if (!flog) {
        // failedRequests.push(config);
        flog = true
        // 获取长token
        let r_tk = localStorage.getItem('refreshToken')
        // 发送请求刷新token
        const res = await getRefreshToken(r_tk)
        if (res.status === 200) {
            flog = false
            // 刷新成功，将新的短token存储到本地
            localStorage.setItem('accessToken', res.data.accessToken)
            // 重试失败的请求
            // failedRequests.forEach((cb: any) => {
            //     cb.headers.Authorization = `Bearer ${res.data.accessToken};}`;
            //     instance(cb)
            // });
            // failedRequests = []; // 清空队列

            // 重新发起原始请求
            config.headers.Authorization = `Bearer ${res.data.accessToken};}`;
            return instance(config);
        } else if (res.status === 403) {
            alert('登录过期，请重新登录')
            // 长token过期，跳转到登录页
            window.location.href = '/login'
            // 清除长token
            localStorage.removeItem('refreshToken')
        }
    }

}

export default instance