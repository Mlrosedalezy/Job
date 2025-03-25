const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'RoseLoine1314';
const REFRESH_TOKEN_SECRET = 'RoseLoine1314';

// 生成短期token
const generateAccessToken = (user) => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '3s', algorithm: 'HS256' });
}
// 生成长期token
const generateRefreshToken = (user) => {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
}

// 验证短token
const verifyAccessToken=()=>{
    return function (req, res, next) {
        let AccessToken = req.headers['authorization']     
        if (!AccessToken) {
            const resp = {
                code: 402,
                msg: '你没有权限,当前你没有携带短token'
            }
            res.send(resp)
        } else {
            //短token
            let AccessToken = req.headers['Authorization']
            let AccessFlag = verifyToken(AccessToken, ACCESS_TOKEN_SECRET)
            if (AccessFlag) {
                next()
            } else {
                const resp = {
                    code: 401,
                    msg: '你没有权限,短token过期'
                }
                res.send(resp)
            }
        }
    }
}

// 验证长token
const verifyRefreshToken=(token,user)=>{
    let code = 200
    jwt.verify(token,REFRESH_TOKEN_SECRET,(err,data)=>{
        if(err){
            if(err.message == 'invalid token'){
                code = 402
                msg = '无效的token'
                return
            }
            if(err.message == 'jwt expired'){
                code = 402
                msg = 'token过期'
                return
            }
            code = 402
            msg = '未知token错误'
            return
        }
        code = 200
        msg = '有效的token'
        return
    })
    
    return{
        code,
        msg
    }
}

// 验证token
let verifyToken = function(token,secretkey){
  try{
    let res = jwt.verify(token,secretkey)
    return res
  }catch(err){
    return false
  }
}
module.exports = {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    verifyToken
}