var express = require('express');
var router = express.Router();
// 引入生成token的方法和密钥
const { REFRESH_TOKEN_SECRET, generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/token');
const Core = require('@alicloud/pop-core') // 引入阿里云 SDK
const tencentcloud = require("tencentcloud-sdk-nodejs-iai"); // 引入腾讯云 SDK
const { userListModel } = require('../db/db');

// 创建client对象
const client = new Core({
    accessKeyId: 'process.env.AL_ACCESS_KEY_ID',  // 自己的 AccessKey ID
    accessKeySecret: 'process.env.AL_ACCESS_KEY_SECRET',  // 自己的 AccessKey Secret
    endpoint: 'https://dysmsapi.aliyuncs.com',  // API 访问入口，根据实际情况修改
    apiVersion: '2017-05-25'  // API 版本号，根据实际情况修改
});
let yanzhenma = ''
// 生成验证码
function getYzm() {
    const yzm = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return yzm.toString()
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// 密码登录 生成token
router.post('/login', async function (req, res, next) {
    let data = req.body;
    let user = await userListModel.find({ username: data.username, password: data.password });
    console.log(user);
    
    if (!user) {
        res.send({
            code: 202,
            msg: '用户名或密码错误'
        });
        return;
    } else {
        let accessToken = generateAccessToken(data);
        let refreshToken = generateRefreshToken(data);
        res.send({
            code: 200,
            msg: '登录成功',
            data: {
                accessToken,
                refreshToken,
                user
            }
        });
    }
});

// 向手机发送验证码
router.post('/getyzm', async function (req, res, next) {
    const { phone,type } = req.body  // 获取手机号
    
    const user = await userListModel.findOne({ tel: phone });
    
    if (user || type == 'change') {
        const code = getYzm()  // 生成验证码
        yanzhenma = code  // 找回密码的校验，yanzhengma存储的是生成的验证码
        console.log(phone, code, yanzhenma);
        const params = {
            "RegionId": "cn-qingdao", // 短信服务所在区域，可以参考阿里云文档
            "PhoneNumbers": phone, // 目标手机号码
            "SignName": "项目应用", // 短信签名名称，需先在阿里云控制台中申请审核通过
            "TemplateCode": "SMS_478930445", // 短信模板 CODE，需先在阿里云控制台中申请审核通过
            "TemplateParam": JSON.stringify({ // 短信模板参数，为 JSON 字符串格式
                "code": code // 模板中的变量名和对应的值
            })
        }
        // 设置请求超时时间
        const requestOption = {
            method: 'POST',
            timeout: 5000
        }
        // 调用SendSms接口发送短信
        client.request('SendSms', params, requestOption).then((result) => {
            console.log(JSON.stringify(result));
            res.status(200).json({
                code: 200,
                msg: '发送成功'
            })
        }, (ex) => {
            console.log(1122,ex);  // 打印异常
            res.status(500).json({  // 返回错误状态码和错误信息
                code: 500,
                msg: '发送失败'
            })
        })
    }else{
        res.send({
            code: 201,
            msg: '手机号未注册'
        })
    }
})

// 手机号验证码登录 || 修改手机号
router.post('/verifyyzm', async function (req, res, next) {
    let { tel, yzm, id } = req.body
    console.log(tel, yzm, yanzhenma,id);
    const data = await userListModel.findOne({tel})
    if (data) {
        if (yzm == yanzhenma) {
            res.send({
                code: 200,
                msg: '验证成功',
                data:{
                    accessToken:generateAccessToken({username: data.username,password: data.password}),
                    refreshToken:generateRefreshToken({username: data.username,password: data.password}),
                    user:data
                }
            })
        } else {
            res.send({
                code: 201,
                msg: '验证码错误，请重新输入'
            })
        }
    }else{
        if (yzm == yanzhenma) {
            await userListModel.updateOne({ _id: id }, { tel:tel })
            res.send({
                code: 202,
                msg: '修改成功'
            })            
        } else {
            res.send({
                code: 201,
                msg: '验证码错误，请重新输入'
            })
        }
    }
})

// 删除手机号
router.post('/delTel', async function (req, res, next) {
    const { id, yzm } = req.body
    console.log(id, yzm, yanzhenma );
    if(yzm == yanzhenma){
        await userListModel.deleteOne({ _id: id })
        res.send({
            code: 200,
            msg: '删除成功'
        })
    }else{
        res.send({
            code: 201,
            msg: '验证码错误，请重新输入'
        })
    }
})

// 人脸登录
router.post('/facelogin', async function (req, res, next) {
    // 获取前端的人脸图片
    const { b64 } = req.body
    // 实例化要请求产品(以CVM为例)的client对象
    const IaiClient = tencentcloud.iai.v20200303.Client;
    const clientConfig = {
        credential: {
            secretId:'process.env.TENCENTCLOUD_SECRET_ID', //自己的腾讯secretId
            secretKey:'process.env.TENCENTCLOUD_SECRET_KEY',  //自己的腾讯密匙
        },
        region: "ap-beijing",  //地域参数（华北地区北京）
        profile: {  // 配置请求环境
            httpProfile: {  // 配置http网络环境
                endpoint: "iai.tencentcloudapi.com",  // 请求域名
            },
        },
    };
    const client = new IaiClient(clientConfig) //创建client对象

    const params = { // 请求参数
        "GroupIds": [  //你创建的人员库ID
            "zs"
        ],
        "Image": b64,  //图片的base64格式编码
        "NeedPersonInfo": 1,  //是否返回人员具体信息。0 为关闭，1 为开启。默认为 0。
        "QualityControl": 0,  //图片质量控制。 0: 不进行控制； 1:较低的质量要求
        "FaceMatchThreshold": 85,  //人脸对比度设置为大于85才可
    };
    // doc为人脸识别后的返回信息
    let doc = await client.SearchFaces(params)
    console.log(doc);

    if(doc.FaceNum===1){  //表示当前人脸库有该人员
        let personName = doc.Results[0].Candidates[0].PersonName  //拿到该人员的名称
        console.log(personName,'personNume');

        //根据该人员的名称去MongoDB中查询该用户对象(可以跳过这一步)
        let data = await userListModel.findOne({username:personName})
        //生成token
        let accessToken = generateAccessToken({username: data.username,password: data.password});
        let refreshToken = generateRefreshToken({username: data.username,password: data.password});

        res.send({
            code: 200,
            msg: "登录成功！",
            data:{
                accessToken,
                refreshToken,
                user: data
            }
        })
    }else{
        res.send({
            code:251,
            msg:'人脸库无此人！'
        })
    }
})

// 刷新AccessToken
router.post('/refresh', function (req, res, next) {
    // 获取refreshToken
    let refreshToken = req.headers.refreshtoken

    // 验证refreshToken
    let data = verifyToken(refreshToken, REFRESH_TOKEN_SECRET)
    try {
        if (data) {
            // 生成新的accessToken
            let accessToken = generateAccessToken({ username: data.username, password: data.password })

            res.send({
                code: 200,
                msg: '刷新成功',
                data: accessToken
            })
        } else {
            res.send({
                code: 403,
                msg: '长token无效'
            })
        }
    } catch (err) {
        res.send({
            code: 500,
            msg: 'refresh Serve Err'
        })
    }
})

module.exports = router;