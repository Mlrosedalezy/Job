import instance from "../utils/instance"

// 客户端登录接口
export const clientLogin = (data:object)=>{
    return instance({
        method:'post',
        url:'/logins/login',
        data
    })
}

// 向手机发送验证码
export const clientGetyzm = (data:object)=>{
    return instance({
        method:'post',
        url:'/logins/getyzm',
        data:data
    })
}

// 验证码登录
export const clientYzmLogin = (data:object)=>{
    return instance({
        method:'post',
        url:'/logins/verifyyzm',
        data:data
    })
}

// 人脸识别接口(传入图片base64)
export const face = (b64:string) => {
    return instance({
        url: '/logins/facelogin',
        data: {
            "b64": b64,
        },
        method: 'post'
    })
}

// 删除手机号
export const delPhone = (data:object)=>{
    return instance({
        method:'post',
        url:'/logins/delTel',
        data:data
    })
}
// 刷新token
export const refreshToken = (token:string)=>{
    console.log(token);
    
    return instance({
        method:'post',
        url:'/logins/refresh',
        headers:{
            refreshToken:token
        }
    })
}

// 获取用户列表
export const getUser = (params:object)=>{
    
    return instance({
        method:'get',
        url:'/client/userlist',
        params
    })
}

// 获取消息列表
export const getMessage = ()=>{
    return instance({
        method:'get',
        url:'/client/getChat',
    })
}

// 添加消息列表
export const addMessage = (data:object)=>{
    return instance({
        method:'post',
        url:'/client/addChat',
        data
    })
}

// 获取卡卷
export const getVoucher = (params?:object)=>{
    return instance({
        method:'get',
        url:'/client/getVoucher',
        params
    })
}

// 添加卡卷
export const addVoucher = (data:object)=>{
    return instance({
        method:'post',
        url:'/client/addVoucher',
        data
    })
}

// 使用补签卡
export const useBuVoucher = ()=>{
    return instance({
        method:'post',
        url:'/client/useBuVoucher',
    })
}

// 支付
export const payment = (data:object)=>{
    return instance({
        method:'post',
        url:'/client/payment',
        data
    })
}
