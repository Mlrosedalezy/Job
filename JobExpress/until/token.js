const jwt = require('jsonwebtoken')
const secret = "RoseLoine1314"  //密钥

// 设置token过期时间，单位为秒
const accessTokenTIme = '5s'
const refreshTokenTIme = '7d'

// 生成短token
const setAccessToken = (payload) => {
    // payload存储用户信息
    return jwt.sign(payload, secret, { expiresIn: accessTokenTIme,algorithm: 'HS256' })
}

// 生成长token
const setRefreshToken = (payload) => {
    // payload存储用户信息

    return jwt.sign(payload, secret, { expiresIn: refreshTokenTIme,algorithm: 'HS256' })
}

// 验证token
const verifyToken = (token) => {
    try {
        let res = jwt.verify(token, secret)
        // return res.exp > res.iat ? true : false
        res.states = res.exp > res.iat ? true : false
        return res
    } catch (err) {
        return false
    }
}

module.exports = {
    secret,
    setAccessToken,
    setRefreshToken,
    verifyToken
}