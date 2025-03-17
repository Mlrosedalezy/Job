import instance from '../untils/instance'

export const getUserList = (fileData?:object)=>{
    return instance({
        method:"post",
        url:"userlist",
        data:fileData
    })
}

export const houseManage = (fileData?:object)=>{
    return instance({
        method:"post",
        url:"/manage/housemanage",
        data:fileData
    })
}