import instance from '../untils/instance'

export const getUserList = (fileData?:object)=>{
    return instance({
        method:"post",
        url:"userlist",
        data:fileData
    })
}