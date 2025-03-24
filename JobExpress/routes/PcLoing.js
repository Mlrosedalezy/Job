var express = require("express");
var router = express.Router();
const { sendVerificationCode} = require('../routes/ShortMessage'); // 引入发送验证码函数
const {userTenementModel} = require("../db/db")
const { generateAccessToken, generateRefreshToken, comparePassword, hashPassword } = require('../utils/auth');
// 账号密码登录接口（不需要验证码）
router.post('/login', async (req, res, next) => {
    try {
        const { phoneNumber, password } = req.body;

        if (!phoneNumber || !password) {
            return res.status(400).send({ message: "手机号和密码不能为空" });
        }

        const user = await userTenementModel.findOne({ phoneNumber: phoneNumber });

        if (!user) {
            return res.status(404).send({ message: "用户不存在" });
        }

        if (!await comparePassword(password, user.password)) {
            return res.status(401).send({ message: "密码错误" });
        }

        // 生成 Access Token 和 Refresh Token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.send({ message: "登录成功", accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "登录失败" });
    }
});

// 手机短信登录接口
router.post('/sms-login', async (req, res, next) => {
    try {
        const { phoneNumber, verificationCode } = req.body;

        if (!phoneNumber || !verificationCode) {
            return res.status(400).send({ message: "手机号和验证码不能为空" });
        }

        const user = await userTenementModel.findOne({ phoneNumber: phoneNumber });

        if (!user) {
            return res.status(404).send({ message: "用户不存在" });
        }

        if (user.verificationCode !== verificationCode) {
            return res.status(401).send({ message: "验证码错误" });
        }

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(401).send({ message: "验证码已过期" });
        }

        // 清除验证码
        await userModel.updateOne(
            { phoneNumber: phoneNumber },
            { $set: { verificationCode: null, verificationCodeExpires: null } }
        );

        // 生成 Access Token 和 Refresh Token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.send({ message: "登录成功", accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "登录失败" });
    }
});


// 请求重置密码验证码
router.post('/request-reset-password-code', async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).send({ message: "手机号不能为空" });
        }

        const user = await userTenementModel.findOne({ phoneNumber: phoneNumber });

        if (!user) {
            return res.status(404).send({ message: "用户不存在" });
        }

        const response = await sendVerificationCode(phoneNumber);
        res.send({ message: "验证码已发送", response });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "发送验证码失败" });
    }
});

// 重置密码接口
router.post('/reset-password', async (req, res, next) => {
    try {
        const { phoneNumber, verificationCode, newPassword } = req.body;

        if (!phoneNumber || !verificationCode || !newPassword) {
            return res.status(400).send({ message: "手机号、验证码和新密码不能为空" });
        }

        const user = await userTenementModel.findOne({ phoneNumber: phoneNumber });

        if (!user) {
            return res.status(404).send({ message: "用户不存在" });
        }

        if (user.verificationCode !== verificationCode) {
            return res.status(401).send({ message: "验证码错误" });
        }

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(401).send({ message: "验证码已过期" });
        }

        // 清除验证码
        await userModel.updateOne(
            { phoneNumber: phoneNumber },
            { $set: { verificationCode: null, verificationCodeExpires: null } }
        );

        // 更新密码
        const hashedPassword = await hashPassword(newPassword);
        await userModel.updateOne(
            { phoneNumber: phoneNumber },
            { $set: { password: hashedPassword } }
        );

        res.send({ message: "密码重置成功" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "密码重置失败" });
    }
});


// 刷新 Access Token
router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).send({ message: "Refresh Token 不能为空" });
        }

        const user = verifyRefreshToken(refreshToken);
        if (!user) {
            return res.status(403).send({ message: "无效的 Refresh Token" });
        }

        // 生成新的 Access Token
        const accessToken = generateAccessToken(user);

        res.send({ message: "Token 刷新成功", accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Token 刷新失败" });
    }
});


module.exports = router;