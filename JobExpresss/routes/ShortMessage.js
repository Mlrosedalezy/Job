var express = require("express");
var router = express.Router();
const SMSClient = require("@alicloud/sms-sdk");
const {userTenementModel} = require("../db/db")

// 配置AccessKey ID和AccessKey Secret
const accessKeyId = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
const accessKeySecret = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;


if (!accessKeyId || !accessKeySecret) {
    throw new Error("Missing environment variables: ALIBABA_CLOUD_ACCESS_KEY_ID or ALIBABA_CLOUD_ACCESS_KEY_SECRET");
}

// 创建SMS客户端实例
const smsClient = new SMSClient({
    accessKeyId: accessKeyId,
    secretAccessKey: accessKeySecret // 确保参数名称正确
});

const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
// 发送短信验证码
async function sendVerificationCode(phoneNumber) {
    

    try {
        // const response = await smsClient.sendSMS({
        //     PhoneNumbers: phoneNumber, // 手机号码
        //     SignName: "SMSverific验证", // 短信签名名称
        //     TemplateCode: "SMS_480105228", // 短信模板code
        //     TemplateParam: JSON.stringify({ code: verificationCode }) // 模板参数
        // });

       
        // 存储验证码和过期时间
        await userTenementModel.updateOne(
            { phoneNumber: phoneNumber },
            { $set: { verificationCode:verificationCode, verificationCodeExpires: Date.now() + 5 * 60 * 1000 } },
            { upsert: true }
        );

        // return response;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
}

// 验证验证码
async function verifyVerificationCode(phoneNumber, code) {
    try {
        // 查询数据库中的验证码和过期时间
        const user = await userTenementModel.findOne({ phoneNumber: phoneNumber });

        if (!user) {
            return { success: false, message: "未找到该手机号的验证码记录" };
        }

        const { verificationCode, verificationCodeExpires } = user;

        // 检查验证码是否过期
        if (Date.now() > verificationCodeExpires) {
            return { success: false, message: "验证码已过期" };
        }

        // 检查验证码是否正确
        if (verificationCode === code) {
            return { success: true, message: "验证码正确" ,user:user};
        } else {
            return { success: false, message: "验证码错误" };
        }
    } catch (error) {
        console.error('Error verifying SMS:', error);
        return { success: false, message: "验证码验证失败" };
    }
}


module.exports = {
    router,
    sendVerificationCode, // 导出验证码函数
    verifyVerificationCode
};