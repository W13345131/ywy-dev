// 管理员权限中间件
const adminOnly = (req, res, next) => {
    // 如果用户存在且角色为 admin
    if(req.user && req.user.role === 'admin') {
        // 继续执行后面的接口
        next();
    } else {
        // 如果用户不存在或角色不为 admin，则返回错误
        res.status(403).json({
            success: false,
            error: 'Access denied, admin only',
        })
    }
}

export default adminOnly;