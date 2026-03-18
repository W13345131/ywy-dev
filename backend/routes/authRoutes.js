import express from 'express'
// express-validator 是一个 请求数据验证库,express-validator 是一个 请求数据验证库
import { body } from 'express-validator'
import { upload } from '../middleware/uploadMiddleware.js'

// 引入控制器
// register	用户注册
// login	用户登录
// getProfile	获取用户信息
// updateProfile	修改用户信息
// changePassword	修改密码
import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
} from '../controllers/authController.js'

import protect from '../middleware/auth.js'

// 创建路由实例
const router = express.Router()

const registerValidation = [
    // 验证用户名
    body('username')
    // 去掉首尾空格
      .trim()
      // 验证用户名长度
      .isLength({ min: 3 })
      // 验证用户名长度错误信息
      .withMessage('Username must be at least 3 characters long'),
    // 验证邮箱
    body('email')
      // 验证邮箱格式
      .isEmail()
      // 将邮箱地址转换为小写
      .normalizeEmail() 
      // 验证邮箱格式错误信息
      .withMessage('Invalid email address'),
    // 验证密码
    body('password')
      // 验证密码长度
      .isLength({ min: 6 })
      // 验证密码长度错误信息
      .withMessage('Password must be at least 6 characters long'),
]

const loginValidation = [
    // 验证邮箱
    body('email')
      // 验证邮箱格式
      .isEmail()
      // 将邮箱地址转换为小写
      .normalizeEmail() 
      // 验证邮箱格式错误信息
      .withMessage('Invalid email address'),
    body('password')
      // 验证密码长度
      .isLength({ min: 6 })
      // 验证密码长度错误信息
      .withMessage('Password must be at least 6 characters long'),
]

// 公共路由,不需要认证
// 注册路由
router.post('/register', registerValidation, register);
// 登录路由
router.post('/login', loginValidation, login);

// 需要认证的路由
// 获取用户信息路由
router.get('/profile', protect, getProfile);
// 修改用户信息路由
router.put('/profile', protect, updateProfile);
// 修改密码路由
router.put('/change-password', protect, changePassword);

// 上传图片
router.post('/upload-image', upload.single('image'), (req, res) => {

  if(!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded',
      statusCode: 400,
    })
  }

  // 生成图片 URL
  // req.protocol: 请求协议
  // req.get('host'): 请求主机
  // req.file.filename: 文件名
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/pictures/${req.file.filename}`;

  res.status(200).json({
    success: true,
    data: imageUrl,
    message: 'Image uploaded successfully',
  })

})



// 导出路由实例
export default router;