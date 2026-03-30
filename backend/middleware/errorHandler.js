// 统一捕获服务器中的各种错误，并返回规范化的 JSON 错误响应。

// 只要有 err 参数，Express 就知道这是 错误处理中间件
const errorHandler = (err, req, res, next) => {
    // 获取错误状态码
    let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    // 获取错误消息
    let message = err.message || 'Internal Server Error';

    // 如果错误是CastError(MongoDB ID 错误)
    if(err.name === 'CastError') {
        message = `Resource not found`;
        statusCode = 404;
    }

    // 如果错误是重复的字段
    if(err.code === 11000) {
        // 获取重复的字段
        // err.keyValue，它是一个对象，表示：哪个字段的值重复了
        // Object.keys(obj) 会返回对象 所有键名组成的数组
        // 取 [0] 就是 拿第一个字段名 来提示
        const field = Object.keys(err.keyValue)[0];
        // 重复的字段已经存在
        message = `${field} already exists`;
        // 设置错误状态码为400
        statusCode = 400;
    }

    // 处理 Mongoose 数据验证错误
    if(err.name === 'ValidationError') {
        // Object.values(err.errors)：取出对象所有 value，变成数组
        message = Object.values(err.errors).map(val => val.message).join(', ');
        // 设置错误状态码为400
        statusCode = 400;
    }

    // 如果错误是LIMIT_FILE_SIZE
    if(err.name === 'LIMIT_FILE_SIZE') {
        // 文件大小超过了最大限制
        message = 'File size exceeded the maximum limit of 10MB';
        // 设置错误状态码为400
        statusCode = 400;
    }

    // 如果错误是JsonWebTokenError
    if(err.name === 'JsonWebTokenError') {
        // 未授权
        message = 'Unauthorized';
        statusCode = 401;
    }

    // 如果错误是TokenExpiredError
    if(err.name === 'TokenExpiredError') {
        // 令牌已过期
        message = 'Token expired';
        statusCode = 401;
    }

    // 打印错误信息
    console.error('Error:', {
        // 错误消息
        message: err.message,
        // 错误堆栈
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })

    // 返回错误响应
    res.status(statusCode).json({
        // 成功标志为false
        success: false,
        message,
        statusCode,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    })
}

export default errorHandler