var express = require('express');
var router = express.Router();
const { userListModel, chatListModel, voucherModel } = require('../db/db');
const alipaySdk = require('../utils/alipay')
const { default:AlipayFormData } = require('alipay-sdk/lib/form')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

// 消息模块
// 获取所有用户列表
router.get('/userlist', async function (req, res, next) {
    let { page, pageSize } = req.query

    let data = await userListModel.find().skip((page - 1) * pageSize).limit(pageSize)

    res.send({
        code: 200,
        msg: 'ok',
        data: data
    })
});

// 添加消息列表
router.post('/addChat', async function (req, res, next) {
    let { sender, content, timestamp, receiverId, type, messageType } = req.body

    await chatListModel.create({
        sender: sender,
        content: content,
        timestamp: timestamp,
        receiverId: receiverId,
        type: type,
        messageType: messageType
    })

    res.send({
        code: 200,
        msg: 'ok'
    })
})

// 获取消息列表
router.get('/getChat', async function (req, res, next) {
    let data = await chatListModel.find()

    res.send({
        code: 200,
        msg: 'ok',
        data: data
    })
})

// 我的模块 

// 获取卡卷
router.get('/getVoucher', async function (req, res, next) {
    let { type } = req.query
    console.log(type);

    if (type) {
        let num = (await voucherModel.find({ type: type, num: 1, time: { $gte: Date.now() } })).length

        res.send({
            code: 200,
            msg: 'ok',
            data: num
        })
    } else {
        let data = await voucherModel.find()

        res.send({
            code: 200,
            msg: 'ok',
            data: data
        })
    }
})

// 添加卡卷
router.post('/addVoucher', async function (req, res, next) {
    let { name, type, time } = req.body

    await voucherModel.create({ name: name, type: type, time: time, num: 1 })

    res.send({
        code: 200,
        msg: 'ok'
    })
})

// 使用补签卡
router.post('/useBuVoucher', async function (req, res, next) {

    await voucherModel.updateOne({ type: '补签卡', num: 1 }, { $set: { num: 0 } })

    res.send({
        code: 200,
        msg: 'ok'
    })
})

// 支付宝沙箱支付
router.post('/payment', async (req, res) => {
    //订单号
    let orderId = req.body.orderId;
    //商品总价
    let price = req.body.price;
    //购买商品的名称
    let name = req.body.name;

    // 开始对接支付宝API， AlipayFormData 是支付宝SDK提供的类，用于封装请求参数
    const formData = new AlipayFormData();
    //调用setMethod 并传入get,会返回可以跳转到支付页面的url,
    formData.setMethod("get");

    // 支付时信息
    const bizContent = {
        out_trade_no: orderId, //订单号
        product_code: "FAST_INSTANT_TRADE_PAY", // 产品码（即时到账）
        total_amount: price, //总价格
        subject: name, //商品名称
        body: "商品详情", //商品描述
    };
    // bizContent 是支付宝接口要求的业务参数，必须包含订单关键信息
    formData.addField("bizContent", bizContent);
    // 支付成功或失败的返回链接（前端页面）
    formData.addField("returnUrl", "http://localhost:5173/clientTel");

    // 返回promise
    // exec()方法通常用于执行API请求，负责生成请求参数、签名、构建请求URL或表单数据
    const result = alipaySdk.exec(  // 这里返回可直接跳转的 URL
        // "alipay.trade.wep.pay",   --此为唤起手机版支付，测试时显示系统方面有bug所以用的下面这个   ---网页版支付
        "alipay.trade.page.pay", // 支付宝接口名称（pc端）
        {}, // 公共参数（空对象表示默认）
        { formData: formData } // 表单数据
    ).catch(error => console.error('caught error!', error));

    //对接支付宝成功，支付宝返回的数据
    result.then((resp) => {
        res.send({
            data: {
                code: 200,
                success: true,
                msg: "支付中",
                paymentUrl: resp,  // 支付宝返回的支付页面URL
            },
        });
    });
})

const axios = require("axios");
router.post('/paymentQuery', async (req, res) => {
    let out_trade_no = req.body.out_trade_no;  // 商户订单号
    let trade_no = req.body.trade_no;  // 支付宝交易号
    // 支付宝配置
    const formData = new AlipayFormData();
    //调用setMethod 并传入get,会返回可以跳转到支付页面的url,
    formData.setMethod("get");
    // 支付时信息
    const bizContent = {
        out_trade_no,
        trade_no
    };
    formData.addField("bizContent", bizContent);

    // 返回promise
    const result = alipaySdk.exec(
        "alipay.trade.query", // 调用 alipay.trade.query 接口查询交易状态
        {},
        { formData: formData }
    ).catch(error => console.error('caught error!', error));
    //对接支付宝API
    result.then(resData => {
        console.log(resData);
        axios({
            method: "GET",
            url: resData
        }).then(resdata => {
            let respondeCode = resdata.data.alipay_trade_query_response;
            if (respondeCode.code == 10000) { //请求成功，进一步判断 trade_status；40004：交易不存在；50000：其他错误
                switch (respondeCode.trade_status) {
                    case 'WAIT_BUYER_PAY':  // 等待交易
                        res.send({
                            code: 10001,
                            message: "支付宝有交易记录，没付款"
                        })
                        break;
                    case 'TRADE_FINISHED':  // 交易完成
                        // 完成交易的逻辑
                        res.send({
                            code: 10002,
                            message: "交易完成(交易结束，不可退款)"
                        })
                        break;
                    case 'TRADE_SUCCESS':  // 支付成功
                        // 完成交易的逻辑
                        res.send({
                            code: 10002,
                            message: "交易完成"
                        })
                        break;
                    case 'TRADE_CLOSED':  // 交易关闭
                        // 交易关闭的逻辑
                        res.send({
                            code: 10003,
                            message: "交易关闭"
                        })
                        break;
                }
            } else if (respondeCode.code == 40004) {
                return res.send({
                    code: 40004,
                    message: "交易不存在"
                })
            }
        }).catch(err => {
            return res.send({
                code: 50000,
                msg: "交易失败",
                data: err
            })
        })
    })
})

module.exports = router;
