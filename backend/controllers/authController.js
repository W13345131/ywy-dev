import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// 生成JWT令牌
// id 是用户 ID
const generateToken = (id) => {
    // expiresIn 过期时间
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' }) // 7天过期
}


// 创建新用户 → 生成 JWT token → 返回用户信息给前端
export const register = async (req, res, next) => {
    try {
        // 解构赋值，username 是用户名，email 是邮箱，password 是密码
        const { username, email, password, adminInviteToken } = req.body;

        // 检查邮箱或用户名是否已存在
        // $or: 任意满足一个即可
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        // 如果用户已存在，则返回错误
        if(userExists) {
            return res.status(400).json({
                success: false,
                error: 
                  // 如果邮箱已存在，则返回邮箱已存在错误
                  userExists.email === email
                    ? 'Email already exists'
                    : 'Username already exists',
                statusCode: 400,
            })
        }

        // 检查管理员邀请令牌是否有效（需同时配置 ADMIN_INVITE_TOKEN 且 token 匹配）
        let role = 'member';
        const adminToken = process.env.ADMIN_INVITE_TOKEN;
        if (adminToken && adminInviteToken && adminInviteToken === adminToken) {
            role = 'admin';
        }

        // 创建用户（传入 role，否则使用模型默认值 member）
        const user = await User.create({ username, email, password, role });

        // 生成 JWT token
        const token = generateToken(user._id);

        // 返回成功响应
        res.status(201).json({
            // 成功标志
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImageUrl: user.profileImageUrl,
                    createdAt: user.createdAt,
                    role: user.role,
                },
                token,
            },
            message: 'User registered successfully',
            statusCode: 201,
        })

    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {

        // 解构赋值，email 是邮箱，password 是密码
        const { email, password } = req.body;

        // 验证输入
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email and password',
                statusCode: 400,
            })
        }
        
        // 检查用户是否存在
        // select('+password')：查询结果里包含密码字段
        const user = await User.findOne({ email }).select('+password');
        // 如果用户不存在，则返回错误
        if(!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
                statusCode: 401,
            })
        }

        // 检查密码是否正确
        const isMatch = await user.matchPassword(password);
        // 如果密码不正确，则返回错误
        if(!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
                statusCode: 401,
            })
        }

        // 生成 JWT token
        const token = generateToken(user._id);

        // 返回成功响应
        res.status(200).json({
            // 成功标志
            success: true,
            // 用户信息
            user: {
                // 用户 ID
                id: user._id,
                // 用户名
                username: user.username,
                // 邮箱
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                role: user.role,
            },
            token,
            message: 'Login successful',
        })

    } catch (error) {
        next(error)
    }
}

// 获取用户信息
export const getProfile = async (req, res, next) => {
    try {

        // 解构赋值，user 是用户
        const user = await User.findById(req.user._id);

        // 返回成功响应
        res.status(200).json({
            // 成功标志
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                role: user.role,
            },
        })

    } catch (error) {
        next(error)
    }
}


// 修改用户信息
export const updateProfile = async (req, res, next) => {
    try {

        // 解构赋值，username 是用户名，email 是邮箱，profileImage 是头像
        const { username, email, profileImageUrl } = req.body;

        // 根据用户id查找用户
        const user = await User.findById(req.user._id);

        // 如果用户名存在，则更新用户名
        if(username) user.username = username;
        // 如果邮箱存在，则更新邮箱
        if(email) user.email = email;
        // 如果头像存在，则更新头像
        if(profileImageUrl) user.profileImageUrl = profileImageUrl;

        // 保存用户数据
        await user.save();

        // 返回成功响应
        res.status(200).json({
            // 成功标志
            success: true,
            // 用户信息
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                role: user.role,
            },
            message: 'Profile updated successfully',
        })

    } catch (error) {
        next(error)
    }
}


// 修改密码
export const changePassword = async (req, res, next) => {
    try {

        // 解构赋值，oldPassword 是旧密码，newPassword 是新密码
        const { oldPassword, newPassword } = req.body;

        // 如果旧密码或新密码不存在，则返回错误
        if(!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an old password and new password',
                statusCode: 400,
            })
        }
        
        // 根据用户id查找用户
        // select('+password')：查询结果里包含密码字段
        const user = await User.findById(req.user._id).select('+password');
        // 检查旧密码是否正确
        const isMatch = await user.matchPassword(oldPassword);

        // 如果旧密码不正确，则返回错误
        if(!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Old password is incorrect',
                statusCode: 401,
            })
        }

        // 更新密码
        user.password = newPassword;
        await user.save();

        // 返回成功响应
        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        })

    } catch (error) {
        next(error)
    }
}