const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const SECRET_KEY = process.env.JWT_SECRET_KEY || '123456';
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || '78910';

// 生成 Access Token
function generateAccessToken(user) {
    return jwt.sign({ id: user._id, role: user.role,isAuthenticated: user.isAuthenticated }, SECRET_KEY, { expiresIn: '15m' });
}

// 生成 Refresh Token
function generateRefreshToken(user) {
    return jwt.sign({ id: user._id, role: user.role,isAuthenticated: user.isAuthenticated }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
}

// 验证 Access Token
function verifyAccessToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
}

// 验证 Refresh Token
function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, REFRESH_SECRET_KEY);
    } catch (error) {
        return null;
    }
}

// 验证密码
async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// 加密密码
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    comparePassword,
    hashPassword
};