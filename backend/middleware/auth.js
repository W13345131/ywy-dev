//验证用户的 JWT Token，如果合法就允许访问接口，否则拒绝
import jwt from 'jsonwebtoken'
import User from '../models/User.js'


// 定义中间件,Express 中间件结构：(req, res, next) => { ... }
// req：HTTP请求对象
// res：HTTP响应对象
// next：下一个中间件
const protect = async (req, res, next) => {
    let token;

    // req.headers 是 Express 里请求对象 req 的“请求头集合”
    // 请求头集合：
    // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    // Content-Type: application/json
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            // 按空格拆分请求头集合，取第二个元素
            token = req.headers.authorization.split(' ')[1];
            // 验证token，调用 jsonwebtoken 库的 verify 方法
            // token: 要验证的 token
            // process.env.JWT_SECRET: 密钥
            // decoded: 解码后的 token 数据
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // 获取用户，查询结果里不要 password 字段
            req.user = await User.findById(decoded.id).select('-password');

            // 如果用户不存在
            if(!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found',
                    statusCode: 401,
                })
            }
            // 认证通过
            // 继续执行后面的接口
            next();
        } catch (error) {
            // 如果验证 token 失败
            console.error('Auth middleware error:', error.message);

            // 如果 token 过期
            if(error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token expired',
                    statusCode: 401,
                })
            }

            // 如果 token 验证失败
            return res.status(401).json({
                success: false,
                error: 'Not authorized, token failed',
                statusCode: 401,
            })
        }
    } else {
        // 如果请求头里没有 token
        return res.status(401).json({
            success: false,
            error: 'Not authorized, no token',
            statusCode: 401,
        })
    }
};


export default protect;