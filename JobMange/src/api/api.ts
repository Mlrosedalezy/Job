import instance from '../untils/instance'

export const getUserList = (fileData?: object) => {
    return instance({
        method: "post",
        url: "userlist",
        data: fileData
    })
}

export const houseManage = (fileData?: object) => {
    return instance({
        method: "post",
        url: "/manage/housemanage",
        data: fileData
    })
}

export const TreeManage = (fileData?: object) => {
    return instance({
        method: "post",
        url: "/manage/treemanage",
        data: fileData
    })
}



// 系统管理
// 获取用户列表
export const userManage = (fileData?: object) => {
    return instance({
        method: "post",
        url: "/manage/rbaclist",
        data: fileData
    })
}
// 添加用户接口
export const userAdd = (fileData?: object) => {
    return instance({
        method: "post",
        url: "/manage/rbacadd",
        data: fileData
    })
}
// 删除用户接口
export const userDel = (fileData?: object) => {
    return instance({
        method: "post",
        url: "/manage/rbacdel",
        data: fileData
    })
}
// 修改用户接口
export const userEdit = (fileData?: object) => {
    return instance({
        method: "post",
        url: "/manage/rbacedit",
        data: fileData
    })
}

// 登录接口
export const loginInfo = (loginData?: object) => {
    return instance({
        method: 'post',
        url: '/login/login',
        data: loginData
    })
}
// 刷新token接口
export const getRefreshToken = (r_tk?: any) => {
    return instance({
        method: "post",
        url: '/login/refresh_token',
        headers: { refreshtoken: r_tk }
    })
}
// 手机号登录接口，短信验证码接口
export const telCode = (telData?: object) => {
    return instance({
        method: "post",
        url: '/login/telcode',
        data: telData
    })
}
// 真实阿里云短信验证接口
export const altelCode = (telData?: object) => {
    return instance({
        method: "post",
        url: '/login/altelcode',
        data: telData
    })
}
// 腾讯云人脸识别接口
export const faceLogin = (fileData?: object) => {
    return instance({
        method: "post",
        url: "/login/loginface",
        data: fileData
    })
}
// 路由验证token
export const verifyToken = (token?: object) => {
    return instance({
        method: "post",
        url: "/login/checktoken",
        data: token
    })
}

// 首页
export const getLayout = (fileData?: object) => {
    return instance({
        method: "post",
        url: "/getlayout",
        data: fileData
    })
}
// 工作台
export const workBench = (fileData?: object) => {
    return instance({
        method: "post",
        url: "/workbench",
        data: fileData
    })
}

// 动态路由
export const getRoutes = (fileData?: object) => {
    return instance({
        method: "post",
        url: "/login/getroutes",
        data: fileData
    })
}