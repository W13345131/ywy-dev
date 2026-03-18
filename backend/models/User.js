import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

//new mongoose.Schema() 用来定义“User 文档”有哪些字段、每个字段的类型和规则。
const userSchema = new mongoose.Schema({
    // 规则用数组表示
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        // 自动去掉首尾空格
        // trim: 修剪，修整；削减，减少；修饰，点缀（尤指某物的边缘）；
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        // 将邮箱地址转换为小写； lowercase：adj.小写字体的
        lowercase: true,
        // 用正则校验邮箱格式，这是一个基础校验，不代表邮箱一定真实存在。
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    }, 
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        // 默认查询时不返回密码字段
        select: false,
    },
    profileImageUrl: {
        type: String,
        // 默认 null 表示用户没设置头像
        default: '',
    },
    // role	String	角色
    role: {
        type: String,
        enum: ['member', 'admin'],
        default: 'member',
    },
    bio: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    coverImageUrl: {
        type: String,
        default: '',
    },
    following: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    },
    followers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    },
}, { 
    // 创建时间,更新时间
    // Mongoose 自动加两个字段：createdAt：创建时间；supdatedAt：更新时间（每次保存更新会变）
    timestamps: true,
});

// 只有当密码被修改时，才重新加密。
userSchema.pre('save', async function() {
    // this 表示当前导入的用户
    // 检查到修改密码后返回!true，即false，继续下一步重新加密
    if(!this.isModified('password')) {
        return;
    }
    
    // genSalt() 的作用是：生成一个“随机盐值”（salt）
    // 数字表示轮数
    const salt = await bcrypt.genSalt(10);
  
    // 把“明文密码 + 盐”变成一个不可逆的加密字符串（hash）
    // bcrypt.hash(明文密码, salt或rounds)
    this.password = await bcrypt.hash(this.password, salt);
});

// 匹配密码
userSchema.methods.matchPassword = async function(enteredPassword) {
    // enteredPassword：用户输入的明文密码
    // this.password：数据库里存的 bcrypt hash
    return await bcrypt.compare(enteredPassword, this.password);
}

// 把 Schema（结构定义）变成一个可以操作数据库的 Model（模型）
// 第一个参数：模型名称
// 第二个参数：文档结构定义
const User = mongoose.model('User', userSchema);

export default User;