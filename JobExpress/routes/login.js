const express = require("express");
const router = express.Router();
const { userTenementModel } = require('../db/db'); // 引入用户模型
const { sendVerificationCode,verifyVerificationCode  } = require('../routes/ShortMessage'); // 引入发送验证码函数
const { generateAccessToken, generateRefreshToken,verifyAccessToken,verifyRefreshToken} = require('../utils/auth');

// 请求发送验证码
router.post('/request-verification-code', async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).send({ message: "手机号不能为空" });
        }
        const response = await sendVerificationCode(phoneNumber);
        res.send({ message: "验证码已发送", response });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "发送验证码失败" });
    }
});

// 验证 Access Token 接口
router.post('/verify-token', async (req, res, next) => {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).send({ message: "Access Token 不能为空" });
        }
        const decoded = verifyAccessToken(accessToken);
        if (!decoded) {
            return res.status(403).send({ message: "无效的 Access Token" });
        }

        // 可以选择在这里进一步验证用户信息，例如从数据库中查找用户
        const user = await userTenementModel.findById(decoded.id);
        if (!user) {
            await userTenementModel.updateOne({_id:user._id},{isAuthenticated:false})
            return res.status(403).send({ message: "用户不存在" });
        }
        res.send({ message: "Access Token 验证成功", user, });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Access Token 验证失败" });
    }
});


// 刷新 Access Token
router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        console.log(req.body,"refreshToken")
        if (!refreshToken) {
            return res.status(400).send({ message: "Refresh Token 不能为空" });
        }

        const user = verifyVerificationCode(refreshToken);
        if (!user) {
            const userFromDb = await userTenementModel.findById(user._id);
            if (userFromDb) {
                await userTenementModel.updateOne({_id:user._id},{isAuthenticated:true})
            }
            await userTenementModel.updateOne({_id:user._id},{isAuthenticated:false})
            return res.status(403).send({ message: "无效的 Refresh Token" });
        }
        
        // 生成新的 Access Token
        const accessToken = generateAccessToken(user);
        await userTenementModel.updateOne({_id:user._id},{isAuthenticated:true})
        res.send({ message: "Token 刷新成功", accessToken,isAuthenticated:user.isAuthenticated });
    } catch (error) {
        console.error(error);
        await userTenementModel.updateOne({_id:user._id},{isAuthenticated:false})
        res.status(500).send({ message: "Token 刷新失败" });
    }
});

// 验证验证码接口
router.post('/verify-verification-code', async (req, res, next) => {
    try {
        const { phoneNumber, code } = req.body;

        if (!phoneNumber || !code) {
            return res.status(400).send({ message: "手机号和验证码不能为空" });
        }

        const result = await verifyVerificationCode(phoneNumber, code);
         console.log(result.message);
        if (result.success) {
            const user = result.user;
            await userTenementModel.updateOne({_id:user._id},{isAuthenticated:true})
            generateAccessToken(user.isAuthenticated)
            const accessToken = generateAccessToken(result.user._id);
            const refreshToken = generateRefreshToken(result.user._id);
            res.status(200).send({ 
                message: result.message,
                status:200, 
                accessToken: accessToken, 
                refreshToken: refreshToken, 
                expiresAt: Date.now() + 3600 * 1000 // 假设 token 有效期为 1 小时
            });
        } else {
            res.status(400).send({ message: result.message,status:400 });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "验证码验证失败" });
    }
});


// 获取用户状态接口
router.post('/get-user-status', async (req, res, next) => {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).send({ message: "Access Token 不能为空" });
        }

        const decoded = verifyAccessToken(accessToken);
        if (!decoded) {
            return res.status(403).send({ message: "无效的 Access Token" });
        }

        const user = await userTenementModel.findById(decoded.id);
        if (!user) {
            return res.status(403).send({ message: "用户不存在" });
        }

        // 返回用户状态
        res.send({
            message: "用户状态获取成功",
            isAuthenticated: user.isAuthenticated,
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                avatar:user.avatar,
                userName: user.userName,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "获取用户状态失败" });
    }
});

// 更改用户名称接口
router.post('/update-username', async (req, res, next) => {
    try {
        const { accessToken, newUsername } = req.body;

        if (!accessToken || !newUsername) {
            return res.status(400).send({ message: "Access Token 和新用户名不能为空" });
        }

        const decoded = verifyAccessToken(accessToken);
        if (!decoded) {
            return res.status(403).send({ message: "无效的 Access Token" });
        }

        const user = await userTenementModel.findById(decoded.id);
        if (!user) {
            return res.status(403).send({ message: "用户不存在" });
        }

        // 更新用户名
        const updateResult = await userTenementModel.updateOne(
            { _id: decoded.id },
            { $set: { userName: newUsername } }
        );

        if (updateResult.nModified === 0) {
            return res.status(500).send({ message: "用户名更新失败" });
        }

        res.send({ message: "用户名更新成功", user: { id: decoded.id, userName: newUsername } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "用户名更新失败" });
    }
});


module.exports = router;