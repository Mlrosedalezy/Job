import axios from 'axios'

// axios基础配置
const instance = axios.create({
    baseURL: "http://127.0.0.1:3000",
    timeout: 3000,
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {

        return config
    }, (err) => {
        return Promise.reject(err)
    }
)

// 响应拦截器
axios.interceptors.response.use(
    function(response) {
        // 对响应数据做点什么
        const {config,data} = response
        console.log(config,data);
        
        // 把response的data返回给客户端, 不需要可以删除下面1句代码
        return data
    },
    function(error) {
        // 对响应错误做点什么
        return Promise.reject(error)
    }
)

export default instance