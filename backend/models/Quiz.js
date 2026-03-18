import mongoose from 'mongoose'

const quizSchema = new mongoose.Schema({
    userId: {
        // ObjectId 是 MongoDB 用来唯一标识一条数据的特殊类型。
        // 只有 ObjectId 才能和：ref: 'User' 搭配使用
        type: mongoose.Schema.Types.ObjectId,
        // 这是 Mongoose 里实现“关联关系”最核心的一行代码
        // ref 就是告诉 Mongoose：“这个 ObjectId 是来自哪个模型”
        ref: 'User',
        required: true
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        // 自动去掉首尾空格
        trim: true,
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: {
            // 选项数组
            type: [String],
            required: true,
            // 自定义校验规则（Validation Rule）
            // array 是数组，array.length 是数组长度 => 数组长度必须为 4
            // array => array.length === 4 是回调函数，返回布尔值
            // 'Must have 4 options' 是错误信息
            validate: [array => array.length === 4, 'Must have 4 options'],
        },
        correctAnswer: {
            type: String,
            required: true,
        },
        explanation: {
            type: String,
            // Mongoose 字段默认值（默认赋值
            default: '',
        },
        difficulty: {
            type: String,
            // 枚举校验（Enum Validation）
            // 只能取枚举值中的一个
            enum: ['easy', 'medium', 'hard'],
            default: 'medium',
        },
    }],
    userAnswers: [{
        // 用户答案对象数组
        questionId: {
            // 问题索引
            type: Number,
            required: true
        },
        selectedAnswer: {
            // 用户选择的答案
            type: String,
            required: true
        },
        isCorrect: {
            // 是否正确
            type: Boolean,
            default: false
        },
        answeredAt: {
            // 回答时间
            type: Date,
            // 默认当前时间
            default: Date.now
        },
    }],
    score: {
        type: Number,
        default: 0
    },
    // 总问题数
    totalQuestions: {
        type: Number,
        required: true
    },
    // 完成时间
    // 默认 null 表示未完成
    completedAt: {
        type: Date,
        default: null
    },
}, {
    // 创建时间,更新时间
    // Mongoose 自动加两个字段：createdAt：创建时间；supdatedAt：更新时间（每次保存更新会变）
    timestamps: true
});

// 这一句是数据库性能优化的关键
// 在 quizzes 集合中，按 userId 和 documentId 创建一个联合索引
// 1 表示正序，-1 表示倒序
// 联合索引可以提高查询效率，因为可以同时按多个字段查询
quizSchema.index({ userId: 1, documentId: 1 });

// 把 Schema（结构定义）变成一个可以操作数据库的 Model（模型）
// 第一个参数：模型名称
// 第二个参数：文档结构定义
const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;