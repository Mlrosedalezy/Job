var express = require('express');
var router = express.Router();
const { rbacModel, routesModel, userListModel } = require('../db/db')
const { setAccessToken, setRefreshToken, verifyToken } = require('../until/token')

// 检测token
router.post('/checktoken', function (req, res, next) {
    let token = req.body.token
    let result = verifyToken(token)
    // console.log(result);

    res.send({
        code: 200,
        data: result
    })
})

// 账号密码登录接口
router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body
        console.log(username, password);

        let user = await rbacModel.find({ username: username })

        if (!user[0].username) {
            res.send({ mes: "用户名不存在", status: "201", })
        }
        if (username == user[0].username) {
            if (password != user[0].password) {
                res.send({ mes: "密码错误", status: "202", })
            } else {
                // 携带的用户信息
                const userInfo = { username: user[0].username, role: user[0].role, timeout: user[0].timeout, permiss: user[0].Permiss, status: user[0].status, id: user[0]._id };

                // 返回前端携带双token的响应
                res.send({
                    mes: "OK",
                    status: "200",
                    data: {
                        // 获取双tkoen
                        accessToken: setAccessToken(userInfo),
                        refreshToken: setRefreshToken(userInfo)
                    }
                })
            }
        }
    } catch (error) {
        console.log(error);

        res.send({ message: 'login Serve Err', status: 500, })
    }
});

let code_cun = ''  //存储验证码用于校验
// 随机生成四位验证码
function getCode() {
    const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return code.toString()
}
// 模拟手机号登录
router.post('/telcode', async function (req, res, next) {
    try {
        let { tel, tel_code } = req.body
        console.log(req.body);

        let code = getCode()  //获取生成的验证码
        let user = await rbacModel.find({ tel })
        console.log(user);

        if (!tel_code) {  //验证码不存在，获取验证码
            if (user[0].tel != tel) {
                res.send({ "mes": "该手机号未注册", status: 404, })
            } else {
                res.send({ "mes": "验证码", data: code, })
                code_cun = code
            }
        } else {  //验证码存在，检测验证码
            if (tel_code == code_cun) {  //通过验证执行操作
                // 携带的用户信息
                const userInfo = { username: user[0].username, role: user[0].role, timeout: user[0].timeout, permiss: user[0].Permiss, status: user[0].status, id: user[0]._id };
                res.send({
                    "mes": "验证通过", status: 200,
                    data: { accessToken: setAccessToken(userInfo), refreshToken: setRefreshToken(userInfo) }
                })
            } else {  //验证未通过，返回错误信息
                res.send({ mes: "验证码错误", status: 400, })
            }
        }
    } catch (error) {
        res.send({ message: 'telcode Serve Err', status: 500, })
    }
});

// 真实阿里云手机号登录
const Core = require('@alicloud/pop-core') // 引入阿里云 SDK
router.post('/altelcode', async function (req, res, next) {
    try {
        let { tel, tel_code } = req.body
        let code = getCode()  //获取生成的验证码
        let user = await rbacModel.find({ tel: tel })
        if (!tel_code) {  //验证码不存在，获取验证码
            if (user[0].tel != tel) {
                res.send({ "mes": "该手机号未注册", status: 404, })
            } else {
                // 创建client对象
                const client = new Core({
                    accessKeyId: process.env.AL_ACCESS_KEY_ID,
                    accessKeySecret: process.env.AL_ACCESS_KEY_SECRET,
                    endpoint: "https://dysmsapi.aliyuncs.com",
                    apiVersion: "2017-05-25",
                })

                const params = {
                    "RegionId": "cn-青岛",  //短信服务所在区域，通过那个计算中心
                    "PhoneNumbers": tel,  //手机号
                    "SignName": "项目应用",  //短信签名
                    "TemplateCode": "SMS_478930445",  //短信模板
                    "TemplateParam": JSON.stringify({  //短信模版参数，为JSON格式 
                        code: code   //设置验证码参数
                    })
                }

                // 设置请求超时时间
                const requestTimeOut = {
                    method: "POST",
                    timeout: 5000,
                }

                // 发送短信，调用SendSms接口
                client.request('SendSms', params, requestTimeOut).then((result) => {
                    // console.log(JSON.stringify(result));
                    code_cun = code
                    res.send({
                        "mes": "验证码发送成功",
                        data: code,
                        status: 200
                    })
                }, (err) => {
                    console.log(err);  //打印错误信息
                    res.send({
                        "mes": "验证码发送失败",
                        data: err,
                        status: 500
                    })
                })
            }
        } else {  //验证码存在，检测验证码
            if (tel_code == code_cun) {  //通过验证执行操作
                // 携带的用户信息
                const userInfo = { username: user[0].username, role: user[0].role, timeout: user[0].timeout, permiss: user[0].Permiss, status: user[0].status, id: user[0]._id };
                res.send({
                    "mes": "验证通过", status: 200,
                    data: { accessToken: setAccessToken(userInfo), refreshToken: setRefreshToken(userInfo) }
                })
            } else {  //验证未通过，返回错误信息
                res.send({ mes: "验证码错误", status: 400, })
            }
        }
    } catch (error) {
        res.send({ message: 'telcode Serve Err', status: 500, })
    }
})

// 刷新token接口
router.post('/refresh_token', function (req, res, next) {
    try {
        // 获取请求头中的长token
        const r_tk = req.headers.refreshtoken

        // 解析token，参数 密钥 回调函数的返回
        let rsp = verifyToken(r_tk)
        if (rsp) {
            res.send({
                message: '长token有效',
                status: 200,
                data: {
                    accessToken: setAccessToken({ rsp }),
                }
            })
            // } else {
            //     res.send({ message: '长token失效，请重新登陆', status: 403, })
        }

    } catch (err) {
        res.send({ message: 'refresh Serve Err', status: 500, })
    }
});

// 人脸识别接口
const tencentcloud = require("tencentcloud-sdk-nodejs-iai") // 腾讯云人脸识别
// router.post('/loginface', async function (req, res, next) {
//     const imgB64 = req.body.imgB64

//     const client = new tencentcloud.IaiClient({
//         credential: {
//             secretId: process.env.TX_ACCESS_KEY_ID,  //腾讯的secretId
//             secretKey: process.env.TX_ACCESS_KEY_SECRET,  //腾讯的secretKey密钥
//         },
//         region: "ap-beijing",  //地域参数（华北地区北京）
//         profile: {
//             httpProfile: {
//                 endpoint: "iai.tencentcloudapi.com",  //腾讯云的API地址
//             },
//         }
//     })

//     const params = {
//         "GroupIds": ['0629'],  //你创建的人员库ID
//         "Image": imgB64,  //base64的图片
//         "NeedPersonInfo": 0,  //是否需要返回人员库信息,0不需要，1需要,默认为0
//         "QualityControl": 0,  //图片质量控制，0：不进行控制，1：较低的质量要求，2：一般的质量要求，3：较高的质量要求，默认为0
//         "FaceMatchThreshold": 80,  //匹配阈值，0-100，默认为70
//     }

//     const rsp = await client.SearchFaces(params)
//     console.log(rsp);

//     if (rsp.Results[0].Candidates.length != 0) {  //当前人员库有该人员
//         const personName = rsp.Results[0].Candidates[0].PersonName  //获取人员名称
//         console.log(personName);
//         res.send({
//             code: 200,
//             msg: '登录成功',
//             accessToken: setAccessToken({ username: personName }),
//             refreshToken: setRefreshToken({ username: personName })
//         })
//     } else {
//         res.send({
//             code: 401,
//             msg: '登录失败，人员库查无此人'
//         })
//     }
//     return;
// })

// 动态路由
router.post('/getroutes', async (req, res) => {
    let routes = await routesModel.find()
    
    res.send({
        code: 200,
        msg: '获取成功',
        data: routes
    })
})

module.exports = router;