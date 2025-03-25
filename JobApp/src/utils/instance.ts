import axios from "axios";
import { refreshToken } from '../api/index'

// 一次响应只刷新一次token
let flog = false

const instance = axios.create({
  // 基础配置
  baseURL: 'http://127.0.0.1:3000',
  timeout: 5 * 1000,  //超时时间，单位s
})

// 刷新短token
const refresh = async () => {
  if(!flog){
    flog = true
    // 获取长Token
    const token = localStorage.getItem('RefreshToken') || ''
    const res = await refreshToken(token) as any
    
    if (res.data.code === 200) {
      flog = false
      // 保存新的短token
      localStorage.setItem('AccessToken', res.data.data)
    }else if( res.data.code === 403){
      // 长token失效，跳转到登录页
      window.location.href = '/clientLogin'
      // 清除长token
      localStorage.removeItem('RefreshToken')
    }
  }
}

// 请求拦截器
instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('AccessToken') || ''
    if (accessToken) {
      // 设置请求头
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config;
  },(error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(async (response) => {
    // 响应数据
    let { data } = response
    console.log('响应数据',data);
    
    if (data.status === 401) {
      // 删除过期的短token
      localStorage.removeItem('AccessToken')
      // 短token过期，进行刷新
      await refresh()
      
      // 重新发起请求
      return instance(response.config)
    }
    return response;
  },(error) => {
    return Promise.reject(error);
  }
);

export default instance