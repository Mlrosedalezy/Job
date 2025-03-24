const { verifyAccessToken } = require('../utils/auth');

// 验证用户是否已登录
function isAuthenticated(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: "未授权" });
    }

    const user = verifyAccessToken(token);
    if (!user) {
        return res.status(403).send({ message: "无效的令牌" });
    }

    req.user = user;
    next();
}

// 验证用户角色
function hasRole(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).send({ message: "权限不足" });
        }
        next();
    };
}

module.exports = {
    isAuthenticated,
    hasRole
};